# GitNotes

这是一个由 **OrangeX4** 开发的笔记浏览应用, 用于浏览以 **Markdown** 书写的, 存放在 **GitLab 或 GitHub** 上的笔记.

优点: **数学公式支持和移动端适配**.

笔记 Git Repo 参考: [NJUAI-Notes](https://github.com/OrangeX4/NJUAI-Notes)

对应页面: [OrangeX's Notes](https://notes.orangex4.cool/?git=gitlab)

## Demo

### [OrangeX4's Notes](https://notes.orangex4.cool/)

你可以**直接使用**这个网址查看你要查看的笔记 Repo, 并不需要挂载你自己的 GitNotes.

## 界面

![](https://pic3.58cdn.com.cn/nowater/webim/big/n_v2107d04ca70fb43868e6b060896704d75.png)

![](https://pic3.58cdn.com.cn/nowater/webim/big/n_v2db809fd3683444ba8a60989fc99d8fe9.png)

![](https://pic3.58cdn.com.cn/nowater/webim/big/n_v269cc40fab42c40cca572cd0639e152fb.png)


## 个人部署

将代码 Clone 下来, 修改 `src/App.tsx` 文件的内容:

![](https://pic3.58cdn.com.cn/nowater/webim/big/n_v2c2a623c7ad164c30a3cf8f9d8f30b7a6.png)

修改为以下形式:

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

## Contribute

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
