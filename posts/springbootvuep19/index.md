# 全站学习·Springboot+Vue云端环境配置(阿里云服务器环境配置)


## 云端环境准备

{{< admonition example "注意">}}

以下部署基于Centos7 系统环境

{{< /admonition >}}

### 安装MySQL

#### 卸载Centos7自带mariadb

```shell
# 查找
rpm -qa|grep mariadb
# mariadb-libs-5.5.52-1.el7.x86_64
# 卸载
rpm -e mariadb-libs-5.5.52-1.el7.x86_64 --nodeps
```

#### 解压mysql

```shell
# 创建mysql安装包存放点
mkdir /usr/server/mysql
# 解压
tar xvf mysql-5.7.34-1.el7.x86_64.rpm-bundle.tar 
```

#### 执行安装

```shell
# 切换到安装目录
cd /usr/server/mysql/
yum -y install libaio
yum -y install libncurses*
yum -y install perl perl-devel
# 安装
rpm -ivh mysql-community-common-5.7.34-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.34-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.34-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.34-1.el7.x86_64.rpm
```

#### 启动Mysql

```shell
#启动mysql
systemctl start mysqld.service
#查看生成的临时root密码
cat /var/log/mysqld.log | grep password
```

![mysql初始随机密码](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/mysql.4pj7jo99xna0.webp)

#### 修改初始的随机密码

```shell
# 登录mysql
mysql -u root -p
Enter password: #输入在日志中生成的临时密码
# 更新root密码 设置为root
set global validate_password_policy=0;
set global validate_password_length=1;
set password=password('root');
```

#### 授予远程连接权限

```shell
grant all privileges on *.* to 'root' @'%' identified by 'root';
# 刷新
flush privileges;
```

#### 控制命令

```shell
#mysql的启动和关闭 状态查看
systemctl stop mysqld
systemctl status mysqld
systemctl start mysqld
#建议设置为开机自启动服务
systemctl enable mysqld
#查看是否已经设置自启动成功
systemctl list-unit-files | grep mysqld
```

#### 关闭防火墙

```shell
firewall-cmd --state #查看防火墙状态
systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
```

### 安装nginx

#### 安装命令

```shell
yum install epel-release
yum update
yum -y install nginx
```

#### nginx命令

```shell
systemctl start nginx #开启nginx服务
systemctl stop nginx #停止nginx服务
systemctl restart nginx #重启nginx服务
```

### 配置JDK

#### 官网下载

下载JDK，登录官网下载所需版本的JDK，版本为JDK 1.8

```
https://www.oracle.com/java/technologies/downloads/#java8 
```

![JDK1.8](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/JDK.48fbf6y77vg0.webp)

#### 解压

```shell
tar -zvxf jdk-8u131-linux-x64.tar.gz
```

#### 编辑 /etc/profile 文件

```shell
vi /etc/profile
# 文件末尾增加
export JAVA_HOME=/usr/server/jdk1.8.0_131
export PATH=${JAVA_HOME}/bin:$PATH
```

#### 执行source命令，使配置立即生效

```shell
source /etc/profile
```

#### 检查是否安装成功

```shell
java -version
```

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

## 实操

### 切换目录

打开XShell连接服务器后是在root目录下，切换到usr目录。

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS1.6e4z3n01k7w0.webp)

### 创建文件

创建文件夹`server`

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS2.5ok5103seng0.webp)

### 上传文件

{{< admonition example "注意">}}

文件传输使用Xftp7，下载安装很简单，一路next就行了，此文不再赘述，官网：

```
https://www.xshell.com/zh/free-for-home-school/
```

{{< /admonition >}}

下载完Xftp7之后，点击XShell里面的新建文件传输。

把下载好的[java](https://www.oracle.com/java/technologies/downloads/#java8 )压缩包、[mysql]([MySQL :: Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/))压缩包和[nginx]()压缩包传输过去。

![mysql下载版本选择](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS4.4b8cadvvezg0.webp)

![ngins下载版本选择](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS3.6tp1dm9nhcs0.webp)

![拖拽压缩包到服务器窗口进行传输](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS5.2rpf8zdiacy0.webp)

传输完成后再次查询目录下文件，应该能查到文件了。

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS6.5ll7h8za3r80.webp)

### 卸载mariadb

查询系统中是否已有mariadb，如果有，就卸掉。

![查找amriadb](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS10.3tsc5ydn39k0.webp)

![卸载amriadb](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS7.7gxe3fkuh8c0.webp)

### 解压mysql

创建mysql安装包存放文件夹并解压。

![创建mysql文件夹](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS8.5bornek6en40.webp)

![解压mysql](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS9.54ttj5m8tf80.webp)
