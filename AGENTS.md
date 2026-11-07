# AGENTS.md — AI 编码助手协作规范（强制执行）

> **致所有 AI 编码助手（Cursor / Claude Code / GitHub Copilot / Antigravity / Windsurf 等）**：
> 本仓库由 2 人开发团队使用 AI 协同开发。你在生成、修改、重构任何代码或配置前，**必须完整阅读并严格遵守本文件中的所有规范**。违反本规范的代码将被 Git Hooks 或 CI 门禁直接拦截。

---

## 1. 项目概览与技术栈

- **项目名称**：韩语学习平台 (`korean-master`)
- **一句话简介**：面向中文母语者的全栈交互式韩语学习平台（集四十音发音点读、音变规则高亮转写、延世汉字词源单词本、分级语法题库与错题本于一体）。
- **仓库形态**：单仓单服务（Next.js Full-Stack Monolith）
- **核心技术栈**：
  - **全栈框架**：Next.js 15 (App Router) + React 19 + TypeScript 5
  - **样式方案**：Tailwind CSS + Lucide Icons
  - **数据存储**：SQLite (本地文件数据存储) / 结构化 JSON 词库与语法库
  - **语音能力**：浏览器 Web Speech API (`ko-KR`) + 服务端 TTS 接口
  - **单元测试**：Vitest + React Testing Library（**核心逻辑测试覆盖率不得低于 60%**）
  - **代码规范**：ESLint 9 + Prettier 3 + Husky + lint-staged + commitlint
  - **包管理器**：`pnpm`（必须锁定并提交 `pnpm-lock.yaml`，禁止混用 `npm install` 或 `yarn`）

---

## 2. 目录结构规范

```text
korean-master/
├── .github/                  # GitHub Issue/PR 模板、CODEOWNERS 与 CI/CD 工作流
├── .husky/                   # Git Hooks 脚本（pre-commit / commit-msg / pre-push）
├── deploy/                   # Docker Compose 测试/生产编排文件与部署/回滚脚本
├── scripts/                  # 跨平台辅助脚本（Windows PowerShell / Shell 自检脚本）
├── src/
│   ├── app/                  # Next.js App Router 页面与后端 API 路由 (src/app/api/*)
│   ├── components/           # 可复用 UI 组件（按功能模块划分，大驼峰命名）
│   ├── data/                 # 开源韩语核心数据集（四十音、延世汉字词源词汇、初中高语法库）
│   ├── lib/                  # 核心纯函数与业务逻辑（如韩语音变规则引擎、发音工具等）
│   └── types/                # 全局 TypeScript 类型定义
├── tests/                    # 单元测试文件（*.test.ts / *.test.tsx）
├── Dockerfile                # 多阶段生产级容器构建文件
├── Makefile                  # 统一研发命令入口 (setup / dev / check / build)
└── package.json              # 项目依赖与脚本定义
```

---

## 3. 命名与编码规范

1. **分支命名规范（硬性要求）**：
   - 格式：`<前缀>/<issue编号>-<英文短横线简述>`
   - 允许的前缀：`feature/`、`fix/`、`hotfix/`、`chore/`、`docs/`
   - 正确示例：`feature/12-hangul-pronunciation-helper`、`fix/15-audio-playback-bug`
   - 错误示例：`dev-login`、`feature/add_word`（缺少 Issue 编号或使用了下划线）
2. **文件与符号命名**：
   - React 组件文件：大驼峰（`PascalCase.tsx`），如 `PronunciationHelper.tsx`
   - 工具函数与 Hook：小驼峰（`camelCase.ts`），如 `koreanPhonetics.ts`、`useSpeech.ts`
   - 常量：全大写下划线（`UPPER_SNAKE_CASE`）
3. **TypeScript 规范**：
   - **严禁使用 `any`**，必须定义清晰的 `interface` 或 `type`。
   - 所有导出的核心纯函数（尤其是 `src/lib/` 下的音变规则、词库检索、测验判分逻辑）必须在 `tests/` 下编写对应的单元测试。
4. **换行与缩进**：
   - 缩进统一为 **2 个空格**，文件编码统一为 **UTF-8**，换行符统一为 **LF**（`.ps1` 脚本除外）。

---

## 4. 提交信息规范（Conventional Commits）

所有 `git commit` 提交信息必须符合 Conventional Commits 规范，并尽量关联 Issue 编号（由 `commitlint` 自动强制校验）：

- 格式：`<type>(<scope>): <subject> (#<issue号>)` 或 `<type>: <subject>`
- 允许的 `type`：
  - `feat`：新功能（例如：`feat(phonetics): add nasalization pronunciation rule (#12)`）
  - `fix`：修复缺陷（例如：`fix(vocab): resolve hanja filter empty state (#18)`）
  - `docs`：文档变更
  - `refactor`：代码重构（不改变外部行为）
  - `test`：新增或修改单元测试
  - `chore`：构建过程、依赖或辅助工具变动

---

## 5. 绝对禁止事项（Red Lines）

1. **禁止硬编码任何密钥**：密码、Token、API Key、服务器真实 IP 一律禁止写入代码或配置文件，必须通过 `process.env.XXX` 读取，并在 `.env.example` 中用占位符说明。
2. **禁止直接推送保护分支**：严禁向 `main` 或 `develop` 分支直接执行 `git push` 或 `git push --force`，一切改动必须通过 Pull Request 合并。
3. **禁止跳过 Git Hooks**：严禁使用 `git commit --no-verify` 或 `git push --no-verify` 绕过本地自检。
4. **禁止在生产配置中使用 `latest` 镜像标签**：Docker 生产部署必须使用具体的语义化版本号（如 `v1.0.0`）或 Git 短 SHA。
5. **禁止大爆炸式 PR**：一个 PR 只做一件事，改动尽量控制在 **400 行以内**。

---

## 6. AI 交付前必跑的自检命令

当你（AI 编码助手）完成任何代码编写或修改后，在向开发者汇报“已完成”之前，**必须主动运行以下全量自检命令并确保 100% 通过**：

```bash
# 方式一：使用 pnpm 统一自检（Windows / macOS / Linux 通用，推荐）
pnpm check

# 方式二：使用 Makefile（需安装 make）
make check
```

> `pnpm check` 会依次执行：**代码格式检查 (Prettier) → 静态代码检查 (ESLint) → TypeScript 类型检查 (`tsc --noEmit`) → 单元测试与 60% 覆盖率门禁 (Vitest) → 生产构建验证 (`next build`)**。只要其中任何一步报错，AI 必须自行修复直至全部绿灯通过！
