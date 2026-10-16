# PICO-Humanoid Website

PICO-Humanoid 官网框架，使用 Astro 生成静态多页面网站。

## 本地开发

需要 Node.js 24 或更新的兼容版本，以及 npm。

```sh
npm ci
npm run dev
```

访问终端显示的本地地址，通常为 `http://127.0.0.1:4321/`。

```sh
npm run check
npm run build
npm run verify
npm run preview
```

`dist/` 是可部署的静态产物。`verify` 检查生成页面、内部链接、图片和站点地图。

## 初版范围

- PICO简介：项目首页与四项技术入口。
- 使用指南：平台文档占位及组织 `.github` 中的工具链、MCP 指南入口。
- 平台技术：机械设计、电气设计、固件设计、软件设计。
- 研究成果：相关论文占位页。
- 关于我们：实验室外链、开发/贡献团队占位页。
- 搜索和语言入口点击显示建设中提示；日夜切换可用并记住选择。

页面与导航内容在 `src/data/site.ts` 中集中维护；布局、导航、页脚分别位于 `src/layouts/` 和 `src/components/`，样式位于 `src/styles/global.css`。首页为 `src/pages/index.astro`，七个内容页共用 `src/pages/[...slug].astro`。未来可将各栏目逐步扩展为独立 Astro 或 Markdown 页面。

Logo 位于 `public/assets/PICO.png`，来自组织 `.github/profile/assets/PICO.png`。网站独立保存该资源；后续品牌更新时同步替换。图片用于首屏、导航、站点图标和社交分享。

## GitHub Pages 发布

网站目标地址：`https://pico-humanoid.github.io/`。

1. 在本仓库的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
2. 将通过本地检查的源代码推送到 `main`，或在 Actions 中手动运行 **Build and deploy website**。
3. 工作流完成构建、检查与部署后，在 `github-pages` 环境中访问部署地址。

推送到 `main` 会触发公开网站部署。Pull Request 仅构建检查，不部署。

这是组织站点，Astro 的 `site` 为 `https://pico-humanoid.github.io`，不设置仓库名称作为 `base`。各子页面可直接打开和刷新，404 页面由 `dist/404.html` 提供。

部署工作流依赖 GitHub Pages 与 Actions 已启用；仓库可见性和组织设置需允许发布。
