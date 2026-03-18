# RetailRadar — 产品1.0 最终需求文档

**版本：** v1.0-final
**日期：** 2026-03-18
**定位：** 出门采购前的一站式决策工具
**目标用户：** 北美/欧洲家庭主妇、家庭采购员、出差旅行者

---

## 一、产品定位

> "打开 → 看附近哪家在营业 → 一键导航出发"

Google Maps 要逐个搜，没有聚合视图；Flipp 有折扣但没有营业状态。
RetailRadar 把两者之间的空白填上：**附近所有超市实时状态，一屏看完。**

---

## 二、功能范围

### 免费版

- 浏览器 Geolocation 获取定位
- Google Places Nearby Search，展示附近 **10家** 连锁超市/百货
- 每家店显示：品牌Logo、店名、营业状态badge、今日营业时间、距离、地址
- 点击 → Google Maps 导航 deeplink
- 店铺名称搜索

### Pro 版（$2.99/月）

> 卖点：帮你省时间，不漏掉任何一次开门机会。

| 功能 | 说明 |
|------|------|
| 无限店铺 | 不限10家，显示附近所有结果 |
| 筛选：只看营业中 | 一键过滤已关闭店铺 |
| 距离排序 | 按远近重新排列 |
| 收藏常去的店 | 快速访问，不用每次重新搜 |
| 多地点保存 | 保存家/公司/其他常用地点，一键切换查询 |
| 品牌全城门店查询 | 搜索某品牌，看全城所有门店状态（出差/旅行场景） |
| 节假日营业时间提醒 | 感恩节/圣诞/元旦前，自动推送附近店铺特殊时间（Web Push） |
| 店铺状态变化高亮 | 今天临时关门、改时间，高亮标注 |

### 2.0 规划（上线后迭代，1.0不做）

- Kroger 官方 API 接入（折扣数据）
- Walmart / Target 促销页爬虫
- AI分析："本周买牛奶去哪家最便宜"
- 涨价至 $4.99/月

### 明确不做（1.0排除）

- ❌ 折扣/促销数据
- ❌ 邮件推送（Web Push够用）
- ❌ 趋势分析
- ❌ 品牌广告位
- ❌ PC端精细优化（能用即可）

---

## 三、登录与支付

**登录：** 只做 Google OAuth（Sign in with Google）
- 未登录可用免费功能
- 登录后才能订阅 Pro

**支付：** 只用 PayPal Subscriptions API
- 手续费 3.49% + $0.49/笔，无月费
- Webhook 同步订阅状态到 Supabase

---

## 四、技术选型

| 层级 | 选型 | 说明 |
|------|------|------|
| 前端 | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui | SEO友好，部署快 |
| 部署 | Vercel 免费tier | 零运维 |
| 定位 | 浏览器 Geolocation API | 精准 |
| 数据 | Google Places API (New) | 唯一数据源 |
| 缓存 | Vercel KV (Redis) 免费tier | 减少API调用 |
| 数据库 | Supabase PostgreSQL 免费tier | 用户、收藏、快照 |
| 认证 | Supabase Auth + Google OAuth | 免费 |
| 支付 | PayPal Subscriptions API | 北美接受度高 |
| 推送 | Web Push API | 节假日提醒，免费 |

**初期月成本：接近 $0**
- Google Places：每月 $200 免费额度，MVP流量够用
- PayPal：有收入才有手续费
- 其余全免费tier

---

## 五、设计规范

### 核心原则

参考北美主妇熟悉的平台（Instacart、Target app、Whole Foods）建立信任感，但有自己的辨识度。
做成**生活服务 app 的感觉**，不是查询工具的感觉。

**她们会立刻关掉的页面：**
- 信息密度太高，像数据表格
- 颜色太多太杂
- 字体太小
- 没有图标/logo，纯文字列表
- 像个"工具网站"而不是"生活服务"

### 色彩方案

