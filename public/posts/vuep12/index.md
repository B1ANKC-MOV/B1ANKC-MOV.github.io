# 【Java全栈学习】十一、前端路由VueRouter

## VueRouter的安装与使用
- Vue路由vue-router是官方的路由插件，能够轻松的管理 SPA 项目中组件的切换
- Vue的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来
- vue-router 目前有 3.x 的版本和 4.x 的版本，vue-router 3.x 只能结合 vue2进行使用，vue-router 4.x 只能结合 vue3 进行使用
- 安装：
```
npm install vue-router@4
```
- 官网：
```
https://v3.router.vuejs.org/zh/guide/
```
### vue-router安装
1. cmd输入

```
vue create router-demo
```
2. 上下键换行选择**```Manually select features```**

3. 上下键换行，空格**取消选中```Linter/Formatter```**，确定后回车

4. 上下键换行，选择**2.x版本**

5. 上下键换行，选择**In package.json**

6. 不保存预设，输入**N**后回车

7. 打开项目，在终端输入指令安装Vue.Router3
```
npm install vue-router@3
```
### 创建路由组件
在项目中定义Discover.vue、Friends.vue、My.vue三个组件，将来要使用vue-router来控制它们的展示与切换：
Discover.vue

```html
<template>
    <div>
        <h1>发现音乐</h1>
    </div>
</template>
```

Friends.vue

```html
<template>
    <div>
        <h1>关注</h1>
    </div>
</template>
```

My.vue

```html
<template>
    <div>
        <h1>我的音乐</h1>
    </div>
</template>
```
### 声明路由链接和占位标签
可以使用```<router-link>```标签来声明路由链接，并使用```<router-view>```标签来声明路由占位符。示例代码如下：
App.vue

```html
  <div id="app">
    <h1>APP组件</h1>
    <!-- 声明路由链接 -->
    <router-link to="/discover">发现音乐</router-link>
    <router-link to="/my">我的音乐</router-link>
    <router-link to="/friends">关注</router-link>
    <!-- 声明路由占位标签 -->
    <router-view></router-view>
  </div>
</template>
```
### 创建路由模块
在项目中创建router文件夹，下面的index.js路由模块，加入以下代码：

```js
import VueRouter from "vue-router";
import Vue from "vue";
import Discover from '../components/Discover.vue'
import Friends from '../components/Friends.vue'
import My from '../components/My.vue'

// 将VueRouter设置为Vue的插件
Vue.use(VueRouter)

const router = new VueRouter({
    // 指定hash属性与组件的对应关系
    routes:[
        {path:'/discover',component:Discover},
        {path:'/friends',component:Friends},
        {path:'/my',component:My},
    ]
})

export default router
```

接着在main.js里面导入router

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')
```

### 路由重定向

路由重定向指的是：用户在访问地址A的时候，强制用户跳转到地址C，从而展示特定的组件页面。

通过路由规则的redirect属性，指定一个新的路由地址，可以很方便地设置路由的重定向：

```js
const router = new VueRouter({
    // 指定hash属性与组件的对应关系
    routes:[
        // 当用户访问 / 时，跳转到/discover
        {path:'/',redirect:'/discover'},
        {path:'/discover',component:Discover},
        {path:'/friends',component:Friends},
        {path:'/my',component:My},
    ]
})
```

### 嵌套路由

在Discover.vue组件中，声明toplist和playlist的子路由链接以及子路由占位符。示例代码如下：

```html
<template>
    <div>
        <h1>发现音乐</h1>
        <!-- 子路由链接 -->
        <router-link to="/discover/toplist">推荐</router-link>
        <router-link to="/discover/playlist">歌单</router-link>
        <hr>
        <router-view></router-view>
    </div>
</template>
```

在src/router/index.js路由模块中，导入需要的组件，并使用children属性声明子路由规则：

```js
const router = new VueRouter({
    // 指定hash属性与组件的对应关系
    routes:[
        // 当用户访问 / 时，跳转到/discover
        {path:'/',redirect:'/discover'},
        {
            path:'/discover',
            component:Discover,
            // 通过children属性，嵌套声明子路由
            children:[
                {path:'toplist',component:TopList},
                {path:'playlist',component:PlayList},
            ]
        },
        {path:'/friends',component:Friends},
        {path:'/my',component:My},
    ]
})
```

### 动态路由

思考：有如下3个路由链接：

```html
<router-link to="/product/1">商品1</router-link>
<router-link to="/product/2">商品2</router-link>
<router-link to="/product/3">商品3</router-link>
```

```js
const router = new VueRouter({
	// 指定hash属性与组件的对应关系
    routes:[
        {path:'/product/1',component:Product},
        {path:'/product/2',component:Product},
        {path:'/product/3',component:Product},
    ]
})
```

上述方式复用性非常差。

动态路由指的是：把Hash地址中可变的部分定义为参数项，从而提高路由规则的复用性。在vue-router中使用英文的冒号（:）来定义路由的参数项。示例代码如下：

```js
{path:'/product/:id',component:Product}
```

通过动态路由匹配的方式渲染出来的组件中，可以使用$route.params对象访问到动态匹配的参数值，**比如在商品详情组件的内部，根据id值，请求不同的商品数据**。

```html
<template>
    <h1>Product组件</h1>
    <!-- 获取动态的id值 -->
    <p>{{$route.params.id}}</p>
</template>

<script>
export default {
    // 组件的名称
    name:'Product'
}
</script>
```

为了简化路由参数的获取形式，vue-router允许在路由规则中开启props传参。示例代码如下：

```js
{path:'/product/:id',component:Product,props:true}
```

```html
<template>
    <h1>Product组件</h1>
    <!-- 获取动态的id值 -->
    <p>{{id}}</p>
</template>

<script>
export default {
    // 组件的名称
    name:'Product',
    props:["id"]
}
</script>
```

### 声明式导航

| 声明式                       | 编程式                 |
| ---------------------------- | ---------------------- |
| ```<router-link:to="...">``` | ``` route.push(...)``` |

除了使用```<router-link>```时，这个方法会在内部调用，所以说，点击``` <router-link:to="...">```等同于调用```router.push(...)```。

```html
<template>
	<button @click="gotProduct(2)">跳转到商品2</button>
</template>

<script>
export default{
    methods:{
        gotProduct: function(id){
            this.$router.push('/movie/${id}')
        }
    }
}
</script>
```

### 导航守卫

导航守卫可以控制路由的访问权限。

全局导航守卫会拦截每个路由规则，从而对每个路由进行访问权限的控制。

你可以使用```router.beforeEach```注册一个全局前置守卫：

```js
// 这是伪代码
router.beforeEach((to,from,next)=>{
  if(to.path === '/main' && !isAuthenticated){
  		next('/login')
  }else{
  		next()
  }
})
```

- **```to```**:即将要加入的目标
- **```from```**:当前导航正要离开的路由
- 在守卫方法中如果声明了**next**形参，则必须调用next()函数，否则不允许用户访问任何一个路由！
  - 直接放行：next()
  - 强制其停留在当前页面：next(false)
  - 强制其跳转到登录页面：next('/login')

