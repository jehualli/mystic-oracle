# ☽ Mystic Oracle — App de Astrología

Web app de astrología con estética bohemia-vintage construida con Next.js 14, PostgreSQL y Stripe.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: API Routes de Next.js
- **Base de datos**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (email/password)
- **IA**: OpenAI GPT-4o para horóscopos, lecturas y chat
- **Pagos**: Stripe (pago único por lectura)
- **Deploy local**: Docker Compose

## Características

| Función | Gratis | De pago |
|---|---|---|
| Horóscopo diario | ✅ | — |
| Carta natal básica | ✅ | — |
| Carta natal detallada (IA) | — | $4.99 MXN |
| Compatibilidad básica | ✅ | — |
| Informe de compatibilidad (IA) | — | $3.99 MXN |
| Chat con el Oráculo (3 msgs) | ✅ | — |
| Sesión completa Oráculo (10 msgs) | — | $2.99 MXN |

---

## Setup rápido con Docker

### 1. Clonar y configurar variables

```bash
cp .env.example .env
```

Edita `.env` con tus claves:

```env
NEXTAUTH_SECRET=un-secreto-aleatorio-muy-largo
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Levantar con Docker Compose (producción)

```bash
docker compose up --build
```

La app estará en [http://localhost:3000](http://localhost:3000)

### 3. O en modo desarrollo (hot-reload)

```bash
docker compose -f docker-compose.dev.yml up
```

---

## Setup Stripe (pagos)

### Modo test (desarrollo local)

1. Crea una cuenta en [stripe.com](https://stripe.com)
2. Ve a **Developers → API Keys** y copia las claves de test
3. Instala Stripe CLI: `brew install stripe/stripe-cli/stripe`
4. Autentica: `stripe login`
5. En otra terminal, redirige webhooks a tu app local:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
6. Copia el `whsec_...` que aparece y ponlo en tu `.env`

### Tarjetas de prueba

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 9995` | Pago rechazado |

Usa cualquier fecha futura y cualquier CVC.

---

## Variables de entorno completas

```env
# Base de datos (Docker ya la configura)
DATABASE_URL="postgresql://postgres:mysticpassword@localhost:5432/mystic_oracle"

# NextAuth
NEXTAUTH_SECRET="genera con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/         # Login y registro (sin Navbar)
│   ├── (app)/          # Páginas protegidas con Navbar
│   │   ├── dashboard/
│   │   ├── carta-natal/
│   │   ├── compatibilidad/
│   │   ├── oraculo/
│   │   ├── horoscopo/
│   │   └── pago-exitoso/
│   └── api/            # API Routes
├── components/
│   ├── ui/             # Button, Input, Card
│   ├── ZodiacWheel.tsx # Rueda zodiacal SVG interactiva
│   ├── BirthChart.tsx  # Carta natal SVG con tooltips
│   ├── ChatOracle.tsx  # Chat streaming con Mystika
│   ├── CompatibilityMeter.tsx
│   └── PaywallModal.tsx
└── lib/
    ├── astrology.ts    # Cálculos astrológicos locales
    ├── openai.ts       # Generación de contenido con GPT
    ├── stripe.ts       # Checkout y verificación de compras
    ├── auth.ts         # NextAuth config
    └── prisma.ts       # Cliente de base de datos
```

---

## Comandos útiles

```bash
# Dentro del container o con Node local:
npm run db:migrate     # Crear/actualizar tablas
npm run db:seed        # Poblar horóscopo de hoy
npm run db:studio      # Abrir Prisma Studio (GUI de DB)
```
