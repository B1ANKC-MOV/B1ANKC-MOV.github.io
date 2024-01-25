# 【Java全栈学习】十九、Springboot+Vue云端环境部署(阿里云服务器部署项目)


{{< admonition example "注意">}}

在部署前后端项目之前，首先需要保证nginx服务是开启的：

```shell
systemctl start nginx #开启nginx服务
```

接着将服务器的公网IP地址粘到浏览器中，如果能看见如下界面，说明nginx可以访问。(这个访问的是80端口，需要保证安全组的80端口是开启的) 

![nginx成功界面](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS1.755p8emc61c0.webp)

{{< /admonition >}}

## 项目部署

### 前端vue项目部署

#### 打包简单的vue项目

以<u>**[全栈学习·第三方组件（element-ui）](https://b1ankc-mov.github.io/posts/vuep10/)**</u>里的vue项目为例。

打开项目，在终端服务器输入

```shell
npm run build
```

将代码进行打包，打包下来的文件会放在dist目录下的index.html(只有一行是因为做了压缩)，最后需要做的就是把dist目录放在服务器上进行访问。

![打包成功的终端界面](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS2.66aa97855v40.webp)

#### 打包复杂的vue项目

以<u>**[全栈学习·vue-element-admin](https://b1ankc-mov.github.io/posts/vuep15/)**</u>里的vue项目为例。     

修改.env.production文件里面的BASE_API为服务器的公网IP地址并打包文件：

![修改API&终端打包](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS4.4ffvl6fijuy0.webp)

#### 上传vue项目dist文件

先创建一个目录放上传的项目文件

![创建文件夹](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS3.705t24hmkkw0.webp)

接着使用xftp将dist文件拖进服务器文件夹里

![传输dist文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS5.1bc8cdrey9c0.webp)

#### 配置nginx读取dist文件

进入到/etc/nginx/conf.d目录，创建vue.conf文件

![创建.conf文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS6.286s8o34zpno.webp)

![编辑.conf文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS7.554ctcz7t4g0.webp)

其中，localhost处是自己的域名，location里面的index.html是自己的首页。

接着输入指令加载配置，然后再去访问公网IP，页面就会变化(此时是登录不进去的，还没连上后台)

![使配置生效](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS8.mteiydw3z28.webp)

![页面内容变化](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS9.7756oskvjmw0.webp)

### 后端springboot项目部署

#### 新建数据库

{{< admonition example "注意">}}

如果创建不了数据库，记得重新开一下服务器的数据库。

![启动数据库](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS10.36lgma9j1pi0.webp)

如果执行sql文件导入表时出现问题，Navicat可以看这个解决方法：<u>[Navicat报错Unknown collation: ‘utf8mb4_0900_ai_ci’_](https://blog.csdn.net/weixin_54257705/article/details/132807720)</u>

{{< /admonition >}}

数据库工具上创建和依赖文件同名的数据库

![数据库](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS11.2c9shfei5se8.webp)

#### 打包发送文件

点Maven里面的package打包文件，生成jar包，并上传到服务器的/usr/app目录下

![打包成功](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS12.ej95uf8mt0w.webp)

![传输jar包](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS13.4gvh0h75aw00.webp)

#### 执行jar包

在服务器终端执行命令，加载jar包(记得修改jar包的名字变成自己的)

![启动java项目，查看日志文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS14.1k15ew7qmvk0.webp)

{{< admonition example "注意">}}

如果日志显示

```
nohup: ignoring input
no main manifest attribute, in projectName-0.0.1-SNAPSHOT.jar
```

把pom.xml文件里面的这个地方注释掉，再上传启动一次

![jar包找不到启动类解决方法](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS15.6qwls33tx3k0.webp)

(可害死我了，找了半天发现这里居然有个默认跳过的代码！)

{{< /admonition >}}

![启动成功的日志](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240116/COS16.1tgcx3qkfwjk.webp)

[笔者部署完之后无法成功登录老是neterror不知道什么情况，改天再解决一下]

## 本篇流程总结

### 部署Vue项目

#### 打包Vue项目

进入到Vue项目目录，执行

```shell
npm run build
```

将生成的dist目录上传至服务器 /usr/vue/dist

#### 配置nginx

进入到/etc/nginx/conf.d目录，创建vue.conf文件，内容如下

```
server {
    listen 80;
    server_name locahost;
    location / {
        root /usr/app/dist;
        index index.html;
    }
}
```

使配置生效

```npm
nginx -s reload
```

### 打包Java程序

双击package，会自动打包在项目路径文件夹的/target文件夹下

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Java.5n1e67d27700.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Java2.64vdj17krvg.webp)

因为springboot有内置tomcat容器，这点比较方便，省去了tomcat的部署。我们到时候直接可以直接把jar包扔到linux上。

```shell
nohup java -jar projectName-0.0.1-SNAPSHOT.jar > logName.log 2>&1 &
```


