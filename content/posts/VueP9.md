+++
title = '全栈学习·Vue组件化&模块化开发'
date = 2023-12-11T15:32:53+08:00
draft = false
tags = ["个人学习","前端"]
categories = ["SpringBoot+Vue全栈开发"]
subtitle = ''
author = ''
authorLink = ''
description = ''
license = ''
images = []
featuredImage = ""
featuredImagePreview = ""
summary=''
hiddenFromHomePage = false
hiddenFromSearch = false
twemoji = false
lightgallery = true
ruby = true
fraction = true
fontawesome = true
linkToMarkdown = true
rssFullText = false
outdatedInfoWarning = true

+++
## NPM使用
**NPM简介**
- NPM (Node Package Manager)是一个NodeJS包管理和分发工具。
- NPM以其优秀的依赖管理机制和庞大的用户群体，目前已经发展成为整个JS领域的依赖管理工具
- NPM最常见的用法就是用于安装和更新依赖。要使用NPM，首先要安装**Node工具**。
## NPM&Vue下载安装
1. 进入```https://nodejs.org/en```网站下载Node.js
2. 打开msi安装包一直点击next完成安装
3. <kbd>win</kbd>+<kbd>R</kbd>打开终端，进入项目路径，输入
```
npm install -g @vue/cli
```
（网络问题可以先输入下面代码更换代理再安装）
```
npm config set registry https://registry.npm.taobao.org
```
## Vue CLI使用
### 创建Vue项目
1. 输入
```
vue create hello
```
2. 上下键切换选项，选择**Manually select features**选项，并<kbd>回车</kbd>
3. 上下切换选项，空格选中/取消选中，<kbd>空格</kbd>取消选中**Linter/Formatter**选项，并<kbd>回车</kbd>
4. 选择**3.x**版本并<kbd>回车</kbd>
5. 选择**不存储**预选，输入<kbd>N</kbd>
### Vue文件基本结构
- package.json：配置文件，记录项目基本信息
- src：写代码的目录
- **main.js**:主要用到模块化开发的思想（区别于组件化），目前前端项目基本通过import的方式导入各类模块。（早期的前端代码主要通过script标签去引入各类文件）
	- 第一行：通过vue导入其createApp方法
	- 第二行：导入了app.vue的app
	- 调用createApp方法，把app传过去，同时将其mount到了#app标签上（标签在public的index.html里）

**main.js全部代码如下**：
```
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```
-  **Vue.app**：
	- ``` <template>```：放组件的标签、文本、结构，放置了：
		- img标签
		- helloworld标签（自定义组件，在components里面，可以删掉自己写）
	- ```<script>```:放组件的一些行为
	- ```<style>```：放组件的一些css的样式

**Vue.app全部代码如下：**：
```
<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
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
### 运行Vue项目
打开终端，输入：
```
npm run serve
```
### 自定义组件
1. 使用import导入,例如：
```
import HelloWorld from './components/HelloWorld.vue'
```
2. 导入结束后进行注册:
```
export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
```
(1、2步代码都放在script内)

3. 创建.vue文件自定义组件：添加```<template>、<script>、<style>```标签,在标签里简单加入内容即可

(可以安装Vetur插件着色代码）