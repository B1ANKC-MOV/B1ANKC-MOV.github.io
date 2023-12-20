+++
title = '全栈学习·SpringBoot介绍/特点/创建/结构&热部署'
date = 2023-11-30T14:30:35+08:00
draft = false
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

tags = ["个人学习","后端"]
categories = ["SpringBoot+Vue全栈开发"]
+++
## SpringBoot快速上手
### Springboot的介绍 
**Springboot**旨在简化**SSM**（Spring\SpringMVC\Mybatis）的配置过程

### Springboot的特点
之所以能够简化操作，Springboot做到了：
 1. **约定优于配置”** ，用大量的默认配置代替手动配置的过程
 2. 使用内嵌的**Tomcat**，用户无需再手动打包**war**文件让服务器使用
 3. 定制**Staters**启动器，简化了**Maven**配置（帮你配置好了,简化以前可能需要写几十个依赖的情况,现在写一两个即可）
 4. 使用**纯Java**配置
 5. 后续维护时，Springboot提供了各种监控检测功能

（如若需要开发复杂项目还需继续学习Spring【不过Springboot完全够用了，除非是接口几千个的大项目，可能要考虑到后续并发量之类的问题，Springboot作为一个比较单体的东西，可能确实是不太应付得来】）
### 创建Springboot应用
(IDEA2020.3)
#### 创建

1. Group处一般输入公司域名
2. Artifact处输入项目名称
3. SDK:1.8
4. Java version:8【SDK17选择Java 17也无大碍】
5. Web→Spring Web
6. 选择存放位置
7. 右下角会显示下载依赖的进度条，如果持续太久了可能是下面的配置路径出了问题（需要修改过阿里云镜像，要不然就很慢） **Settings→Build,Execution,Deployment→Build Tools→Maven**

#### 基本结构（基于maven）

* 代码位于**src**下的**java**目录
* **resources**下放置一些**资源**（系统会自动放一些文件夹和配置目录）
* **static**放置网站的**静态资源**
* **templates**放置网站的**html**之类的**模板**
* **application.properties**为重要的**配置文件**（但springboot无需配置）
* test为java的测试
* **pom.xml**
	+ parent标签，可以认为是一个副级的项目，我们现在就是依赖于这个项目，不需要多做配置
	+ dependencies，一些依赖包
* main→java→com.example.xxx是主包，后续我们要写什么都需要放进主包
* 启动程序为主包下的xxxApplication类

#### 操作
1. 在主包下创建controller包，创建**xxxController**类 

2. 在类中做**@RestController**标记以让此类变为控制器，可以接收客户端的请求

3. 具体如何接收需要在类中加入public方法，返回类型为String：
 ``` 	 pubilic String xxx(){ return "hello world";}     ```
期望为浏览器访问后端时，能够看到此字符串

4. 加入一个注解：**@GetMapping("/xxx")**
    效果为浏览器可以发送http里的get请求来访问xxx()方法，具体访问方法时需要明确的链接地址：/xxx

5. 浏览器如何访问？浏览器会固定使用"http"的协议，后加一个域名，再往后是具体路径/path:``` http://localhost:8080/path ```,上面的/xxx就是此处的路径，这样就可以访问刚刚写的方法（默认localhost:80，但80是可以省略的，一般访问本地主机就写成localhost，但是Tomcat访问的是8080端口，所以需要写成localhost:8080)。

**全部代码如下**

*创建**Controller**包，包下创建**HelloController**类*

```
@RestController
public class HelloController {

//    →地址栏可以通过问号传参http://localhost:8080/hello?nickname=zhangsan
//    ↓等价于@RequestMapping(value = "/hello",method= RequestMethod.GET)
    @GetMapping("/hello")
    public String hello(String nickname,String phone){
        System.out.println(phone);
        return "HELLO,WORLD(｡･∀･)ﾉﾞ！"+nickname;
    }
}
```
#### 启动
1. 找到xxxApplication启动类，启动程序
2. 会在启动台里看见Springboot的标志
3. 在浏览器输入localhost:8080/xxx
4. 修改一定要重启项目（可以通过热部署解决）
## 开发环境热部署
- 在pom.xml中加入依赖
 ```
 <dependency>
 	<groupId>org.springframework.boot</groupId>
 	<artifactId>spring-boot-starter-web</artifactId>
 </dependency>
 ```
- 点击右上角的按钮，下载依赖
- 在application.properties配置devtools
```
spring.devtools.restart.enabled=true
spring.devtools.restart.additional-paths=src/main/java
```
- 打开Settings页面，在左边的菜单栏依次找到Build,Execution,Deployment一Compile，勾选
  - [x] **Build project automatically**
- 按<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>/</kbd>快捷键调出Maintenance页面，单击Registry，勾选
  - [x] **compiler,automake.allow,when.app.running**
- (IDEA2021版本的设置在**Settings→Advanced Settings→Comiler**里面)
