---
theme: seriph
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
drawings:
  persist: false
transition: slide-left
title: AST抽象语法树
---

# AST抽象语法树

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
   next page <carbon:arrow-right class="inline"/>
  </span>
</div>
---
transition: fade-out
---

# 目录

- 📝 **1、什么是AST？** - 语法分析、词法分析
- 🎨 **2、如何实现代码压缩** 
- 🧑‍💻 **3、如何实现Eslint插件** 
- 🤹 **4、如何实现按需加载？** - babel-plugin-component如何实现的按需加载
- 🎥 **5、如何圈代码复杂度** - 针对目前公司现有代码质量，如何利用AST圈复杂度

<style>
h1 {
  background-color: #2B90B6;
  background-image: linear-gradient(45deg, #4EC5D4 10%, #146b8c 20%);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
}
</style>

---
transition: fade-out
---

# 1、AST、语法分析、词法分析

## AST 是什么 <br/>

<h6>
抽象语法树 (Abstract Syntax Tree)，简称 AST，它是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。
</h6>

## AST的用途

<h6>
编辑器的错误提示、代码格式化、代码高亮、代码自动补全； <br/>
eslint、prettier 对代码错误或风格的检查； <br/>
webpack 通过 babel 转译 javascript 语法； <br/>
</h6>

## AST如何生成
js 执行的第一步是读取 js 文件中的字符流，然后通过词法分析生成 token，之后再通过语法分析( Parser )生成 AST，最后生成机器码执行。
整个解析过程主要分为以下两个步骤：

- **分词**：将整个代码字符串分割成最小语法单元数组
- **语法分析**：在分词基础上建立分析语法单元之间的关系

JS Parser 是 js 语法解析器，它可以将 js 源码转成 AST，常见的 Parser 有 esprima、traceur、acorn、shift 等。


<style>
  h6{
    opacity: 0.8 !important;
    margin: 10px 0;
  }
</style>
---
transition: slide-up

level: 2
---

## 词法分析
<p style="opacity:1">
词法分析，也称之为扫描（scanner），简单来说就是调用 next() 方法，一个一个字母的来读取字符，然后与定义好的 JavaScript 关键字符做比较，生成对应的Token。Token 是一个不可分割的最小单元:
</p>

<p style="opacity:.5">例如 var 这三个字符，它只能作为一个整体，语义上不能再被分解，因此它是一个 Token。</p>

词法分析器里，每个关键字是一个 Token ，每个标识符是一个 Token，每个操作符是一个 Token，每个标点符号也都是一个 Token。除此之外，还会过滤掉源程序中的注释和空白字符（换行符、空格、制表符等）<br/>

最终，整个代码将被分割进一个tokens列表（或者说一维数组）。

## 语法分析
 语法分析会将词法分析出来的 Token 转化成有语法含义的抽象语法树结构。同时，验证语法，语法如果有错的话，抛出语法错误。  
 我们来看下 javaScript 代码片段转成 AST 之后是什么样的

- AST在线转化 [AST Explorer](https://astexplorer.net/)

---
layout: image-right
image: https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/31/16f579fb424f6c8c~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.png
---

# AST Explorer

```js
function test(){
  let a = 1;
  console.log(a)
}
```
该截图是使用 Acorn 解析。使用 Acorn 的原因是在 parser 解析中，Acorn 是公认的最快的。并且我们使用的 Webpack 打包工具中 babel 用的也是 Acorn。  

属性是 AST 的一部分，这个结构包含了很多属性。  

- VariableDeclaration 变量声明
- VariableDeclarator 变量声明的描述
- Expression 表达式节点
- ...

---

## 实战 AST 的运用

<div grid="~ cols-2 gap-4">
<div>  

<font color="red">题目</font>
通过上面介绍的 console.log AST，下面我们就来完成一个在调用 console.log(xx) 时候给前面加一个函数名，这样用户在打印时候能改方便看到是哪个函数调用的。  

```html
// 源代码
function getData() {
  console.log("data")
}
// --------------------
// 转化后代码
function getData() {
  console.log("getData", "data");
}
```</div>
<div>

<font color="red">介绍</font>  


首先介绍下我们需要使用的工具 Babel  

- @babel/parser : 将 js 代码 ------->>>  AST 抽象语法树；  
- @babel/traverse 对 AST 节点进行递归遍历；
- @babel/types 对具体的 AST 节点进行进行修改；
- @babel/generator :  AST 抽象语法树 ------->>> 新的 js 代码；  

进入 [@babel/parser](https://babeljs.io/docs/babel-parser#credits) 官网开头就介绍了它是使用的 Acorn 来解析 js 代码成 AST 语法树（说明确实 Acorn 比较好）。

</div>
</div>

---
class: px-20
---

## 开始码起来

1、新建文件打开控制台安装需要的包
```js
cnpm i @babel/parser @babel/traverse @babel/types @babel/generator -D
```
2、创建 js 文件, 编写大致布局如下 使用 AST
```js
const generator = require("@babel/generator");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const types = require("@babel/types");
function compile(code) {
  // 1.parse 将代码解析为抽象语法树（AST）
  const ast = parser.parse(code);
  // 2,traverse 转换代码
  traverse.default(ast, {});
  // 3. generator 将 AST 转回成代码
  return generator.default(ast, {}, code);
}
const code = `
function getData() {
  console.log("data")
}
`;
const newCode = compile(code)

```

---
theme: default
---
使用 node 跑出结果，因为什么都没处理，输出的是原代码.  

**完善 compile 方法**
```js
function compile(code) {
  // 1.parse
  const ast = parser.parse(code);
  // 2,traverse
  const visitor = {
    CallExpression(path) {
      // 拿到 callee 数据
      const { callee } = path.node;
      // 判断是否是调用了 console.log 方法 ;1. 判断是否是成员表达式节点;2. 判断是否是 console 对象; 3. 判断对象的属性是否是 log
      const isConsoleLog =types.isMemberExpression(callee) && callee.object.name === "console" && callee.property.name === "log";
      if (isConsoleLog) {
        // 如果是 console.log 的调用 找到上一个父节点是函数
        const funcPath = path.findParent(p => { return p.isFunctionDeclaration() });
        // 取函数的名称
        const funcName = funcPath.node.id.name;
        // 将名称通过 types 来放到函数的参数前面去
        path.node.arguments.unshift(types.stringLiteral(funcName));
      }}};
  // traverse 转换代码
  traverse.default(ast, visitor);
  // 3. generator 将 AST 转回成代码
  return generator.default(ast, {}, code) }
```

---

## 总结
为了兼容低版本浏览器 我们也通常会使用 webpack 打包编译我们的代码将 ES6 语法降低版本，比如箭头函数变成普通函数。将 const、let 声明改成 var 等等，他都是通过 AST 来完成的，只不过实现的过程比较复杂，精致。不过也都是这三板斧：  

- js 语法解析成 AST；
- 修改 AST；
- AST 转成 js 语法；

[控制台打印行号](http://git.kg-inc.cn/fe-sy-lahuo/reinforce-log/-/blob/dev/src/index.ts)

---

# 如何实现代码压缩

### vue2中webpack是如何实现代码压缩的
Webpack通过使用UglifyJSPlugin插件来实现代码压缩。UglifyJSPlugin是一个用于压缩JavaScript代码的插件，它可以删除未使用的代码、注释和控制台语句，以及压缩和混淆变量名。在Vue2中，UglifyJSPlugin已经被默认包含在了Webpack的生产模式配置中，因此无需手动配置即可实现代码压缩。如果需要手动配置UglifyJSPlugin，可以在Webpack配置文件中添加以下代码：
```js
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  plugins: [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          warnings: false, // 是否显示警告信息，默认为true
          drop_console: true, // 是否删除所有的console语句，默认为false
          collapse_vars: true, // 是否将变量声明合并，默认为false。如果设置为true，则会将相同作用域内的变量声明合并为一个。
          reduce_vars: true, // 是否将变量名替换为更短的名称，默认为false。如果设置为true，则会将变量名替换为更短的名称，以减小代码体积。
        },
        output: {
          beautify: false, //是否美化输出，默认为false。如果设置为true，则会输出格式化后的代码，否则会输出压缩后的代码。
          comments: false,//是否保留注释，默认为false。如果设置为true，则会保留代码中的注释，否则会删除注释。
    }}})]
};
```

---
transition: fade-out

---

### UglifyJS通过解析重新生成JS代码的语法树  

以下是一些优化规则会让代码更简洁更高效 ：  

- foo["bar"] ==> foo.bar
- 合并变量声明： var a = 10; var b = 20; ==> var a=10,b=20;
- 计算简单的常量表达式：1 + 2 * 3 ==> 7. UglifyJS只替换计算结果比实际表达式字节更少的情况；比如 1/3 结果为 0.333333333333，因此不会被替换。
- IF语句的优化 ：  

        if (foo) bar(); else baz(); ==> foo?bar():baz();  

        if (!foo) bar(); else baz(); ==> foo?baz():bar();  

        if (foo) bar(); ==> foo&&bar();  


---
---
## vue3中代码是如何压缩的
Vue3脚手架中的代码压缩是通过Vite实现的。Vite是一个基于ESM的构建工具，它使用Rollup作为打包工具，并集成了Terser插件来进行代码压缩。在Vite中，默认情况下，生产模式下的构建会自动应用Terser插件进行代码压缩，无需手动配置。  

具体来说，Vite会在构建过程中使用Rollup的插件机制，将Terser插件应用于生成的代码中。Terser插件会删除未使用的代码、注释和控制台语句，以及压缩和混淆变量名，从而实现代码的压缩。  

需要注意的是，由于Vite的设计理念是基于ESM模块的开发，它利用浏览器原生的ES模块加载机制，因此在开发过程中不需要像传统的Webpack那样进行代码的打包和压缩。这使得Vite在开发环境下能够实现更快的冷启动和热模块替换，提供更好的开发体验。

---

##  模拟UglifyJS
为了模拟UglifyJS，我们可以编写一个简易版的代码压缩插件。具体实现过程如下：
- 词法分析：将代码分解成单词或符号，生成一个标记流。
- 语法分析：将标记流转换为抽象语法树（AST），并对AST进行优化。
- 代码生成：将AST转换回代码。
- 压缩：删除未使用的代码、注释和控制台语句，以及压缩和混淆变量名。  

以下是一个简单的代码压缩插件的实现示例：  

```js
const { parse } = require('acorn');
const { walk } = require('estree-walker');
const { minify } = require('terser');
module.exports = function myUglifyJSPlugin() {
  return {
    name: 'my-uglify-js-plugin',
    transform(code, id) {
      // 词法分析
      const tokens = parse(code, { ecmaVersion: 2020 }).body;
      
```
---
transition: fade-out
---
```js
      // 语法分析
      walk(tokens, {
        enter(node) {
          // 删除注释(块注释、行注释)
          if (node.type === 'BlockComment' || node.type === 'LineComment') {
            node.skip = true; //node.skip = true 的含义是将当前节点标记为跳过。这意味着在后续的处理中，这些被标记为跳过的节点将被忽略，不会被包含在最终的压缩代码中。
          }
          // 删除console语句
          if (node.type === 'CallExpression' && node.callee.name === 'console') {
            node.skip = true;
          }
        },
      });
      // 代码生成
      const ast = { type: 'Program', body: tokens };
      // terser库中的minify函数来压缩AST对象。minify函数会将AST对象转换回代码，并进行压缩和混淆变量名等操作
      const { code: minifiedCode } = minify(ast);
      // 返回压缩后的代码
      return {
        code: minifiedCode,
        map: null,
      };
    },
  };
};
```
---
transition: fade-out
---
# 如何实现Eslint插件
### 下面是一个将var转换为let的ESLint插件的实现示例：
```js
module.exports = {
  rules: {
    'no-var': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'disallow the use of var',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: 'code',
      },
      create(context) {
        return {
          VariableDeclaration(node) {
            if (node.kind === 'var') {
              context.report({
                node,
                message: 'Unexpected var, use let or const instead.',
                fix(fixer) {
                  const declarations = node.declarations.map((decl) => {
                    const { id, init } = decl;
                   
```

---
transition: fade-out
---
```js
 return fixer.replaceText(
                      decl,
                      `${init ? 'let' : 'const'} ${context.getSourceCode().getText(id)} = ${context.getSourceCode().getText(init)}`
                    );
                  });
                  return fixer.replaceText(node, declarations.join(','));
};
```
<div font-size="12px">
在上面的代码中，我们定义了一个ESLint插件规则，用于检查代码中是否使用了var关键字。如果检测到使用了var关键字，就会报告一个错误，并提供一个自动修复的选项，将var关键字替换为let或const关键字。  

 具体来说，我们使用ESLint提供的API来定义自定义规则。在create函数中，我们返回一个对象，该对象包含了一个VariableDeclaration属性，用于检查变量声明语句。如果变量声明语句的kind属性为var，就会报告一个错误，并提供一个自动修复的选项。在自动修复的过程中，我们使用fixer.replaceText()方法来替换var关键字为let或const关键字，并保留变量名和初始值。  

 最后，我们将插件规则添加到.eslintrc.js文件中，从而使ESLint能够应用该规则。在.eslintrc.js文件中，我们将插件添加到plugins数组中，并配置插件的规则。例如，我们可以将上面的插件规则添加到.eslintrc.js文件中的rules对象中，如下所示：  
</div>
```js
module.exports = {
  // ...
  plugins: ['my-eslint-plugin'],
  rules: {
    'my-eslint-plugin/no-var': 'error',
}};
<!-- 这样，ESLint就会在检查代码时应用我们定义的插件规则，从而实现将var关键字替换为let或const关键字的功能。 -->
```

---
transition: fade-out
---
# 如何实现按需加载
## 前言  
### Vue 为什么需要懒加载（按需加载）？  
<br/>
<div font-size="12px">
学习Vue的时候，各类教程都会告诉我们：Vue 的特点是SPA——Single Page Application（单页应用程序）。它有着诸如：“只有第一次会加载页面, 以后的每次页面切换，只需要进行组件替换；减少了请求体积，加快页面响应速度，降低了对服务器的压力” 等等优点。

但是呢！因为Vue 是SPA，所以首页第一次加载时会把所有的组件以及组件相关的资源全都加载了。这样就会导致首页加载时加载了许多首页用不上的资源，造成网站首页打开速度变慢的问题，降低用户体验。

为了解决上面问题，我们需要对Vue实现组件懒加载（按需加载）。

#### 什么是懒加载（按需加载）？  

 懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。  

 [《webpack——懒加载》](https://webpack.docschina.org/guides/lazy-loading/)  


</div>

---
transition: fade-out
---
#### 懒加载（按需加载）的前提
<div font-size="12px">

进行懒加载的子模块（子组件）需要是一个单独的文件。
为什么呢？因为懒加载是对子模块（子组件）进行延后加载。如果子模块（子组件）不单独打包，而是和别的模块掺和在一起，那其他模块加载时就会将整个文件加载出来了。这样子模块（子组件）就被提前加载出来了。

所以，要实现懒加载，就得先将进行懒加载的子模块（子组件）分离出来。  

懒加载前提的实现：ES6的动态地加载模块——import()。
 调用 import() 之处，被作为分离的模块起点，意思是，被请求的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。  

[《webpack——模块方法》的import()小节](https://webpack.docschina.org/api/module-methods/#import-)
  
  简单来讲就是，通过import()引用的子模块会被单独分离出来，打包成一个单独的文件（打包出来的文件被称为chunk ）。

  依照webpack原本的打包规则打包项目，我们就无法确定子模块在打包出来的哪个JS文件中，而且子模块的代码会和其他代码混合在同一个文件中。这样就无法进行懒加载操作。所以，要实现懒加载，就得保证懒加载的子模块代码单独打包在一个文件中。
</div>

---
transition: fade-out
---
### 代码示例：
构建一个简单的webpack项目：  

1、首先，webpack.config.js 文件配置如下：
```js
/*webpack.config.js*/
const path = require('path')
module.exports = { 
    entry:'./src/main.js', //入口文件
    output: { 
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].bundle.js',
        filename: 'bundle.js',
}}
```
2、创建入口文件main.js
```js
/* main.js */
// 这里引入con.js，注意没有使用import()
require('./con.js')
```
3、创建被引入文件con.js
```js
/* con.js */
function cons(){console.log("123")}
module.exports = {cons}
```

---
transition: fade-out
---
运行npm run build进行打包,结果如下：
dist  

 bundle.js  
 
<div font-size="12px">
使用require()引入con.js，打包后的结果是con.js合并到的bundle.js  

接下来，使用import()引入con.js：
</div>
```js
/* main.js 这里使用import()引入con.js*/
import(/* webpackChunkName: "con" */ './con.js')
```
打包结果如下：  

![](https://kgimages.kgdc.cn/suyun/ceb57b0cbc8c51e99242d4351ad98aac.png) <br/>
<div font-size="12px">
使用import()引入con.js，con.js打包成独立的js文件。  
这里设定了chunkFilename的命名规则为：[name]+.+bundle.js。这里的[name]就是/* webpackChunkName: "con" */设定的值。
</div>

---
transition: fade-out
---
<div font-size="12px">
借助import()，我们实现了子模块（子组件）的独立打包（children chunk）。现在，距离实现懒加载（按需加载） 还差关键的一步——如何正确使用独立打包的子模块文件（children chunk）实现懒加载。这也是懒加载的原理。

借助函数实现懒加载（按需加载）
首先，我们先来回顾一下JavaScript函数的特性。
无论使用函数声明还是函数表达式创建函数，函数被创建后并不会立即执行函数内部的代码，只有等到函数被调用之后，才执行内部的代码。

- 只要将需要进行懒加载的子模块文件（children chunk）的引入语句（本文特指import()）放到一个函数内部。然后在需要加载的时候再执行该函数。这样就可以实现懒加载（按需加载）。这也是懒加载的原理了。
</div>

```js
const routes = [{ 
  path: '/',
  name: 'Home',
  // 将子组件加载语句封装到一个function中，将function赋给component
  component: () => import( /* webpackChunkName: "home" */ '../views/Home.vue')
}
]
```  

除了ES6 的import()这个方法，webpack本身还提供了另一个方法—— require.ensure()

[《webpack——module-methods：require.ensure》](https://webpack.docschina.org/api/module-methods#require-ensure)


---
transition: fade-out
---
## babel-plugin-component 如何实现的按需加载
https://juejin.cn/post/6847902223629090824#comment

/node_modules/babel-plugin-component/lib/core.js

```js
// 源代码
import { Button } from 'element-ui'
Vue.use(Button)
// 目标代码
var Button = require('element-ui/lib/button.js')
require('element-ui/lib/theme-chalk/button.css')

```  

- 要知道babel入口位置在visitor，以及在visitor中找哪些方法去读   <br/>

- 用AST Explorer分析和对比我们的源代码和目标代码

---
transition: fade-out
---
# 如何利用AST圈复杂度
```js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
function calculateCyclomaticComplexity(code) {
  const ast = parser.parse(code);
  let complexity = 1; // 默认圈复杂度为1，表示函数的起始节点
  traverse.default(ast, {
    IfStatement() {
      complexity++;
    },
    WhileStatement() {
      complexity++;
    },
    ForStatement() {
      complexity++;
    },
    SwitchStatement() {
      complexity++;
    },
    LogicalExpression() { // || 
      complexity++;
    },
    ConditionalExpression() { // boolean ? 'a' : 'b'
      complexity++;
    },
  });
```
---
transition: fade-out
---
```js
  return complexity;
}
// 示例代码
const code = `
function foo(x) {
  if (x > 0) {
    console.log("Positive");
  } else {
    console.log("Non-positive");
  }
}
`;
const complexity = calculateCyclomaticComplexity(code);
console.log("代码的圈复杂度为:", complexity);
```
---