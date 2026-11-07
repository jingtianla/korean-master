#!/usr/bin/env bash
# ==============================================================================
# 韩语学习平台 (Korean Master) - 一键回滚脚本 (Linux / macOS / Git Bash)
# 用法：
#   回滚生产环境到上一版本：bash deploy/rollback.sh prod
#   回滚生产环境到指定版本：bash deploy/rollback.sh prod v0.9.0
#   回滚测试环境到上一版本：bash deploy/rollback.sh test
# ==============================================================================

set -euo pipefail

ENV_TYPE="${1:-prod}"
SPECIFIED_TAG="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

export IMAGE_REPO="${IMAGE_REPO:-ghcr.io/jingtianla/korean-master}"

if [[ "${ENV_TYPE}" == "prod" ]]; then
  COMPOSE_FILE="docker-compose.prod.yml"
  STATE_CURRENT=".prod_current_tag"
  STATE_PREV=".prod_previous_tag"
  HEALTH_URL="http://localhost:3000/api/health"
else
  COMPOSE_FILE="docker-compose.test.yml"
  STATE_CURRENT=".test_current_tag"
  STATE_PREV=".test_previous_tag"
  HEALTH_URL="http://localhost:3001/api/health"
fi

if [[ -n "${SPECIFIED_TAG}" ]]; then
  ROLLBACK_TAG="${SPECIFIED_TAG}"
elif [[ -f "${STATE_PREV}" ]]; then
  ROLLBACK_TAG="$(cat "${STATE_PREV}")"
else
  echo "❌ [错误] 未找到上一版本记录文件 (${STATE_PREV})，请在命令后手动指定回滚版本号，例如："
  echo "   bash deploy/rollback.sh ${ENV_TYPE} v1.0.0"
  exit 1
fi

if [[ "${ROLLBACK_TAG}" == "latest" ]]; then
  echo "❌ [错误] 严禁回滚到 latest 标签！请指定具体版本号。"
  exit 1
fi

export IMAGE_TAG="${ROLLBACK_TAG}"
echo "⏪ 正在将 [${ENV_TYPE}] 环境回滚至版本: ${IMAGE_REPO}:${IMAGE_TAG} ..."

docker compose -f "${COMPOSE_FILE}" up -d

echo "⏳ 正在验证回滚后的服务健康状态 (${HEALTH_URL})..."
for i in {1..15}; do
  if curl -fsS "${HEALTH_URL}" > /dev/null 2>&1; then
    echo "${IMAGE_TAG}" > "${STATE_CURRENT}"
    echo "✅ 回滚成功！[${ENV_TYPE}] 环境已恢复至版本: ${IMAGE_TAG}"
    exit 0
  fi
  sleep 2
done

echo "❌ [错误] 回滚后健康检查仍未通过，请执行 docker compose -f ${COMPOSE_FILE} logs 查看日志！"
exit 1
