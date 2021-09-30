# GitNotes

这是一个由 **OrangeX4** 开发的笔记浏览应用, 用于浏览以 **Markdown** 书写的, 存放在 **GitLab 或 GitHub** 上的笔记.

优点: **数学公式支持和移动端适配**.

笔记 Git Repo 参考: [NJUAI-Notes](https://github.com/OrangeX4/NJUAI-Notes)

对应页面: [OrangeX's Notes](https://notes.orangex4.cool/?git=gitlab)

## Demo

### [OrangeX4's Notes](https://notes.orangex4.cool/)

你可以**直接使用**这个网址查看你要查看的笔记 Repo, 并不需要挂载你自己的 GitNotes.

## 界面

![](https://pic1.zhimg.com/v2-64a8fe27b9dc4a3e6c78ce51309a9c64_b.png)

![](https://pic2.zhimg.com/v2-b1c79c871655824b95d9292d9b508461_b.png)

## 开发环境

先下载并安装 [NodeJS](https://nodejs.org/zh-cn/download/).

在终端, 你 clone 下来的目录下, 执行命令:

``` sh
npm install yarn -g
npm install
```

等他安装完成后, 你就可以通过 `yarn start` 打开一个开发服务器或者 `yarn build` 生成静态文件了.

## 个人部署

将代码 Clone 下来, 修改 `src/App.tsx` 文件对应的内容为以下形式:

``` js
// ---------------------------------------------------
// const search = window.location.search
// 请在这里更改你需要的 url 参数
const search = '?git=github&github=typoverflow/note'
// ---------------------------------------------------
```

`search` 设为 URL 参数.

要修改标题, 可以使用搜索功能搜索字符串并修改 `public/index.html` 和 `src\App.tsx`.

更换图标, 可以更换 `public/profile.ico` 和 `public/profile.jpg` 文件.

进行完这些操作之后, 运行

``` sh
yarn start
```

便可实时浏览效果.

确认无误后, 运行

``` sh
yarn build
```

便可生成 `build` 文件夹, 将该文件夹挂载到你的域名下, 你的专属 GitNotes 笔记便挂载好了!

## 服务部署

运行命令:

``` sh
yarn build
```

并将 `build` 目录下的静态文件挂载在你的域名中.
