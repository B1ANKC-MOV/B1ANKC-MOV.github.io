# 【Java全栈学习】十二、状态管理VueX


## Vuex介绍

- 对于组件化开发来说，大型应用的状态往往跨越多个组件。在多层嵌套的父子组件之间传递状态已经十分麻烦，而Vue更是没有为兄弟组件提供直接共享数据的办法。
- 基于这个问题，许多框架提供了解决方案——使用全局的状态管理器，将所有分散的共享数据交由状态管理器保管，Vue也不例外。
- Vuex 是一个专为 Vue.js 应用程序开发的状态管理库，采用集中式存储管理应用的所有组件的状态。
- 简单的说，Vuex用于管理分散在Vue各个组件中的数据。
- 安装：
```
npm install vuex@next
```

- 官网

```
https://v3.vuex.vuejs.org/zh/
```

<!--more-->

## 状态管理

- 每一个Vuex应用的核心都是一个store，与普通的全局对象不同的是，基于Vue数据与视图绑定的特点，当store中的状态发生变化时，与之绑定的视图也会被重新渲染。
- store中的状态不允许被直接修改，改变store中的状态的唯一途径就是显式地提交（commit）mutation，这可以让我们方便地跟踪每一个状态的变化。
- 在大型复杂应用中，如果无法有效地跟踪到状态的变化，将会对理解和维护代码带来极大的困扰。
- Vuex中有5个重要的概念：State、Getter、Mutation、Action、Module。

### State

- State用于维护所有应用层的状态，并确保应用只有唯一的数据源

```js
// 创建一个新的store实例
const store = createStore({
	state(){
		return{
			count:0
		}
	},
	mutations:{
		increment(state){
			state.count++
		}
	}
})
```

- 在组件中，可以直接使用this.$store.state.count访问数据，也可以先用mapState辅助函数将其映射下来

```js
// 在单独构建的版本中辅助函数为Vuex.mapState
import{ mapState } from 'vuex'

export default{
	// ...
	computed:mapState({
		// 箭头函数可使代码更简练
		count:state => state.count,
		
		// 传字符串参数'count'等同于`state => state.count`
		countAlias:'count',
		
		// 为了能够使用`this`获取局部状态，必须使用常规函数
		countPlusLocalState(state){
			return state.count + this.localCount
		}
	})
}
```

### Getter

- Getter维护由State派生的一些状态，这些状态随着State状态的变化而变化

```js
const store = createStore({
	state:{
		todos:[
			{id:1,text:'...',done:true},
			{id:2,text:'...',done:false}
		]
	},
	getters:{
		doneTodos:(state)=>{
			return state.todos.filter(todo => todo.done)
		}
	}
})
```

- 在组件中，可以直接使用this.$store.getters.doneTodos，也可以先用mapGetters辅助函数将其映射下来，代码如下：

```js
import {mapGetters} from 'vuex'

export default{
	// ...
	computed:{
	// 使用对象展开运算符将getter混入computed对象中
		...mapGetters([
			'doneTodosCount',
			'anotherGetter',
			// ...
		])
	}
}
```

### Mutation

- Mutation提供修改State状态的方法

```js
// 创建一个新的store实例
const store = createStore({
	state(){
		return{
			const:0
		}
	},
	mutations:{
		increment(state){
			state.count++
		}
	}
})
```

- 在组件中，可以直接使用store.commit来提交mutation

```js
methods:{
	increment(){
		this.$store.commit('increment')
		console.log(this.$store.state.count)
	}
}
```

- 也可以先用mapMutation辅助函数将其映射下来

```js
methods:{
	...mapMutations([
		'increment',// 将`this.increment()`映射为`this.$store.commit('increment')`
		
		// `mapMutations`也支持载荷:
		'incrementBy' // 将`this.incrementBy(amount)`映射为`this.$store.commit('incrementBy',amount)`
	]),
}
```

### Action

- Action类似Mutation，不同在于：
- Action不能直接修改状态，只能通过提交mutation来修改，Action可以包含异步操作

```js
const store = createStore({
	state:{
		count:0
	},
	mutations:{
		increment(state){
			state.count++
		}
	},
	actions:{
		increment(context){
			context.commit('increment')
		}
	}
})
```

- 在组件中，可以直接使用this.$store.dispatch('xxx')分发 action，或者使用mapActions辅助函数先将其映射下来

```js
// ...
methods:{
	...mapActions([
		'increment',// 将`this.increment()`映射为`this.$store.commit('increment')`
		
		// `mapMutations`也支持载荷:
		'incrementBy' // 将`this.incrementBy(amount)`映射为`this.$store.commit('incrementBy',amount)`
	])
}
```

