# 🇰🇷 韩语学习平台 (Korean Master)

> **面向中文母语者的全栈交互式韩语学习工作台** —— 融合 GitHub 四大韩语开源项目精华，集「四十音真人点读、韩语音变规则实时转写、延世韩国语汉字词源单词本、分级语法题库与自动错题本」于一体。

---

## ✨ 四大核心学习模块

| 模块 | 核心能力 | 解决痛点 |
| :--- | :--- | :--- |
| **1. 🔬 音变规则实验室** | 输入任意韩语句子，自动推演**连音化、鼻音化、紧音化、送气化、颚音化**，输出真实口语读音、`0.65x` 慢速跟读与中文规则卡片 | 解决“每个字都会读，连成句子就读不准、听不懂”的最大痛点 |
| **2. 🎵 四十音点读馆** | 涵盖基础元音、复合元音、松音/紧音/送气音及收音（韵尾），配中国人专属防踩坑口诀与口型指导 | 防止用错误中文谐音（如把 `ㅓ` 读成“鹅”）养成发音恶习 |
| **3. 📖 延世汉字词源本** | 基于《延世韩国语》核心词汇，打通「韩文 ↔ 繁体汉字词根 ↔ 中文释义」三维联想，支持一键加入生词本 | 利用中国人懂汉字的天然优势，秒记 60% 以上的韩语汉字词 |
| **4. 🎓 分级语法与自测** | 覆盖初级（TOPIK 1-2）、中级（TOPIK 3-4）、高级（TOPIK 5-6）核心语法，配随堂单选自测与自动错题集 | 学完语法立刻刷题巩固，答错自动归档错题本 |

---

## 🚀 怎么启动网站？（3 种方式任选，新手零门槛）

### 方式一：鼠标双击一键启动（最推荐日常学韩语时用！）

无需打开黑窗口敲命令！直接打开项目文件夹 `D:\AI\11.韩语`，用鼠标双击：
👉 **`双击启动韩语学习网站.bat`**
它会自动启动后台服务，并自动弹出浏览器打开 **`http://localhost:3000`**。

---

### 方式二：5 分钟首次克隆与本地开发启动（新队友必看）

如果你或队友刚把仓库克隆到新电脑上，按键盘 `Win` 键打开 **Windows PowerShell**，整段复制粘贴以下 3 行命令即可跑起来：

```powershell
# 1. 进入项目文件夹
cd "D:\AI\11.韩语"

# 2. 一键安装依赖、生成 .env 配置文件并激活 Git Hooks（首次运行执行一次即可）
pnpm install; pnpm setup

# 3. 启动本地开发服务器
pnpm dev
```

启动后在浏览器访问：**http://localhost:3000**（健康检查接口：http://localhost:3000/api/health）。
想要停止服务时，在 PowerShell 窗口按快捷键 **`Ctrl + C`** 即可。

---

### 方式三：使用 Docker 容器启动（测试环境 / 生产环境）

```powershell
cd "D:\AI\11.韩语"

# 一键部署并启动测试环境容器 (访问端口 http://localhost:3001)
.\deploy\deploy.ps1 -Env test -Tag test

# 一键部署并启动生产环境容器 (必须指定具体版本号，严禁使用 latest，访问端口 http://localhost:3000)
.\deploy\deploy.ps1 -Env prod -Tag v0.1.0

# 一键回滚生产环境到上一个稳定版本
.\deploy\rollback.ps1 -Env prod
```

---

## 🛠️ 技术栈与工程规范概览

- **全栈框架**：Next.js 15 (App Router) + React 19 + TypeScript 5（单仓单服务）
- **UI 与图标**：Tailwind CSS 3 + Lucide React
- **数据与语音**：本地结构化词库 / SQLite + 浏览器原生 Web Speech API (`ko-KR`)
- **代码质量门禁**：ESLint 9 + Prettier 3 + Husky 9 + lint-staged + commitlint
- **单元测试门禁**：Vitest + V8 Coverage（**强制要求核心逻辑覆盖率 >= 60%**，当前覆盖率 **94.51%**）

---

## 📋 常用研发命令速查

| 命令 (pnpm) | 等效 Makefile 命令 | 作用说明 |
| :--- | :--- | :--- |
| `pnpm setup` | `make setup` | 初始化 `.env`、创建 `data/` 目录并激活 Husky Git Hooks |
| `pnpm dev` | `make dev` | 启动本地热更新开发服务器 (`http://localhost:3000`) |
| `pnpm check` | `make check` | **【提交/PR 必跑】** 一键执行格式检查 + Lint + 类型检查 + 单测覆盖率 + 生产构建 |
| `pnpm test:coverage` | `make test` | 运行 Vitest 单元测试并校验 60% 覆盖率门禁 |
| `pnpm format` | `make format` | 使用 Prettier 自动格式化全部源码与测试文件 |
| `pnpm build` | `make build` | 执行 Next.js 生产环境构建 |

---

## 📚 团队协作与 AI 编程文档导航

- 🤖 **[AGENTS.md](./AGENTS.md)**：给所有 AI 编码工具（Antigravity / Cursor / Claude / Copilot）的强制编码与自检规范。
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)**：新人从“领 Issue 任务 → 开分支 → 提 PR → 部署上线 → 回滚”的 15 步完整指南、Mermaid 流程图与日常 10 条命令速查卡。
- ⚙️ **[GITHUB_SETUP_GUIDE.md](./GITHUB_SETUP_GUIDE.md)**：GitHub 网页端保姆级配置手册（“点哪里 → 填什么”）。
- 📝 **[CHANGELOG.md](./CHANGELOG.md)**：版本发布与变更记录。
