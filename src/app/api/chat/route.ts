import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { streamOracleResponse } from "@/lib/openai";
import { getUserPurchases } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { messages, sessionId } = await req.json();

  // Verify access
  const purchases = await getUserPurchases(userId);
  const hasAccess = purchases.includes("sesion_oraculo");

  if (!hasAccess) {
    // Allow 3 free messages total for all users
    const allChats = await prisma.chatSession.findMany({
      where: { userId },
      select: { messages: true },
    });
    const totalFreeMessages = allChats.reduce((acc, c) => {
      const msgs = c.messages as { role: string }[];
      return acc + msgs.filter((m) => m.role === "user").length;
    }, 0);

    if (totalFreeMessages >= 3) {
      return new Response(
        JSON.stringify({ error: "PAYWALL", message: "Has usado tus 3 consultas gratuitas. Desbloquea una sesión completa con el Oráculo." }),
        { status: 402 },
      );
    }
  }

  // Get or create chat session
  let chatSession = sessionId
    ? await prisma.chatSession.findFirst({ where: { id: sessionId, userId } })
    : null;

  if (!chatSession) {
    chatSession = await prisma.chatSession.create({
      data: { userId, messages: [], credits: hasAccess ? 10 : 3 },
    });
  }

  // Update session messages
  const updatedMessages = [...(chatSession.messages as object[]), ...messages.slice(-1)];
  await prisma.chatSession.update({
    where: { id: chatSession.id },
    data: { messages: updatedMessages, updatedAt: new Date() },
  });

  // Get user's birth data for personalization
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sunSign: true, moonSign: true, ascendant: true },
  });

  // Stream the response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      try {
        const birthData = user
          ? { sunSign: user.sunSign ?? undefined, moonSign: user.moonSign ?? undefined, ascendant: user.ascendant ?? undefined }
          : null;
        for await (const chunk of streamOracleResponse(messages, birthData)) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }
        // Save assistant response to session
        await prisma.chatSession.update({
          where: { id: chatSession!.id },
          data: {
            messages: [...updatedMessages, { role: "assistant", content: fullResponse, timestamp: new Date() }],
            title: chatSession!.title ?? messages[0]?.content?.slice(0, 50),
          },
        });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, sessionId: chatSession!.id })}\n\n`));
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Error al consultar el oráculo" })}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
