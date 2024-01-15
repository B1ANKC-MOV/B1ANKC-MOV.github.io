# 全栈学习·Springboot+Vue云端环境部署(阿里云服务器部署项目)


## 项目部署

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
nohup java -jar shop-0.0.1-SNAPSHOT.jar > logName.log 2>&1 &
```