| 元素 | 色值 | 说明 |
|------|------|------|
| 主色 | `#2563EB` | 现代蓝，参考Instacart/Target感觉 |
| 背景 | `#F8FAFC` | 微灰白，比纯白更舒适 |
| 卡片背景 | `#FFFFFF` | 纯白卡片，与背景形成层次 |
| 营业中 | `#16A34A` | Whole Foods有机绿，自然感 |
| 即将关闭 | `#F59E0B` | 暖琥珀色，不刺眼 |
| 已关闭 | `#9CA3AF` | 中性灰，降低视觉权重 |
| CTA按钮 | `#2563EB` | 主色，统一 |
| 文字主色 | `#111827` | 近黑，高对比 |
| 文字次色 | `#6B7280` | 灰色，辅助信息 |

### 字体

- 字体：**Inter**（北美主流无衬线，Instacart/Notion同款）
- 店名：18px bold
- 营业时间：16px medium，要大，老花眼也能看清
- 距离/地址：14px，灰色辅助信息

### 组件规范

- 圆角：16px（比之前更圆润，更友好）
- 卡片阴影：`0 1px 3px rgba(0,0,0,0.08)`，轻盈不压抑
- 留白：宁可少放内容也不要挤，section间距 24px+
- 营业状态：**大色块badge**，不是小圆点，一眼可读
- 品牌Logo：每张卡片必须有，视觉识别靠logo
- 导航按钮：蓝色，圆角，右侧固定，拇指可及

### 移动端优先

- 基准断点：375px（iPhone SE）
- 顶部显示当前位置（"Near Columbus, OH"），建立信任感
- 节假日提醒用暖色banner，不是冷冰冰的系统通知样式
- 底部导航栏：首页 / 搜索 / 账户

### 页面结构

```
/ (首页)
  顶部：当前位置 + 定位刷新按钮
  列表：超市卡片（品牌Logo + 店名 + 状态badge + 时间 + 距离 + 导航按钮）
  底部：免费版显示"查看更多 → 升级Pro"引导

/search
  搜索框 + 结果列表
  Pro用户：品牌全城门店查询

/account
  未登录：Google登录按钮
  已登录：订阅状态 + 收藏列表 + 已保存地点（Pro）
```

---

## 六、数据库设计

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT,
  google_id TEXT UNIQUE,
  is_pro BOOLEAN DEFAULT FALSE,
  pro_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 收藏表（Pro）
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  place_id TEXT NOT NULL,
  store_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 保存的地点（Pro）
CREATE TABLE saved_locations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  label TEXT,           -- "Home"、"Work"、"Mom's place"
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web Push 订阅（节假日提醒）
CREATE TABLE push_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  endpoint TEXT NOT NULL,
  p256dh TEXT,
  auth TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 店铺状态快照（从第一天就存，为2.0趋势分析准备）
CREATE TABLE store_snapshots (
  id SERIAL PRIMARY KEY,
  place_id TEXT NOT NULL,
  store_name TEXT,
  business_status TEXT,  -- OPERATIONAL / CLOSED_PERMANENTLY / CLOSED_TEMPORARILY
  city TEXT,
  state TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 七、缓存策略

| 数据类型 | 缓存时长 |
|---------|---------|
| 同区域 Places 查询 | 1小时 |
| 单店详情 | 6小时 |
| 节假日前后 | 30分钟 |

---

## 八、开发里程碑（约17个工作日）

| 里程碑 | 内容 | 工期 |
|--------|------|------|
| M1 | 项目初始化 + 定位 + Google Places API接通 | 2天 |
| M2 | 首页卡片列表 + 营业状态 + 导航 | 3天 |
| M3 | 搜索功能 + 缓存优化 | 2天 |
| M4 | Google OAuth + Supabase用户表 | 2天 |
| M5 | PayPal订阅 + Pro权限控制 | 3天 |
| M6 | Pro功能：筛选 + 收藏 + 多地点 + 品牌全城查询 | 2天 |
| M7 | 节假日提醒（Web Push）+ 状态高亮 | 1天 |
| M8 | 移动端适配 + 测试 + 上线 | 2天 |
| **总计** | | **约17个工作日** |

---

## 九、变现预测

| 指标 | 估算 |
|------|------|
| 免费→Pro 转化率 | 5-8% |
| 1000免费用户时 | 50-80 付费用户，约 $150-240/月 |
| 5000免费用户时 | 250-400 付费用户，约 $750-1200/月 |
| SEO长期流量 | 城市+品牌关键词落地页，持续免费流量 |

---

*v1.0-final 已确认。下一步：搭建 Next.js 项目骨架。*
