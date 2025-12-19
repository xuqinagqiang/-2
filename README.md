
# LubeTrack Pro - 智能润滑管理系统

这是一个支持多端同步和AI分析的工业级设备润滑管理系统。

## 🚀 免费部署到 Vercel

1.  **准备数据库**：在 [Supabase](https://supabase.com/) 创建项目并运行 SQL 脚本建表。
2.  **推送代码**：将所有文件（包括新生成的 `package.json` 等）推送到您的 GitHub 仓库。
3.  **连接 Vercel**：
    *   在 Vercel 中选择该 GitHub 仓库。
    *   **重要：环境变量配置**：
        在 `Environment Variables` 中添加以下变量：
        *   `API_KEY`: 您的 Gemini API 密钥。
        *   `SUPABASE_URL`: 您的 Supabase 项目 URL。
        *   `SUPABASE_ANON_KEY`: 您的 Supabase Anon 密钥。
    *   Vercel 会自动识别 Vite 项目并进行构建。
4.  **访问**：部署完成后，通过 Vercel 提供的链接即可访问，数据将在多端实时同步。

## 💡 注意事项
- 部署成功后，第一次进入若显示“数据库未连接”，请检查 Vercel 上的环境变量是否配置正确。
- 本地开发可运行 `npm install` 和 `npm run dev`。
