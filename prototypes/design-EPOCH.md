# 📜 EPOCH 设计方案 - Thought Cabinet

**代号**: EPOCH  
**全称**: **E**phemeral **P**ersonal **O**bservation **C**hronicle **H**ub  
**定位**: 考古时间轴 / 历史沉淀感 / 记忆博物馆  
**风格关键词**: 羊皮纸、青铜器、时间轴、考古、遗迹、编年史  
**端口**: 60008 (规划中)

---

## 1. 设计理念

### 1.1 核心隐喻
EPOCH 以**考古发掘与历史编年**为核心隐喻——用户的思维是跨越时间的文明遗迹，需要被挖掘、记录、编年：

- **地层** → 时间分层（年/月/日）
- **文物** → 珍贵的想法/笔记
- **遗址** → 项目/主题的聚集地
- **铭文** → 重要的思考记录
- **陶片** → 碎片化的灵感
- **青铜器** → 成熟的系统性知识

### 1.2 设计哲学
> "今天的想法，是未来的考古发现"

EPOCH 强调**时间的沉淀**和**记忆的积累**，界面传递出：
- **厚重感** - 历史的分量
- **探索感** - 像考古学家一样发掘
- **连接感** - 过去与现在的对话
- **珍藏感** - 每个想法都值得被铭记

### 1.3 五个核心模块

| 模块 | 名称 | 隐喻 | 功能 |
|------|------|------|------|
| 1 | **地层视图** | Stratigraphy | 按时间分层浏览 |
| 2 | **文物库** | Artifact Vault | 收藏珍贵想法 |
| 3 | **遗址地图** | Site Map | 主题/项目分布 |
| 4 | **铭文墙** | Inscription Wall | 重要记录展示 |
| 5 | **发掘现场** | Excavation | 当前工作区 |

---

## 2. 视觉系统

### 2.1 色彩体系 - 考古色谱

```css
/* 基础土质 */
--epoch-parchment: #F4ECD8;      /* 羊皮纸 - 主背景 */
--epoch-papyrus: #E8DCC8;        /* 纸莎草 - 次级背景 */
--epoch-clay: #C9B8A0;           /* 陶土色 - 边框 */
--epoch-sand: #D4C5A8;           /* 沙色 - 装饰 */

/* 金属氧化色 */
--epoch-bronze: #8B7355;         /* 青铜 - 主强调 */
--epoch-bronze-dark: #5C4A35;    /* 深青铜 - 深色元素 */
--epoch-copper: #B87333;         /* 铜绿 - 次要强调 */
--epoch-verdigris: #43B3AE;      /* 铜锈青 - 成功态 */

/* 墨迹与风化 */
--epoch-ink: #2C2416;            /* 浓墨 - 主文字 */
--epoch-faded: #6B5B4F;          /* 褪色 - 次要文字 */
--epoch-weathered: #8B7D6B;      /* 风化 - 弱化文字 */

/* 印章红 */
--epoch-seal: #8B0000;           /* 朱砂印 - 重要标记 */
--epoch-seal-wax: #A52A2A;       /* 封蜡红 - 标签 */

/* 阴影 */
--shadow-depth: rgba(44, 36, 22, 0.15);
--shadow-soft: rgba(139, 115, 85, 0.2);
```

### 2.2 材质纹理系统

```css
/* 羊皮纸纹理 */
.parchment-texture {
  background-color: var(--epoch-parchment);
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}

/* 青铜器质感 */
.bronze-patina {
  background: linear-gradient(
    135deg,
    var(--epoch-bronze) 0%,
    var(--epoch-bronze-dark) 50%,
    var(--epoch-copper) 100%
  );
  box-shadow: 
    inset 0 1px 0 rgba(255,255,255,0.2),
    0 4px 12px var(--shadow-depth);
}

/* 石刻效果 */
.stone-carved {
  color: var(--epoch-ink);
  text-shadow: 
    0 1px 0 rgba(255,255,255,0.3),
    0 -1px 0 rgba(0,0,0,0.1);
}
```

### 2.3 字体规范

```css
/* 字体栈 */
--font-serif: 'Cinzel', 'Noto Serif SC', serif;     /* 标题 - 铭刻感 */
--font-body: 'Crimson Text', 'Source Han Serif CN', serif;  /* 正文 - 古籍 */
--font-mono: 'Courier Prime', monospace;            /* 日期/编号 */

/* 字号 */
--text-xs: 0.75rem;      /* 12px - 标注 */
--text-sm: 0.875rem;     /* 14px - 辅助 */
--text-base: 1rem;       /* 16px - 正文 */
--text-lg: 1.25rem;      /* 20px - 小标题 */
--text-xl: 1.5rem;       /* 24px - 章节 */
--text-2xl: 2rem;        /* 32px - 大标题 */
```

---

## 3. 五大模块设计

### 3.1 地层视图 (Stratigraphy)
**隐喻**: 地质沉积层，每层代表一个时间段

**设计要点**:
- 垂直时间轴，像地层剖面
- 每层用不同深浅的土色区分
- 可展开/折叠查看详细内容
- 年代标记像考古标尺

**交互**:
- 滚动时土层有视差效果
- 点击土层展开该时期的所有想法
- 支持缩放（年/月/日视图）

### 3.2 文物库 (Artifact Vault)
**隐喻**: 博物馆展柜，珍藏最重要的想法

**设计要点**:
- 网格布局像展柜陈列
- 每个"文物"有编号、年代、描述
- 青铜器质感的卡片边框
- 聚光灯hover效果

**交互**:
- 点击查看文物详情（像博物馆介绍牌）
- 可以旋转查看（3D效果）
- 打标签像贴博物馆分类标签

### 3.3 遗址地图 (Site Map)
**隐喻**: 考古遗址平面图，不同区域代表不同主题

**设计要点**:
- 俯视地图视角
- 不同区域用不同图标表示
- 连接线表示关联
- 未探索区域呈"未发掘"状态

**交互**:
- 点击区域进入该主题
- 拖拽移动地图
- 缩放查看细节

### 3.4 铭文墙 (Inscription Wall)
**隐喻**: 古代石碑墙，刻录重要思考

**设计要点**:
-  masonry 瀑布流布局
- 每条铭文像石碑/竹简
- 石刻质感的文字
- 印章标记重要程度

**交互**:
- 悬停显示完整铭文
- 可以"拓印"（复制）
- 按重要性排序

### 3.5 发掘现场 (Excavation)
**隐喻**: 当前正在进行的考古发掘

**设计要点**:
- 工作台面布局
- 工具栏像考古工具
- 待处理的"出土物"
- 进度条像发掘进度

**交互**:
- 拖拽整理新想法
- 使用工具处理（刷去尘土=整理）
- 标记为已清理/待研究

---

## 4. 动效设计

### 4.1 入场动画
- 页面加载像打开古籍
- 内容渐显像褪去尘土
- 时间轴从地下升起

### 4.2 交互动画
- Hover像手电筒照亮文物
- 点击展开像打开卷轴
- 切换视图像翻阅史书

### 4.3 微交互
- 保存时的封蜡印记动画
- 删除时的风化消散效果
- 新想法出现像新出土的文物

---

## 5. 响应式适配

### 桌面端
- 左侧时间轴 + 右侧内容区
- 完整的地图视图

### 平板端
- 可收起的时间轴
- 网格布局调整为2列

### 移动端
- 底部导航切换5个模块
- 单列布局
- 简化的时间轴
