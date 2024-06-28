# vue-nodejs-blog

# 前言

本项目是一个前后端分离的 vue+nodejs 博客项目，一路踩坑边学边用摸爬滚打终于初步上线

所有页面没有使用任何第三方 ui 框架，所有页面效果，页面功能均由个人独立完成

由于书写时间仓促，该博客仍有许多需要改进的地方，我会保持对该博客项目的更新

# 技术栈

- 前端：vue+vue-router+vuex+axios
- 后端：node.js+express+mysql

# 项目运行

```
// 安装前后端依赖
npm run init

// 开启前端服务
npm run dev

// 第一次运行初始化数据库
cd server
node database.js

// 开启后端服务
cd server

node app.js

更改镜像下载更快
 npm config set registry https://registry.npm.taobao.org
 npm install mysql2

之后浏览器打开
localhost:8080 前端
http://localhost:8080/#/login 后端
即可访问，如果依赖安装部分出现了问题，可以使用以下命令手动处理：
```

// 安装前端依赖
npm run install

// 安装后端依赖
cd server
npm run install

// 初始化数据库
cd server
node database.js

```

!!!注意!!!
----
你的电脑上必须安装了mysql，并且mysql的相关配置如下才能进行正常运行。

```

    host:'localhost',
    user:'root',
    password:'',

```
如果上面的配置和你电脑上的配置不同，那么你可以修改server/db.js 和server/database.js 里面的相应内容之后，再按照上述步骤启动项目

后台管理页面的测试账号和密码都是:admin
```
