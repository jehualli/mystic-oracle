# CLAUDE.md — mystic-oracle

Next.js 14 astrology/horoscope app. Prisma + PostgreSQL, NextAuth, Stripe,
OpenAI GPT-4o. Docker-ready.

Build, test and database commands come from `package.json` scripts — read those
rather than trusting a copy here. Docker Compose has two stacks: `docker-compose.dev.yml`
for development and `docker-compose.yml` for the full production stack.

## Trabajo en curso: motor de tránsitos

El siguiente paso del proyecto es sustituir el contenido por signo solar con
**cálculo de tránsitos** (posiciones planetarias actuales contra la carta
natal). La propuesta completa —arquitectura, fases, riesgos y seis decisiones
pendientes— está en **`docs/transits-proposal.md`**. Léela antes de tocar nada
relacionado con astrología.

Nada de esto está implementado todavía y las seis decisiones siguen abiertas;
la primera (biblioteca de efemérides, MIT contra AGPL) tiene implicaciones
legales porque la aplicación cobra mediante Stripe.

### Advertencia sobre `src/lib/astrology.ts`

Ese módulo es andamiaje provisional, no cálculo real. Tres defectos conocidos,
documentados en la propuesta:

- `getAscendant()` (líneas 50-59) usa latitud donde corresponde longitud, y la
  fórmula del ascendente es un marcador de posición.
- `getMoonSign()` (líneas 40-45) parte de una longitud lunar equivocada en la
  época de referencia: está desfasada unos tres signos.
- `birthTime` es una cadena sin zona horaria, lo cual es especialmente
  problemático con datos de nacimiento mexicanos.

No construyas nada encima de esas funciones sin corregirlas primero (fase 0).

### Regla para el LLM

OpenAI redacta prosa a partir de hechos ya calculados. **Nunca calcula
posiciones, aspectos ni fechas.** Las interpretaciones se guardan en caché por
firma de tránsito porque son idénticas para todos los usuarios.
