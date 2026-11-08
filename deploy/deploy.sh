#!/usr/bin/env bash
# ==============================================================================
# 韩语学习平台 (Korean Master) - 自动化部署脚本 (Linux / macOS / Git Bash)
# 用法：
#   部署测试环境：bash deploy/deploy.sh test [develop-abc1234 | test]
#   部署生产环境：bash deploy/deploy.sh prod v1.0.0
# ==============================================================================

set -euo pipefail

ENV_TYPE="${1:-test}"
TARGET_TAG="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

export IMAGE_REPO="${IMAGE_REPO:-ghcr.io/jingtianla/korean-master}"

if [[ "${ENV_TYPE}" == "prod" ]]; then
  if [[ -z "${TARGET_TAG}" || "${TARGET_TAG}" == "latest" ]]; then
    echo "❌ [错误] 生产环境部署必须指定具体的版本号（例如 v1.0.0），严禁使用 latest！"
    exit 1
  fi
  COMPOSE_FILE="docker-compose.prod.yml"
  STATE_CURRENT=".prod_current_tag"
  STATE_PREV=".prod_previous_tag"
  HEALTH_URL="http://localhost:3000/api/health"
else
  TARGET_TAG="${TARGET_TAG:-test}"
  COMPOSE_FILE="docker-compose.test.yml"
  STATE_CURRENT=".test_current_tag"
  STATE_PREV=".test_previous_tag"
  HEALTH_URL="http://localhost:3001/api/health"
fi

# 记录上一个版本标签，供 rollback.sh 一键回滚使用
if [[ -f "${STATE_CURRENT}" ]]; then
  PREV_TAG="$(cat "${STATE_CURRENT}")"
  if [[ -n "${PREV_TAG}" && "${PREV_TAG}" != "${TARGET_TAG}" ]]; then
    echo "${PREV_TAG}" > "${STATE_PREV}"
    echo "📦 已备份上一版本标签: ${PREV_TAG} (记录于 ${STATE_PREV})"
  fi
fi

export IMAGE_TAG="${TARGET_TAG}"
echo "🚀 正在部署 [${ENV_TYPE}] 环境，目标镜像: ${IMAGE_REPO}:${IMAGE_TAG} ..."

if [[ -z "$(docker images -q "${IMAGE_REPO}:${IMAGE_TAG}")" ]]; then
  docker compose -f "${COMPOSE_FILE}" pull
fi
docker compose -f "${COMPOSE_FILE}" up -d

echo "⏳ 正在执行健康检查 (${HEALTH_URL})..."
for i in {1..15}; do
  if curl -fsS "${HEALTH_URL}" > /dev/null 2>&1; then
    echo "${IMAGE_TAG}" > "${STATE_CURRENT}"
    echo "✅ [${ENV_TYPE}] 环境部署成功并已通过健康检查！当前运行版本: ${IMAGE_TAG}"
    exit 0
  fi
  sleep 2
done

echo "❌ [错误] 健康检查超时失败！请执行 bash deploy/rollback.sh ${ENV_TYPE} 回滚上一版本。"
exit 1
