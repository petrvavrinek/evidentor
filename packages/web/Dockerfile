FROM oven/bun AS base

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies
COPY ./package.json ./bun.lock ./

# Install all dependencies
RUN bun install

COPY ./src ./src
COPY ./public ./public
COPY ./next.config.ts .
COPY ./tsconfig.json .

# Build application
RUN bun run build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

ENV HOSTNAME=0.0.0.0

CMD ["bun", "server.js"]
