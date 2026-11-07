import { execSync } from 'child_process';

const validBranchRegex = /^(feature|fix|hotfix|chore|docs)\/\d+-[a-z0-9-]+$/;
const protectedBranches = ['main', 'develop'];

try {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

  if (process.env.ALLOW_INIT_PUSH === 'true') {
    process.exit(0);
  }

  if (protectedBranches.includes(currentBranch)) {
    console.error(
      `\n❌ [Git Hook 拦截] 严禁直接向保护分支 "${currentBranch}" 推送代码！\n` +
        `👉 请从 develop 切出功能分支：git checkout -b feature/<issue号>-<英文简述>\n` +
        `   （如果是首次初始化仓库推送基线，请使用 ALLOW_INIT_PUSH=true git push）\n`,
    );
    process.exit(1);
  }

  if (!validBranchRegex.test(currentBranch)) {
    console.error(
      `\n❌ [分支命名不合规] 当前分支名 "${currentBranch}" 不符合团队规范！\n` +
        `👉 正确格式：<前缀>/<issue号>-<英文短横线描述>\n` +
        `👉 允许前缀：feature/ | fix/ | hotfix/ | chore/ | docs/\n` +
        `👉 正确示例：feature/12-hangul-pronunciation-helper 或 fix/15-audio-bug\n`,
    );
    process.exit(1);
  }

  console.warn(`✅ [Branch Check] 分支命名合规: ${currentBranch}`);
} catch (error) {
  console.error('⚠️ 无法检测当前 Git 分支名称:', error);
  process.exit(1);
}
