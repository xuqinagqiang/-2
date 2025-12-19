
# LubeTrack Pro - 智能润滑管理系统 (云同步版)

这是一个专业的设备润滑记录与提醒系统，支持移动端/电脑端实时数据同步、AI 维护助手以及完善的库存管理。

## 🚀 部署指南 (GitHub + Vercel)

本项目可以完全免费部署在 Vercel 上。

### 第一步：准备数据库 (Supabase)
1. 访问 [Supabase](https://supabase.com/) 并创建一个新项目。
2. 在 **SQL Editor** 中执行之前提供的建表脚本（创建 `equipment`, `records`, `inventory`, `transactions` 等表）。
3. 在 `Project Settings` > `API` 中获取你的 **Project URL** 和 **Anon Key**。

### 第二步：上传至 GitHub
1. 在 GitHub 上创建一个新的私有或公开仓库。
2. 将本项目的所有文件推送到该仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [你的仓库URL]
   git push -u origin main
   ```

### 第三步：部署至 Vercel
1. 登录 [Vercel](https://vercel.com/)，点击 **Add New** > **Project**。
2. 导入你刚才创建的 GitHub 仓库。
3. **关键步骤：配置环境变量**
   在部署页面的 `Environment Variables` 部分，添加以下三个变量：
   - `API_KEY`: 填入你的 Google Gemini API Key。
   - `SUPABASE_URL`: 填入你的 Supabase URL。
   - `SUPABASE_ANON_KEY`: 填入你的 Supabase Anon Key。
4. 点击 **Deploy**。

### 第四步：使用
部署完成后，Vercel 会提供一个访问域名（如 `lube-track.vercel.app`）。在手机和电脑浏览器中打开此链接，数据将通过 Supabase 自动实时同步。

## 🛠 技术栈
- **Frontend**: React 19, Tailwind CSS, Lucide Icons
- **Backend/DB**: Supabase (PostgreSQL + Realtime)
- **AI**: Google Gemini API (gemini-3-flash-preview)
- **Deployment**: Vercel

## 📝 权限要求
- 摄像头权限（用于润滑现场拍照留证）
