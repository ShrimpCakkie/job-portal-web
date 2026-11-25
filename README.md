# Job Portal Web App

这是从 Figma 草稿 **Job Portal Design** 演进的校园社团平台原型。首页为「交大团团」登录页，以校园照片为背景，展示西南交通大学标志。职位列表和详情使用白底主题，桌面端采用卡片网格与双栏详情。

## 本地运行

需要 Node.js 20.19 或更高的 20.x 版本，或 Node.js 22.12 及以上。

```bash
npm install
npm run dev
```

打开终端显示的本地地址。运行 `npm run build` 将静态文件输出到 `dist/`，再用 `npm run preview` 本地预览构建结果。

## 演示功能

- 学号登录和学校统一身份认证按钮进入演示职位列表，表单输入在跳转时清空。帮助和注册入口提供页内提示。
- 按公司、职位或地点搜索，按地点和工作类型筛选。
- 浏览职位详情，收藏职位，记录模拟申请，隐藏或恢复职位。
- 在 Discover、Saved、Applied、Closed 和 Discarded 之间切换。操作记录保存在当前浏览器。

职位信息使用演示数据。Spotify 职位在列表和详情中统一采用原稿详情页的薪资数字。

## 主题配色

颜色变量集中在 `src/theme.css`。新组件从下列搭配中选取背景和前景，并用现有按钮、表单和图标样式处理交互状态。

| 场景 | 背景 | 文字和单色图标 |
| --- | --- | --- |
| 页面和弹窗 | `--color-page` | `--color-text`，次要文字用 `--color-muted` |
| 说明卡片、搜索和空状态 | `--color-surface` | `--color-text`，次要文字用 `--color-muted` |
| 深色信息栏、未选标签和保存按钮 | `--color-inverse` | `--color-on-inverse` |
| 紫色按钮、选中标签和紫色职位卡 | 原有紫色变量 | `--color-on-inverse` |
| 红色、黄色职位卡 | 对应主题色变量 | `--color-on-bright` |

表单边界用 `--color-control-border`，普通分隔线用 `--color-divider`。单色 `Icon` 从所在控件继承颜色，彩色素材由 `Asset` 渲染。功能文字的对比度至少为 4.5:1，识别控件所需的边框、图标和焦点标记至少为 3:1。标签渐变与半透明叠层按实际合成后的颜色核对。

`npm run check:theme` 检查组件里直接写入的颜色和浏览器主题色。`npm run build` 会先运行这项检查。更新页面底色时同步设置 HTML 的 `theme-color`。

## 设计与字体

原设计由 **Nickelfox Design** 创作，依据 CC BY 4.0 许可改编。改编包括白底主题、响应式布局、浏览器交互和补充的演示文案。[原始设计](https://www.figma.com/community/file/1187634098070702328/job-portal-design) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

Satoshi 由 Indian Type Foundry 提供。本地字体位于 `public/fonts/`。该文件缺失时浏览器会从 Fontshare 加载，离线时会使用系统字体。[字体来源](https://www.fontshare.com/fonts/satoshi) · [字体许可](https://www.fontshare.com/licenses/itf-ffl)
