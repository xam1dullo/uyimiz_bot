FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml turbo.json package.json ./
COPY apps/api/ ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @uyimiz/api build

FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages ./packages/
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
