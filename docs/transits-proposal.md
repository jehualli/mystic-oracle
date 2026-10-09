# Motor de tránsitos — propuesta

Estado: **propuesta, pendiente de aprobación.** Ninguna línea de código se ha
escrito todavía. Las seis decisiones al final están sin responder.

## El objetivo

Reemplazar el contenido basado en signo solar por **cálculo de tránsitos**:
dónde están los planetas ahora frente a dónde estaban al nacer el usuario, y
qué significa esa geometría.

La personalización sale de la astronomía y de la carta natal. Es determinista,
explicable y **no necesita datos de comportamiento**. Ése es el punto
arquitectónico: la personalización funciona para el usuario número uno, el
primer día, sin nada registrado.

## Estado actual del código

Las entradas ya existen: `User` tiene `birthDate`, `birthTime`, `birthPlace`,
`birthLat`, `birthLng` (`prisma/schema.prisma`). Lo que hay encima es
provisional, y tres cosas corromperían cualquier tránsito calculado a partir
de ahí:

1. **`src/lib/astrology.ts:50-59` — `getAscendant()` usa latitud donde va
   longitud.** El tiempo sidéreo local es `GMST + longitud/15`; la función
   recibe `lat` y nunca recibe la longitud. Además `ascDeg = (lst * 15 + 90)`
   (línea 59) es un marcador de posición: el ascendente real requiere
   oblicuidad de la eclíptica y latitud geográfica a través de un arcotangente.

2. **`src/lib/astrology.ts:40-45` — `getMoonSign()` está desfasada unos tres
   signos.** Asume 318° en 2000-01-01; la Luna estaba cerca de 217°. El
   movimiento medio además ignora alrededor de ±6° de variación real.

3. **`birthTime` es una cadena sin zona horaria** (`prisma/schema.prisma:54`,
   usada en `astrology.ts:52`). Para datos de nacimiento mexicanos esto es
   grave: las reglas de horario de verano cambiaron varias veces y se
   abolieron a nivel nacional en octubre de 2022.

`calculateBirthChart()` (línea 67) sólo contempla siete cuerpos.

## Arquitectura

```
datos de nacimiento ──► carta natal (una vez, en caché)
                             │
tiempo actual ──► posiciones planetarias (una vez por tic, compartidas por TODOS)
                             │
                             ▼
              detección de aspectos (tránsito × natal)
                             │
              puntuación de relevancia ──► tránsitos ordenados
                             │
              caché de interpretaciones ──► prosa + acciones sugeridas
```

Propiedad importante: **el costo de efemérides es O(1), no O(usuarios)**. Las
posiciones de las 14:00 de hoy son idénticas para todo el mundo. Sólo la
comparación con la natal es por usuario, y eso es aritmética.

## Fases

| # | Contenido |
|---|---|
| 0 | Efemérides reales, ASC/MC y casas reales, zona horaria histórica, pruebas contra carta de referencia |
| 1 | Motor de tránsitos: aspectos, orbes, aplicativo/separativo, fecha exacta, pasos múltiples por retrogradación |
| 2 | Puntuación de relevancia y ordenamiento |
| 3 | Interpretación: hechos estructurados → prosa, en caché |
| 4 | Calendario de 12 meses, resumen diario, avisos de fecha exacta, niveles de Stripe |
| 5 | *(opcional)* capa de comportamiento encima |

### Puntuación (fase 2)

```
puntaje = peso_cuerpo × peso_punto_natal × peso_aspecto × cercanía_orbe × bono_aplicativo
```

Planetas lentos pesan más (Plutón/Neptuno/Urano ≈ 1.0, Luna ≈ 0.1); los
impactos a Sol, Luna, Ascendente y Medio Cielo pesan más; conjunción y
oposición por encima de trígono y sextil; la cercanía alcanza su máximo en el
aspecto exacto. Todo recomendación puede mostrar su propia aritmética.

### Caché de interpretaciones (fase 3)

La interpretación de «Saturno en cuadratura al Sol natal en casa 10» es **el
mismo texto para todos los usuarios**; sólo cambian las fechas. Unos 10 cuerpos
× 9 aspectos × 13 puntos ≈ 1 200 combinaciones. Se generan una vez, se guardan
en una tabla `Interpretation` con clave por firma y se reutilizan siempre. El
costo de LLM pasa a ser fijo y único en lugar de por usuario y por día.

**El modelo escribe prosa a partir de hechos calculados y nunca calcula nada.**

### Modelos nuevos de Prisma

- `NatalChart` — posiciones, casas, versión del motor, fecha de cálculo
- `TransitEvent` — calendario precalculado con fechas exactas y puntajes
- `Interpretation` — caché compartida por firma de tránsito

`DailyHoroscope` se queda como está para el nivel gratuito por signo.

## Decisiones pendientes

1. **Biblioteca de efemérides.** Recomendación: **astronomy-engine** — licencia
   MIT, TypeScript puro, sin binarios nativos (funciona en Vercel), precisión
   del orden del minuto de arco, muy por debajo de los orbes de grados que usa
   la astrología. Alternativa: **Swiss Ephemeris**, más precisa y estándar
   profesional, pero AGPL-3.0 o licencia comercial de pago — y como la
   aplicación cobra por Stripe, la AGPL obligaría a ofrecer el código fuente a
   los usuarios. Es una restricción real, no teórica.
2. **Sistema de casas.** ¿Signos enteros por omisión (robusto) y Plácido sólo
   para presentación?
3. **Cuerpos.** ¿Diez clásicos más nodos lunares? Quirón y asteroides exigen
   datos de efemérides que astronomy-engine no incluye.
4. **Aspectos.** ¿Sólo los cinco mayores, o también menores?
5. **Hora de nacimiento desconocida** — afecta a la mayoría de usuarios reales.
   ¿Carta solar como respaldo, sin casas ni ascendente, con aviso honesto?
6. **Gratuito contra pago.** ¿El tránsito principal del día gratis, y
   calendario, avisos y profundidad detrás de Stripe?

## Riesgos

- La precisión de la hora de nacimiento domina todo lo relacionado con casas:
  cuatro minutos de error mueven el ascendente cerca de un grado.
- Las zonas horarias históricas son la fuente más probable de error silencioso,
  sobre todo con datos mexicanos.
- Los pasos múltiples por retrogradación (un planeta lento repite el mismo
  aspecto hasta tres veces en un año) son lo que distingue al software serio y
  también lo más delicado de calcular.
- Control de tono en español a lo largo de ~1 200 interpretaciones en caché.

## Primera entrega

Fase 0 más una rebanada delgada de la fase 1: carta natal real, verificada
contra una carta de referencia conocida, y un punto final que responda **«¿cuáles
son mis tres tránsitos más fuertes hoy y cuándo son exactos?»** De extremo a
extremo, antes de pulir puntuación o interpretación.

## Contexto

Propuesta redactada el 2026-09-27. Sustituye un intento anterior de
personalización por análisis de sentimiento y comportamiento que fracasó por
falta de datos de usuarios: los tránsitos resuelven ese problema por
construcción.
