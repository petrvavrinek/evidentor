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
COPY ./postcss.config.mjs .

# Debug build
ENV DEBUG=*

# Build application
RUN bun run build

FROM base AS runner

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production

CMD ["bun", "server.js"]
