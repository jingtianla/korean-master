# ==============================================================================
# 韩语学习平台 (Korean Master) - 生产级多阶段构建 Dockerfile
# 硬性规范落实：
# 1. 基础镜像固定具体版本 (node:22.13.1-alpine3.21)，严禁使用 latest
# 2. 多阶段构建 (deps -> builder -> runner)，最小化生产镜像体积
# 3. 使用非 root 用户 (nextjs:nodejs) 运行容器，保障运行时安全
# 4. 内置 HEALTHCHECK 健康检查 (/api/health)
# ==============================================================================

# ------------------------------------------------------------------------------
# 阶段 1：安装依赖 (deps)
# ------------------------------------------------------------------------------
FROM node:22.13.1-alpine3.21 AS deps
WORKDIR /app

# 启用固定版本 pnpm
RUN corepack enable && corepack prepare pnpm@12.18.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ------------------------------------------------------------------------------
# 阶段 2：编译构建 (builder)
# ------------------------------------------------------------------------------
FROM node:22.13.1-alpine3.21 AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.18.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=true

RUN pnpm build

# ------------------------------------------------------------------------------
# 阶段 3：生产运行镜像 (runner)
# ------------------------------------------------------------------------------
FROM node:22.13.1-alpine3.21 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 创建非 root 用户与用户组
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/data && \
    chown -R nextjs:nodejs /app

# 仅复制 standalone 最小化运行产物与静态资源
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换至非 root 用户运行
USER nextjs

EXPOSE 3000

# 容器内置健康检查：每 30 秒检查一次 /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
