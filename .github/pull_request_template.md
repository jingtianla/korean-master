## 📌 关联 Issue (Linked Issue)

<!-- 必须关联 Issue 编号，合并后将自动关闭对应 Issue。例如：Closes #12 或 Fixes #15 -->
Closes #

---

## 📝 改动说明 (What & Why)

### 1. 改了什么 (What changed)
- 

### 2. 为什么改 (Why this change is needed)
- 

---

## 🧪 怎么测的 (How it was tested)

- [ ] 本地已执行全量自检命令 `pnpm check`（含 Prettier + ESLint + TypeScript + Vitest 单元测试 + Next.js 构建）并全部通过
- [ ] 新增/修改了对应的单元测试（位于 `tests/` 目录）
- [ ] 本地浏览器 (`http://localhost:3000`) 人工验证通过

### 测试步骤说明：
1. 
2. 

---

## 📸 前端界面截图 / 录屏 (Screenshots)

<!-- 如果本次 PR 包含前端界面改动，必须附上改动前后的截图；纯后端或配置改动可填“无前端界面改动” -->


---

## ✅ 提交人自检清单 (Author Checklist)

- [ ] **单一职责**：本 PR 只做一件事，代码净改动量尽量控制在 400 行以内
- [ ] **AI 规范合规**：代码符合根目录 `AGENTS.md` 中的所有规范（无 `any`、无硬编码密钥、已提交 lock 文件）
- [ ] **分支规范**：源分支命名符合 `feature|fix|hotfix|chore|docs/<issue号>-<简述>`
