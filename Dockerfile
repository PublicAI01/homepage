# syntax=docker.io/docker/dockerfile:1
# Based on https://github.com/vercel/next.js/tree/canary/examples/with-docker

ARG NODE_VERSION=24-slim

# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN npm install -g pnpm@11

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
# Disable telemetry if you want
# ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ============================================
# Stage 3: Run Next.js application
# ============================================
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy public assets
COPY --from=builder --chown=node:node /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next && chown node:node .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
