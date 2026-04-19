1.项目目录结构：

dictation-assistant/
├── index.html          # 主页面
├── login.html          # 登录页面
├── register.html       # 注册页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 主逻辑
│   ├── speech.js       # 语音功能
│   ├── timer.js        # 计时功能
│   └── storage.js      # 本地存储功能
├── backend/            # 后端服务
│   ├── config/
│   │   └── db.js       # 数据库配置
│   ├── models/
│   │   ├── User.js     # 用户模型
│   │   └── Dictation.js # 听写历史模型
│   ├── routes/
│   │   ├── auth.js     # 认证路由
│   │   └── dictation.js # 听写历史路由
│   ├── package.json    # 项目依赖
│   └── server.js       # 服务器入口
	
	
2.核心模块说明：

模块名称 职责 文件位置 
页面结构 构建HTML页面，包含输入区、控制区、状态区、历史记录区 index.html 
登录页面 构建用户登录页面 login.html 
注册页面 构建用户注册页面 register.html 
样式模块 美化界面，实现响应式设计 css/style.css 
主逻辑模块 协调各个功能模块，处理用户交互，包括历史记录和认证功能 js/main.js 
语音模块 实现词语朗读功能，支持柔和有感情的声线 js/speech.js 
计时模块 实现10秒倒计时功能，以及5秒准备时间 js/timer.js 
存储模块 保存用户设置和听写历史（未登录用户） js/storage.js 
后端服务器 提供API服务，处理用户认证和数据存储 backend/server.js 
用户模型 定义用户数据结构和密码加密 backend/models/User.js 
听写历史模型 定义听写历史数据结构 backend/models/Dictation.js 
认证路由 处理用户注册和登录请求 backend/routes/auth.js 
听写历史路由 处理听写历史的保存和获取请求 backend/routes/dictation.js

3.数据模型设计：

我们使用两种存储方式：
1. **本地存储**：使用浏览器的localStorage存储未登录用户的数据
2. **服务器存储**：使用MongoDB数据库存储登录用户的数据

### 本地存储数据结构：

用户设置 ：
{
  "settings": {
    "interval": 10, // 听写间隔时间（秒）
    "voice": "zh-CN", // 语音设置
    "theme": "light" // 主题设置
  }
}

听写历史 ：
{
  "history": [
    {
      "id": "1234567890", // 唯一ID
      "date": "2026-04-18", // 听写日期
      "words": ["苹果", "香蕉", "橙子"], // 听写词语
      "count": 3 // 词语数量
    }
  ]
}

### 服务器数据库数据结构：

用户模型（User）：
{
  "_id": ObjectId, // MongoDB自动生成的唯一ID
  "username": String, // 用户名（唯一）
  "email": String, // 邮箱（唯一）
  "password": String, // 加密后的密码
  "createdAt": Date // 创建时间
}

听写历史模型（Dictation）：
{
  "_id": ObjectId, // MongoDB自动生成的唯一ID
  "user": ObjectId, // 关联的用户ID
  "words": [String], // 听写词语
  "count": Number, // 词语数量
  "createdAt": Date // 创建时间
}

4.代码规范

### HTML规范：
- 使用语义化标签（如 <header> , <main> , <section> ）
- 缩进使用2或4个空格
- 标签名小写，属性值使用双引号
### CSS规范：
- 使用小写字母和连字符命名（如 .input-section ）
- 缩进使用2或4个空格
- 遵循BEM命名规范（Block, Element, Modifier）
- 使用注释说明复杂样式
### JavaScript规范：
- 变量名使用驼峰命名法（如 currentWord ）
- 函数名使用动词开头（如 startDictation() ）
- 缩进使用2或4个空格
- 使用注释说明关键逻辑
- 避免全局变量，使用模块化设计
