# 【Java全栈学习】七、Vue框架介绍及应用

{{< admonition info >}}
需要前端基础html、css、js
{{< /admonition >}}

## Vue框架介绍
- vue是一套用于构建用户界面的渐进式框架。
- vue.js提供了MVVM数据绑定和一个可组合的组件系统，具有简单、灵活的API。
- 其目标是通过尽可能简单的API实现响应式的数据绑定和可组合的视图组件。
## MVVM模式
MVVM基于MVC（Model-View-Controller)但是在Controller上作了修改
- MVVM是Model-View-ViewModel的缩写，它是一种基于前端开发的架构模式，其核心是提供对View和ViewModel的双向数据绑定。
- Vue提供了MVVM风格的双向数据绑定。核心是MVM中的VM，也就是
- ViewModel,ViewModel负责连接View和Model，保证视图和数据的一致性。
### 实操
（使用VScode）
1. 创建html文件，使用<kbd>！</kbd>+<kbd>Enter</kbd>，生成代码，去代码copy链接↓
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>

</body>
</html>
```
2. 调用**CreateApp**的方法，且告知渲染至哪（扩展→Open in browser插件，run的时候就能从浏览器快速打开）
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>


    <div id="app">{{ message }}</div>

    <script>
    const { createApp } = Vue
    
    createApp({
        data() {
        return {
            message: 'Hello Vue!'
        }
        }
    }).mount('#app')
    </script>
</body>
</html>
```
**演示代码文件**:

- “：”后为变量或表达式，属性的绑定需要加“：”，不加会变成字段。
#### 01. 基本用法
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>


    <div id="app">{{ message }}</div>

    <script>
    const { createApp } = Vue
    
    createApp({
        data() {
        return {
            message: 'Hello Vue!'
        }
        }
    }).mount('#app')
    </script>
</body>
</html>
```
#### 02. 内容渲染指令
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <p>姓名:{{username}}</p>
        <p>性别：{{gender}}</p>
<!-- 花括号是vue里面的data模板，会做一些渲染。
对http不会进行渲染，但是使用v-html可以进行渲染 -->
        <p>{{desc}}</p>
        <p v-html="desc"></p>
    </div>

    <script>
    const vm = {
    data:function(){
        return{
                username:'zhangsan',
                gender:'男',
                desc:'<a href="http://www.baidu.com">百度</a>'
            }
        }
    }
    const app = Vue.createApp(vm)
    app.mount('#app')
    </script>
</body>
</html>
```
#### 03. 属性绑定指令
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <a :href="link">百度</a>
<!-- 冒号就是进行渲染，这里把link放在这，vue就会把值渲染到超链接上 -->
        <input type="text" :placeholder="inputValue">
        <img :src="imgSrc" :style="{width:w}" alt="">
    </div>

    <script>
        const vm = {
            data: function(){
            return{
                    link:"http://www.baidu.com",
                    //文本框的占位符内容
                    inputValue:'请输入内容',
                    //图片的src地址
                    imgSrc:'./images/demo.png',
                    w:'500px'
                }
            }
        }
        const app = Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
#### 04. 使用JavaScript表达式
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <p>{{number + 1}}</p>
        <p>{{ok ? 'True' : 'False'}}</p>
        <p>{{message.split('').reverse().join('')}}</p>
        <p :id="'list-' + id">xxx</p>
        <p>{{user.name}}</p>
    </div>

    <script>
        const vm = {
            data :function(){
                return{
                    number:9,
                    ok:false,
                    message:'AAA+ABC',
                    id:3,
                    user:{
                        name:'zs',
                    }
                }
            }
        }
        const app = Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
#### 05. 事件绑定指令
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <h3>count的值为：{{count}}</h3>
        <button v-on:click="addCount">+1</button>
        <button @click="count+=1">+1</button>
    </div>

    <script>
        const vm = {
            data:function(){
                return{
                    count:0,
                }
            },
            methods:{
                //点击按钮，让count+1
                addCount(){
                    this.count+=1
                },
            },
        }
        const app = Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
#### 06. 条件渲染指令
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <button @click ="flag=!flag">Toggle Flag</button>

        <p v-if="flag">请求成功 --- 被 v-if 控制</p>
        <p v-show="flag">请求成功 --- 被 v-show控制</p>
    </div>

    <script>
        const vm ={
            data:function(){
                return{
                    flag:false,
                }
            }
        }
        const app = Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
#### 07. 列表渲染指令
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <ul>
            <li v-for="(user,i) in userList">索引是：{{i}},姓名是：{{user.name}}</li>
        </ul>
    </div>

    <script>
        const vm ={
            data:function(){
                return {
                    userList:[
                        {id:1,name:'zs'},
                        {id:2,name:'ls'},
                        {id:3,name:'ww'},
                    ],
                }
            },
        }
        const app=Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
#### 08. v-for中的key
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
    <div id="app">
        <div>
            <input type="text" v-model="name">
            <button @click="addNewUser">添加</button>
        </div>
        <ul>
            <li v-for="(user,index) in userList":key="user.id">
            <input type="checkbox"/>
            姓名：{{user.name}}
            </li>
        </ul>
    </div>

    <script>
        const vm ={
            data:function(){
                return {
                    userList:[
                        {id:1,name:'zs'},
                        {id:2,name:'ls'},
                        {id:3,name:'ww'},
                    ],
                // 输入的用户名
                name:'',
                //下一个可用的id值
                nextId:3
                }
            },
            methods:{
                addNewUser(){
                    this.userList.unshift({id:this.nextId,name:this.name})
                    this.name=''
                    this.nextId++
                }
            }
        }
        const app=Vue.createApp(vm)
        app.mount('#app')
    </script>
</body>
</html>
```
