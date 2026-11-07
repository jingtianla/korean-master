# 🧭 GitHub 网页端手动配置保姆级清单（点哪里 → 填什么）

这份文档为您整理了所有需要在 GitHub 网页上用鼠标点选完成的一次性配置。请按顺序逐项打勾操作：

---

## 第一步：创建私有仓库、邀请队友与分配权限

### 1. 创建你的私有仓库 (Private Repository)
1. 打开浏览器访问 [https://github.com/new](https://github.com/new)（您已登录 `jingtianla`）。
2. **Repository name（仓库名称）**：填 `korean-master`。
3. **Description（描述，选填）**：填 `面向中文母语者的全栈韩语学习平台`。
4. **Public / Private（公开或私有）**：点选 **🔒 Private（私有仓库，只有你和邀请的队友能看）**。
5. **Initialize this repository with...**：**全部不要勾选**（不要勾 Add a README file、不要选 .gitignore，因为我们已经在本地全部建好了！）。
6. 点击右下角绿色按钮 **Create repository**。

### 2. 邀请队友并分配权限（等队友账号确定后操作）
1. 进入刚创建的 `jingtianla/korean-master` 仓库页面。
2. 点击顶部导航栏最右侧的 **⚙️ Settings（设置）**。
3. 点击左侧菜单栏的 **Collaborators（协作者）** → 点击绿色按钮 **Add people**。
4. 输入队友的 GitHub 用户名或邮箱，点击选择并发送邀请（个人私有仓库协作者默认拥有 Write 读写权限，可提 PR 和评审）。

---

## 第二步：设置合并选项（只允许 Squash Merge + 自动删分支）

1. 在仓库的 **⚙️ Settings** 页面，确保左侧选中的是第一个 **General（常规）**。
2. 向下滚动页面找到 **Pull Requests** 区域：
   - ❌ **取消勾选** `Allow merge commits`
   - ✅ **保持勾选** `Allow squash merging`（并将下方下拉框设为 `Default to pull request title and commit details`）
   - ❌ **取消勾选** `Allow rebase merging`
   - ✅ **勾选** `Always suggest updating pull request branches`
   - ✅ **勾选** `Automatically delete head branches`（合并后自动删除源功能分支）
   *(注：勾选后 GitHub 会自动保存，无需点保存按钮。)*

---

## 第三步：配置分支保护规则 (Rulesets) —— 保护 `main` 和 `develop`

> ⚠️ **注意**：请先完成我们在终端里的“首次代码推送（把本地 `main` 和 `develop` 推送到 GitHub）”后，再配置此项。

1. 在仓库的 **⚙️ Settings** 页面，点击左侧菜单栏 **Code and automation** 下的 **Rules → Rulesets**。
2. 点击右上角绿色按钮 **New ruleset** → 选择 **New branch ruleset**。
3. 按以下内容填写：
   - **Ruleset Name（规则名称）**：填 `protect-main-and-develop`
   - **Enforcement status（启用状态）**：点击下拉框改为 **Active（启用）**（默认是 Disabled，一定要改！）。
   - **Target branches（目标保护分支）**：
     - 点击 **Add target** → 选择 **Include default branch**（这会自动保护 `main` 分支）。
     - 再次点击 **Add target** → 选择 **Include by pattern** → 输入 `develop` → 点击 **Add inclusion pattern**。
   - **Branch rules（勾选以下保护项）**：
     - ✅ **Restrict deletions**（禁止删除分支，默认已勾）
     - ✅ **Require a pull request before merging**（只能通过 PR 合并，禁止直接 push）：
       - 展开后将 **Required approvals（必需审批人数）** 设为 **`1`**。
       - 勾选 ✅ **Dismiss stale pull request approvals when new commits are pushed**（有新提交时之前的 Approve 自动失效）。
       - 勾选 ✅ **Require review from Code Owners**（要求 CODEOWNERS 审批）。
       - 勾选 ✅ **Require conversation resolution before merging**（所有评审意见必须处理完）。
     - ✅ **Require status checks to pass**（必须 CI 门禁通过才能合并）：
       - 点击 **Add checks**，搜索并添加：`1. 分支命名规范校验` 和 `2. 格式 / Lint / 类型 / 单测覆盖率(>=60%) / 构建`。
     - ✅ **Block force pushes**（禁止强推 `git push --force`，默认已勾）。
4. 滚到页面最底部，点击绿色按钮 **Create** 保存！

---

## 第四步：配置 Environments（`test` 与 `production` 审批门禁）

1. 在仓库的 **⚙️ Settings** 页面，点击左侧菜单栏的 **Environments（环境）**。
2. **创建测试环境 `test`**：
   - 点击 **New environment** → 输入名称 `test` → 点击 **Configure environment**（无需勾选审批人，方便合入 `develop` 后自动部署测试环境）。
3. **创建生产环境 `production`（带负责人人工审批）**：
   - 再次点击左侧 **Environments** → 点击 **New environment** → 输入名称 `production` → 点击 **Configure environment**。
   - 勾选 ✅ **Required reviewers（必需审批人）**。
   - 在输入框中搜索并输入你的 GitHub 用户名：`jingtianla`，选中它。
   - 点击下方的 **Save protection rules** 保存！
   *(效果：以后每次打 `v1.0.0` 标签发布生产环境时，流水线会自动暂停并给你发通知，必须你在网页上点 Approve 才会真正部署生产！)*

---

## 第五步：配置 Actions Secrets（密钥管理清单）

> 💡 **说明**：如果你目前只在**自己电脑**上用 Docker 跑测试和生产容器，**可以完全不用配下面这几个 SSH Secret**（我们的流水线已做智能识别，没填 Secret 时会自动切换为本机 Docker 模式，绝不报错）。将来如果你买了云服务器（如阿里云/腾讯云），再按下面填即可：

1. 在仓库的 **⚙️ Settings** 页面，点击左侧 **Secrets and variables → Actions**。
2. 点击 **New repository secret**，按需添加以下条目：

| Secret 名称 | 用途说明 | 填什么值 / 如何获取 |
| :--- | :--- | :--- |
| `TEST_SSH_HOST` | 测试服务器 IP 地址 | 例如 `<TEST_SERVER_IP>`（如未购买云服务器可留空不配） |
| `TEST_SSH_USER` | 测试服务器 SSH 登录用户名 | 例如 `ubuntu` 或 `root` |
| `TEST_SSH_KEY` | 测试服务器 SSH 私钥 | 在服务器上执行 `ssh-keygen -t ed25519` 后，`~/.ssh/id_ed25519` 文件的完整内容 |
| `PROD_SSH_HOST` | 生产服务器 IP 地址 | 例如 `<PROD_SERVER_IP>` |
| `PROD_SSH_USER` | 生产服务器 SSH 登录用户名 | 例如 `ubuntu` |
| `PROD_SSH_KEY` | 生产服务器 SSH 私钥 | 生产服务器对应的 SSH 私钥全文 |

---

## 第六步：开启密钥泄露扫描 (Secret Scanning)

1. 在仓库的 **⚙️ Settings** 页面，点击左侧 **Code security（代码安全）**。
2. 找到 **Secret scanning** 和 **Push protection**，点击右侧的 **Enable** 开启（若有人误把真实云厂商 Token 或密钥写进代码提交，GitHub 会在 push 时直接拦截）。

---

## 第七步：本机 / 服务器一次性 Docker 准备

### 情况 A：在你自己的 Windows 电脑上跑 Docker 容器
1. 访问 Docker 官网下载安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)，安装后启动 Docker Desktop（右下角出现小鲸鱼图标）。
2. 如需拉取私有仓库镜像，在 GitHub 右上角头像 → **Settings → Developer settings → Personal access tokens → Tokens (classic)** 生成一个勾选了 `read:packages` 的 Token，然后在 PowerShell 执行一次登录：
   ```powershell
   docker login ghcr.io -u jingtianla
   ```

### 情况 B：将来在 Linux 云服务器上准备（一次性执行）
```bash
# 1. 安装 Docker 与 Docker Compose 插件
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. 创建测试与生产部署目录
sudo mkdir -p /opt/korean-master/{test,prod}
sudo chown -R $USER:$USER /opt/korean-master

# 3. 登录 GitHub 镜像仓库
docker login ghcr.io -u jingtianla
```
