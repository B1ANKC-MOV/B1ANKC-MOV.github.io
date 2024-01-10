# 全栈学习·第三方组件（element-ui）

## 组件间的传值
- 组件可以由内部的Data提供数据，也可以由父组件通过prop的方式传值
- 兄弟组件之间可以通过Vuex等统一数据源提供数据共享

**项目创建**（Vue2）
1. 终端输入
```
vue create component-demo
```
2. 把Linter取消选中
3. 选择Vue2
4. 创建

**Vue2与Vue3的差异**（主要在main.js中）：

- Vue3通过create app创建Vue对象，Vue2通过new Vue创建Vue对象
- Vue3使用的是.mount，Vue2使用的是.$mount
## Element-ui
1. Element是国内饿了么公司提供的一套开源前端框架，简洁优雅，提供了Vue、React、Angular等多个版本。
2. 文档地址：```https://element.eleme.cn/#/zh-CN/```
3. 安装：
```
npm i element-ui
```
4. 引入Element
```js
// 在main.js文件头中加入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
```
5. 注册Element
```js
// 在main.js文件中写入
Vue.use(ElementUI);
```

**（如果node_modules没了，可以直接npm install重新下载依赖）**

## 第三方图标库FontAwesome
1. 由于Element UI提供的字体图符较少，一般会采用其他图表库，如著名的FontAwesome
2. Font Awesome提供了675个可缩放的矢量图标，可以使用CSS所提供的所有特性对它们进行更改，包括大小、颜色、阴影或者其他任何支持的效果。
3. 文档地址: ```http://fontawesome.dashgame.com/```
4. 安装: 
```
npm install font-awesome
```
5. 使用（在main.js中写入）:
``` 
import 'font-awesome/css/font-awesome.min.css'
```

## 实操代码
<u>**App.vue文件**</u>

```
<template>
  <div id="app">
  <Movie v-for="movie in movies" :key="movie.id"  :title="movie.title" :rating="movie.rating"></movie>
  <hello></hello>
  </div>
</template>

<script>
import Movie from './components/Movie.vue'
import Hello from './components/hello.vue'
import axios from 'axios'
export default {
  name: 'App',
  data:function(){
    return{
      movies:[
      {id:1,title:"Tranformers1",rating:8.9},
      {id:2,title:"Tranformers2",rating:8.8},
      {id:3,title:"Tranformers3",rating:8.7},
      ]
    }
  },
  created:function(){
      console.log("APP组件被创建了")
    },
  components: {
    Movie,
    Hello
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```
<u>**Movie.vue文件**</u>

```
<template>
    <div>
    <h1>{{title}}</h1>
    <span>{{rating}}</span>
    <button @click="fun">点击收藏</button>
    </div>
</template>

<script>
export default {//导出，vue.app做导入，正好对应
    name:"Movie",
    props:["title","rating"],
    data:function(){
        return{

        }
    },
    created: function(){
        console.log("Movie组件被创建了")
    },
    mounted:function(){
        console.log("APP组件被创建了")
    },
    methods:{
    fun(){
        alert("收藏成功")
        }
    }
}
</script>
```
<u>**hello.vue文件**</u>

```
<template>
  <div>
<el-table
    :data="tableData"
    style="width: 100%"
    :row-class-name="tableRowClassName">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
<i class="fa fa-camera-retro"></i> 
    <el-date-picker
      v-model="value1"
      type="date"
      placeholder="选择日期">
    </el-date-picker>
  </div>
</template>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<script>
export default {
 methods: {
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }
    },
     data() {
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      }
}
</script>
```
