# Job Portal Web App

这是根据 Figma 草稿 **Job Portal Design** 实现的本地 Web App。欢迎页、职位列表和职位详情沿用原稿的英文界面、配色、图标和品牌素材。桌面端采用卡片网格和双栏详情布局。

## 本地运行

需要 Node.js 20.19 或更高的 20.x 版本，或 Node.js 22.12 及以上。

```bash
npm install
npm run dev
```

打开终端显示的本地地址。运行 `npm run build` 将静态文件输出到 `dist/`，再用 `npm run preview` 本地预览构建结果。

## 演示功能

- 按公司、职位或地点搜索，按地点和工作类型筛选。
- 浏览职位详情，收藏职位，记录模拟申请，隐藏或恢复职位。
- 在 Discover、Saved、Applied、Closed 和 Discarded 之间切换。操作记录保存在当前浏览器。

职位信息使用演示数据。Spotify 职位在列表和详情中统一采用原稿详情页的薪资数字。

## 设计与字体

原设计由 **Nickelfox Design** 创作，依据 CC BY 4.0 许可改编。改编包括响应式布局、浏览器交互和补充的演示文案。[原始设计](https://www.figma.com/community/file/1187634098070702328/job-portal-design) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Satoshi 由 Indian Type Foundry 提供。本地字体位于 `public/fonts/`。该文件缺失时浏览器会从 Fontshare 加载，离线时会使用系统字体。[字体来源](https://www.fontshare.com/fonts/satoshi) · [字体许可](https://www.fontshare.com/licenses/itf-ffl)
