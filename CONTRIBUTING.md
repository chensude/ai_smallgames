# 贡献指南

感谢您考虑为Easy Game Find项目做出贡献！这个文档提供了关于如何贡献代码、报告问题和提出改进建议的指南。

## 行为准则

我们希望每个参与者都能在友好、包容的环境中工作。请尊重其他贡献者，并遵循以下原则：

- 使用友好和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情

## 如何贡献

### 报告Bug

如果您发现了Bug，请创建一个Issue并包含以下信息：

1. 清晰简洁的标题
2. 重现步骤
3. 预期行为与实际行为的比较
4. 截图（如适用）
5. 您的浏览器和操作系统信息

### 提出特性请求

如果您希望添加新功能或改进现有功能，请创建一个Issue并描述：

1. 您希望看到的功能
2. 为什么这个功能对用户有用
3. 如何实现（如果您有想法）

### 提交Pull Request

1. Fork项目仓库
2. 克隆您的Fork到本地
3. 创建一个新分支：`git checkout -b feature/amazing-feature`
4. 进行更改并测试
5. 提交您的更改：`git commit -m 'Add some amazing feature'`
6. 推送到分支：`git push origin feature/amazing-feature`
7. 创建Pull Request

## 开发流程

### 本地开发设置

```bash
# 克隆仓库
git clone https://github.com/yourusername/easy-game-find.git
cd easy-game-find

# 运行本地服务器
python -m http.server
# 或
npx http-server
```

### 编码规范

请确保您的代码遵循项目的编码规范：

#### HTML
- 使用HTML5语义化标签
- 保持HTML结构清晰，避免过度嵌套
- 所有属性使用双引号

#### CSS
- 使用CSS变量管理颜色和尺寸
- 使用有意义的类名
- 避免使用!important
- 使用媒体查询确保响应式设计

#### JavaScript
- 使用ES6+语法
- 使用const和let声明变量，避免var
- 为函数添加注释说明功能
- 使用try/catch处理错误
- 处理异步操作使用Promise或async/await

### 提交消息规范

我们使用约定式提交规范（Conventional Commits）：

```
<类型>[可选作用域]: <描述>

[可选正文]

[可选脚注]
```

类型包括：
- `feat`：新功能
- `fix`：Bug修复
- `docs`：文档更新
- `style`：不影响代码含义的更改（空白、格式等）
- `refactor`：既不修复bug也不添加功能的代码更改
- `perf`：改进性能的代码更改
- `test`：添加或修正测试
- `chore`：对构建过程或辅助工具的更改

例如：
```
feat(games): 添加游戏搜索过滤功能

添加了按游戏类别和标签过滤搜索结果的功能，提高了用户体验。

解决了 #123 问题
```

## 特定贡献类型指南

### 添加新游戏

要添加新游戏到项目中，请编辑`url.json`文件并添加新的游戏条目：

```json
{
  "title": "游戏标题",
  "embed": "游戏iframe嵌入URL",
  "image": "游戏缩略图URL",
  "tags": "标签1,标签2,标签3",
  "description": "游戏详细描述"
}
```

### 修复游戏链接

如果您发现有游戏链接不工作，请创建一个PR修复`url.json`中的链接。

### 改进安全特性

如果您有改进项目安全性的建议，请创建一个Issue详细描述您的想法。

## 代码审查流程

所有提交的代码将由维护者审查。我们可能会要求您进行更改或提供更多信息。

## 问题和讨论

如果您有任何问题或想法，请随时创建Issue或参与现有讨论。

感谢您为Easy Game Find做出贡献！ 