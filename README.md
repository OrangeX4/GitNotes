# GitNotes

这是一个由 **OrangeX4** 开发的笔记浏览应用, 用于浏览以 **Markdown** 书写的, 存放在 **GitLab 或 GitHub** 上的笔记.

优点: **数学公式支持和移动端适配**.

## Demo

### [OrangeX4's Notes](notes.orangex4.cool)

你可以**直接使用**这个网址查看你要查看的笔记 Repo, 并不需要挂载你自己的 GitNotes.

## 界面

![](image/2021-04-13-00-02-44.png)

![](image/2021-04-13-00-04-30.png)


## 部署

修改 `src/App.tsx` 内的 `host` 值为你所部署的地址.

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
