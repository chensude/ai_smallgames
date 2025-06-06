# Easy Game Find

一个简洁、响应式的在线小游戏网站，提供200多款免费在线游戏，无需下载安装即可玩。本项目专注于提供安全、快速的游戏体验，同时防止广告和恶意重定向。

![Easy Game Find Screenshot](https://via.placeholder.com/800x400?text=Easy+Game+Find)

## 特点

- 响应式设计，适配各种设备（桌面、平板、手机）
- 纯原生JavaScript实现，无需框架依赖
- 优雅的深色主题UI界面
- 游戏分类浏览功能
- 搜索功能
- 游戏推荐系统
- SEO优化
- 内置广告拦截和安全保护
- 游戏收藏功能
- 最近游戏历史记录
- 本地存储保存用户数据

## 安全特性

- 为所有iframe添加sandbox属性，限制嵌入内容的能力
- 智能覆盖层防止广告点击攻击
- 防广告重定向保护
- 本地数据存储，无需服务器
- 游戏数据URL压缩，提高性能和安全性

## 技术栈

- HTML5
- CSS3 (纯原生CSS，未使用预处理器)
- JavaScript (原生ES6+)
- 响应式设计
- LocalStorage API

## 文件结构

```
easy-game-find/
├── index.html          # 主页
├── game.html           # 游戏详情和游玩页面
├── app.js              # 主要JavaScript逻辑
├── styles.css          # 自定义样式
├── url.json            # 游戏数据
├── robots.txt          # 搜索引擎爬虫指令
├── sitemap.xml         # 网站地图
├── favicon.svg         # 网站图标
└── README.md           # 项目说明
```

## 代码规范

本项目遵循以下代码规范：

1. **HTML规范**：
   - 使用HTML5语义化标签（header, nav, main, section, footer等）
   - 保持嵌套层级合理，不过度嵌套
   - 所有HTML属性使用双引号

2. **CSS规范**：
   - 使用CSS变量管理颜色和尺寸
   - 类名采用功能描述性命名
   - 避免使用!important
   - 媒体查询确保响应式布局

3. **JavaScript规范**：
   - 使用ES6+特性
   - 使用const和let，避免var
   - 函数前添加适当注释说明功能
   - 错误处理使用try/catch
   - 异步操作使用Promise或async/await

4. **性能优化**：
   - 最小化DOM操作
   - 使用事件委托
   - 防抖处理输入事件
   - 懒加载非关键资源

## 快速开始

1. 克隆仓库：
```bash
git clone https://github.com/yourusername/easy-game-find.git
cd easy-game-find
```

2. 本地运行（使用任意静态服务器）：
```bash
# 使用Python
python -m http.server

# 或使用Node.js的http-server
npx http-server
```

3. 在浏览器中访问 `http://localhost:8000`

## 部署说明

1. 推荐使用GitHub Pages、Netlify或Vercel进行快速部署
2. 上传所有文件到托管服务
3. 配置自定义域名（可选）
4. 设置SSL证书（大多数托管服务提供免费SSL）

### 使用GitHub Pages部署

```bash
# 初始化Git仓库（如果尚未初始化）
git init
git add .
git commit -m "Initial commit"

# 创建gh-pages分支
git checkout -b gh-pages
git push origin gh-pages
```

### 使用Netlify部署

```bash
# 安装Netlify CLI
npm install netlify-cli -g

# 登录到Netlify
netlify login

# 部署网站
netlify deploy
```

### 使用Vercel部署

```bash
# 安装Vercel CLI
npm install -g vercel

# 登录到Vercel
vercel login

# 部署网站
vercel
```

## 贡献指南

欢迎对项目做出贡献！请遵循以下步骤：

1. Fork项目仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

### 贡献类型

- 修复游戏链接
- 添加新游戏到url.json
- 改进用户界面
- 增强安全特性
- 修复兼容性问题
- 文档改进

## 游戏数据

游戏数据存储在本地文件：`url.json`。每个游戏条目包含以下字段：
- title: 游戏标题
- embed: 游戏iframe嵌入URL
- image: 游戏缩略图URL
- tags: 逗号分隔的标签列表
- description: 游戏描述

## 维护与更新

- 定期检查游戏链接是否有效
- 更新游戏数据以添加新游戏
- 改进广告拦截功能，应对新型广告技术
- 检查浏览器兼容性

## 浏览器兼容性

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- 移动浏览器（iOS Safari 14+、Android Chrome）

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，请[创建Issue](https://github.com/yourusername/easy-game-find/issues)。 