# 🌐 优秀前端设计灵感网站清单

> 为 ThoughtCabinet（思维阁）项目收集的设计灵感资源
> 最后更新：2026-03-01

---

## 📖 项目设计定位

**产品名称**: 思维阁 (ThoughtCabinet)
**产品定位**: 主动认知操作系统 - 个人的知识管理 & 任务执行系统
**核心理念**: 港湾 / 安全屋 / 基地 - 放松、思考、行动

### 视觉风格

| 元素 | 描述 |
|------|------|
| **背景** | 天空氛围：深蓝渐变 + 柔和星光 + 漂浮云朵 |
| **主色调** | 晨曦金 (#e8c88a) - 温暖、指引 |
| **辅助色** | 晚霞紫 (#9b8abf)、晨曦蓝 (#7eb8da) |
| **字体** | SF Pro Display / PingFang SC |
| **圆角** | 10-20px，柔和友好 |
| **动画** | 轻微浮动、渐变过渡、星光闪烁 |

---

## 🏆 设计灵感聚合站

| 网站 | 特点 | 链接 |
|------|------|------|
| **Awwwards** | 全球最权威的网站设计奖项，每日/每月/年度最佳网站 | [awwwards.com](https://www.awwwards.com/) |
| **Godly** | 精选顶级网页设计，专注于 SaaS/仪表盘/创意网站 | [godly.website](https://godly.website/) |
| **SiteInspire** | 按风格/类型筛选的优秀网站设计 | [siteinspire.com](https://www.siteinspire.com/) |
| **Httpster** | 全页面网站设计灵感，注重交互体验 | [httpster.io](https://httpster.io/) |
| **Landings** | 专注落地页设计灵感 | [landings.dev](https://landings.dev/) |

---

## 📊 仪表盘/后台设计

| 网站 | 特点 | 链接 |
|------|------|------|
| **Dribbble - Dashboard** | 海量仪表盘设计概念图 | [dribbble.com/search/dashboard](https://dribbble.com/search/dashboard) |
| **Behance - Dashboard UI** | 完整案例展示，含设计思路 | [behance.net/search/dashboard](https://www.behance.net/search/dashboard) |
| **Mobbin** | 真实 App/网站的 UI 模式库，可筛选 Dashboard | [mobbin.com](https://mobbin.com/) |
| **Page Flows** | 记录完整用户流程的视频库 | [pageflows.com](https://pageflows.com/) |

### 推荐搜索关键词

- `knowledge dashboard`
- `analytics dashboard dark mode`
- `glassmorphism dashboard`
- `data visualization dashboard`

---

## 🧠 知识管理/笔记类应用（竞品参考）

| 应用 | 设计亮点 | 链接 |
|------|---------|------|
| **Notion** | 极简块级编辑、灵活数据库视图 | [notion.so](https://notion.so/) |
| **Obsidian** | 知识图谱可视化、双向链接 | [obsidian.md](https://obsidian.md/) |
| **Readwise Reader** | 稍后阅读 + 笔记 + AI 总结 | [readwise.io/reader](https://readwise.io/reader) |
| **Heptabase** | 视觉化知识卡片 + 白板 | [heptabase.com](https://heptabase.com/) |
| **Scrintal** | 笔记 + 思维导图混合 | [scrintal.com](https://scrintal.com/) |
| **Tana** | 超级标记系统、节点网络 | [tana.inc](https://tana.inc/) |

### 值得学习的交互模式

- **双向链接** - 笔记之间的关联展示
- **知识图谱** - 节点网络的可视化与交互
- **块级编辑** - 拖拽、嵌套、转换
- **侧边栏导航** - 多级折叠、快速切换

---

## ✨ 独特风格网站案例（2025 年值得参考）

| 网站 | 风格特点 |
|------|---------|
| **Linear** | 极简深色模式、微交互细腻、动画流畅 |
| **Raycast** | macOS 原生感、命令 Palette 设计 |
| **Arc Browser** | 大胆配色、趣味性微交互 |
| **Vercel Dashboard** | 信息密度高但不拥挤、层次分明 |
| **Supabase** | 品牌色运用、渐变 + 玻璃态结合 |

---

## 🎯 设计风格建议

针对 ThoughtCabinet 的 **天空渐变 + 晨曦金 + 星光闪烁** 风格，推荐参考以下设计方向：

### 1. Glassmorphism（玻璃态）

半透明卡片 + 背景模糊，适合天空背景

```css
/* 示例 */
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

### 2. Aurora Gradients

柔和的极光渐变背景，与天空主题契合

```css
/* 示例 */
.background {
  background: linear-gradient(135deg,
    #1a1a2e 0%,
    #16213e 50%,
    #1f4068 100%);
}
```

### 3. Micro-interactions

- 卡片悬停上浮
- 星光闪烁动画
- 云朵浮动效果
- 按钮点击反馈

### 4. Dark Mode First

深色背景更能衬托星光和晨曦金

```css
:root {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --accent-gold: #e8c88a;
  --accent-purple: #9b8abf;
  --accent-blue: #7eb8da;
}
```

---

## 📌 推荐优先浏览

1. [Godly - Dashboard 分类](https://godly.website/) — 找 SaaS/仪表盘灵感
2. [Awwwards - Winners](https://www.awwwards.com/websites/) — 看年度最佳
3. [Heptabase](https://heptabase.com/) — 知识图谱 + 卡片设计
4. [Dribbble - Knowledge Dashboard](https://dribbble.com/search/knowledge%20dashboard) — 直接搜知识管理仪表盘

---

## 🔗 快速访问清单

### 设计社区
- [ ] Awwwards
- [ ] Godly
- [ ] Dribbble
- [ ] Behance
- [ ] SiteInspire

### 竞品分析
- [ ] Notion
- [ ] Obsidian
- [ ] Heptabase
- [ ] Readwise Reader
- [ ] Scrintal

### 风格参考
- [ ] Linear
- [ ] Raycast
- [ ] Arc Browser
- [ ] Vercel
- [ ] Supabase

---

*文档版本：v1.0*
*创建日期：2026-03-01*
