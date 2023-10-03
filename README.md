# NetworkResourceVis

## 准备

执行 `npm install && npm run start` or `yarn && yarn start`

## 新建一个 Topic：

1. 在 topic/topic-tj/topic-dwlp 目录下新建组件
2. 在 app/routes.tsx 的 routesTopicConfig 中引入该组件,并注册路由
3. 在进入组件的地方,通过路由跳转打开弹窗
   ```tsx
   const navigate = useNavigate();
   navigate('/topic/' + url);
   ```

- 对于页面中有多层弹窗嵌套的情况, 可自行在自己组件中叠加 ModalView 使用

## commit 规范：

`#工作项 ID+空格+[提交类型]+空格+(需求人/提出人/任务相关人)+空格+提交描述`

举个例子：
`#11126 [feat] (张敏) 新增案例模板设置接口`

所有类型：

- feat: 新功能、新特性
- fix: 修复错误
- perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）
- refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）
- docs: 修改说明文档
- style: 代码格式修改, 注意不是 css 修改（例如分号修改）
- test: 测试用例新增、修改
- build: 影响项目构建或依赖项修改
- revert: 恢复上一次提交
- ci: 持续集成相关文件修改
- chore: 其他修改（不在上述类型中的修改）
- release: 发布新版本
- workflow: 工作流相关文件修改

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@network-resource-vis/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app --directory=` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

### 关于 svg 做背景，无法被拉升的问题

[参考链接](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio)
svg 标签上面加上属性：preserveAspectRatio="none meet";
`<svg width="1264px" height="722px" viewBox="0 0 1264 722" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none meet">`