### Module

- 由于使用单一状态树，当项目的状态非常多时，store对象就会变得十分臃肿。因此，Vuex允许我们将store分割成模块（Module）
- 每个模块拥有独立的State、Getter、Mutation和Action，模块之中还可以嵌套模块，每一级都有着相同的结构。

```js
const moduleA = {
	state:()=>({...}),
	mutations:{...},
	actions:{...},
	getters:{...}
}

const moduleB = {
	state:()=>({...}),
	mutations:{...},
	actions:{...}
}

const store = createStore({
    modules:{
        a:moduleA,
        b:moduleB
    }
})

store.state.a // ->moduleA的状态
store.state.b // ->moduleB的状态
```

## 总结

- 作为一个状态管理器，首先要有保管状态的容器——State；
- 为了满足衍生数据和数据链的需求，从而有了Getter；
- 为了可以“显式地”修改状态，所以需要Mutation；
- 为了可以“异步地”修改状态（满足AJAX等异步数据交互），所以需要Action；
- 最后，如果应用有成百上千个状态，放在一起会显得十分庞杂，所以分模块管理（Module）也是必不可少的；
- Vuex并不是Vue应用开发的必选项，在使用时，应先考虑项目的规模和特点，有选择地进行取舍，对于小型应用来说，完全没有必要引入状态管理，因为这会带来更多的开发成本；

## 实操

1. ``vue  vuex-demo``创建vue文件
2. 终端安装vuex

```
npm install vuex@3
```

3. 在src文件夹下创建**store/index.js**文件，导入vue和vuex

```js
import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store
```

4. 在**main.js**文件里面导入store

```js
import Vue from 'vue'
import App from './App.vue'
import store from './store'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
```

5. 在**HelloWorld.vue**里面调用数据

```vue
<template>
  <div class="hello">
    {{this.$store.state.count}}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

}
</script>

<style scoped>

</style>
```

6. 修改**App.vue**为

```vue
<template>
  <div id="app">
    <HelloWorld/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
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

7. **HelloWorld.vue**里面添加+1按钮

```vue
<template>
  <div class="hello">
    {{this.$store.state.count}}
    <button @click="add">+1</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  methods:{
    add(){
      // this.$store.state.count = this.$store.state.count+1
      this.$store.commit("increment")
    }
  }

}
</script>

<style scoped>

</style>
```

8. 使用mapState辅助函数

**HelloWorld.vue**

```vue
<template>
  <div class="hello">
    <!-- {{this.$store.state.count}} -->
    {{count}}      
    <button @click="add">+1</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HelloWorld',
  // computed:{
  //   count(){
  //     return this.$store.state.count
  //   }
  // },
  computed: mapState([
  // 映射 this.count 为 store.state.count
    'count'
  ]),
  methods:{
    add(){
      // this.$store.state.count = this.$store.state.count+1
      this.$store.commit("increment")
    }
  }

}
</script>

<style scoped>

</style>
```

当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

9. 使用Getter里面的Todos

**HelloWorld.vue**

```vue
<template>
  <div class="hello">
    {{count}}      
    <button @click="add">+1</button>

    <ul>
      <li v-for="todo in doneTodos" :key="todo.id">{{todo.text}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState([
    'count','todos'
    ]),
    ...mapGetters([
      'doneTodos'
    ])
  },
  methods:{
    add(){
      // this.$store.state.count = this.$store.state.count+1
      this.$store.commit("increment")
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
}
</script>

<style scoped>

</style>
```

**index.js**

```js
import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: 'eat', done: true },
      { id: 2, text: 'sleep', done: false }
    ]
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

export default store
```

10. 使用Mutations里面的Payload

**HelloWorld.vue**

```vue
<template>
  <div class="hello">
    <!-- {{this.$store.state.count}} -->
    {{count}}      
    <button @click="add">+1</button>

    <ul>
      <li v-for="todo in doneTodos" :key="todo.id">{{todo.text}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
export default {
  name: 'HelloWorld',
  computed: {
    ...mapState([
    'count','todos'
    ]),
    ...mapGetters([
      'doneTodos'
    ])
  },
  methods:{
    add(){
      this.$store.commit("increment",2)
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
}
</script>

<style scoped>

</style>
```

**index.js**

```js
import Vue from "vue";
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    todos: [
      { id: 1, text: 'eat', done: true },
      { id: 2, text: 'sleep', done: false }
    ]
  },
  mutations: {
    increment (state,n) {
      state.count += n
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

export default store
```


