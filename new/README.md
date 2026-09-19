# 星瀚科技社 · 综合平台

个人技术整合练习原型（期末大作业原型）。主题为"星瀚科技社"，将课堂作业五的交互、作业六的看板、作业七的三维场景整合改造而成。

## 运行说明

1. 进入 `frontend-practice8/new` 目录
2. 启动本地静态服务器（必须通过 HTTP 访问，否则 `fetch` 读取 JSON 会被浏览器拦截）：
   ```bash
   # 任选一种
   python -m http.server 8080
   npx serve .
   ```
3. 浏览器访问 `http://localhost:8080/`

## 模块说明

| 模块 | 对应作业 | 功能 |
|------|---------|------|
| 页面/样式 | — | Bootstrap + 自定义深空主题，统一导航 |
| 活动管理 | 作业五 todo-app | 增删、完成状态切换、全部/进行中/已完成筛选，localStorage |
| 成员管理 | 作业五 manager-app | 增删、搜索、学号校验，localStorage |
| 数据看板 | 作业六 dashboard | ECharts 柱状图 + Chart.js 环形图，fetch JSON |
| 星海漫游 | 作业七 Three.js | 三维星空 + 行星公转，OrbitControls 交互 |

## 资源来源说明

- Bootstrap 5.3.2、ECharts 5.4.3、Chart.js 4.4.0：jsDelivr CDN
- Three.js 0.160.0：jsDelivr CDN（importmap 引入）
- 看板数据 `data/club-stats.json`：自建示例数据
- 三维场景：基于课堂作业七 `my-scene.js` 改造

## 演示参数

- `?demo=error`：模拟看板加载失败
- `?demo=empty`：模拟看板空数据
