# 【Java全栈学习】十八、Springboot+Vue云端环境配置(阿里云服务器环境配置)


## 云端环境准备

{{< admonition example "注意">}}

以下部署基于Centos7 系统环境

{{< /admonition >}}

<!--more-->

### 切换目录

打开XShell连接服务器后是在root目录下，切换到usr目录。

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS1.6e4z3n01k7w0.webp)

```
pwd
cd /usr/
ls

```

### 创建文件

创建文件夹`server`

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS2.5ok5103seng0.webp)

```
mkdir server
cd server/
ls

```

### 上传文件

{{< admonition example "注意">}}

文件传输使用Xftp7，下载安装很简单，一路next就行了，此文不再赘述，官网：

```http
https://www.xshell.com/zh/free-for-home-school/
```

{{< /admonition >}}

下载完Xftp7之后，点击XShell里面的新建文件传输。

把下载好的<u>**[java](https://www.oracle.com/java/technologies/downloads/#java8 )**</u>压缩包、<u>**[mysql](https://dev.mysql.com/downloads/mysql/)**</u>压缩包和<u>**[nginx](https://nginx.org/en/download.html)**</u>压缩包(nginx可以先不下)传输过去。

![mysql下载版本选择](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS4.4b8cadvvezg0.webp)

![nginx下载版本选择](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS3.6tp1dm9nhcs0.webp)

![拖拽压缩包到服务器窗口进行传输](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS5.2rpf8zdiacy0.webp)

传输完成后再次查询目录下文件，应该能查到文件了。

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS6.5ll7h8za3r80.webp)

### 卸载mariadb

查询系统中是否已有mariadb，如果有，就卸掉。

![查找mariadb](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS10.3tsc5ydn39k0.webp)

![卸载mariadb](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS7.7gxe3fkuh8c0.webp)

```
rpm -qa|grep mariadb
rpm -e mariadb-libs-5.5.60-1.el7_5.x86_64 --nodeps
rpm -qa|grep mariadb

```

### 解压mysql

创建mysql安装包存放文件夹并解压。

![创建mysql文件夹](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS8.5bornek6en40.webp)

![解压mysql](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/XS9.54ttj5m8tf80.webp)

```
mkdir mysql
tar xvf mysql-5.7.44-1.el7.x86_64.rpm-bundle.tar -C mysql
cd mysql
ls

```

### 安装mysql

先输入yum指令安装依赖

![安装mysql的依赖(环境)](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS11.5s2kfes7erg0.webp)

![安装mysql的依赖(环境)](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS12.1c0nfhzv9tog.webp)

```
yum -y install libaio
yum -y install libncurses*
yum -y install perl perl-devel

```

再输入安装指令进行安装(没有安装依赖会报错)

{{< admonition example "注意">}}

需要根据前面安装的版本**修改**一下指令里面的**版本**，这里如果不是阿里云服务器而是自己的虚拟机，需要确定已经联网。

{{< /admonition>}}

![安装mysql](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS13.47vbuhxrsi20.webp)

```
rpm -ivh mysql-community-common-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.44-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.44-1.el7.x86_64.rpm

```

### 启动mysql

输入指令启动mysql，使用cat指令拿到临时密码，随后进入root修改密码，两个set是为了使密码设置规则（大小写特殊字符之类）不那么麻烦的，也可以不输入。

![启动mysql并修改密码](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS14.2wtcr90kyj60.webp)

```
systemctl start mysqld.service
cat /var/log/mysqld.log | grep password

```

```
mysql -u root -p

```

```
set global validate password policy=0;
set global validate password length=1;
set password=password('');
```

### 开启mysql远程连接

开启远程连接权限，并设置开机自启。

![远程连接&开启自启](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS15.6rn3b007wxo0.webp)

```
grant all privileges on *.* to 'root' @'%' identified by '';
flush privileges;
exit
systemctl enable mysqld

```

{{< admonition example "注意">}}

这里如果不是阿里云服务器而是自己的虚拟机，需要再关一下防火墙，阿里云自带的防火墙在安全组里面已经关了，只需要保证把3306的端口打开就行。

{{< /admonition>}}

### 安装nginx

先更新一下样本源

![更新源](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS16.5f2nvrh3r78.webp)

```
yum install epel-release

```

{{< admonition example "注意">}}

也可以使用之前自己下载的安装包，但如果这里是更新样本源的话，刚刚上传的安装包也就没什么用了，可以不上传。

{{< /admonition>}}

接着更新一下

![yum更新](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS17.6lrhqian9sw0.webp)

```
yum update

```

{{< admonition example "注意">}}

yum过程中千万不要终止程序！千万不要终止程序！千万不要！要不然就要重装系统了，因为会有奇奇怪怪的报错，而且解决非常麻烦，不如重装。

{{< /admonition>}}

最后使用命令安装

![安装nignx](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS19.6u8c51y3rds0.webp)

```
yum -y install nginx

```

### 启动nginx

输入指令启动nginx

![启动启动启动全部启动.jpg](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS20.2kxj0mkqppy0.webp)

```
systemctl start nginx
cd ..
ls

```

### 配置JDK

输入指令解压JDK文件到server目录

![解压JDK](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS21.29nnqvzrkqf4.webp)

```
tar -zvxf jdk-8u391-linux-x64.tar.gz

```

再进入 /etc/profile 文件，在文件末尾添加两行代码。

![打开文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS22.6yo8qmybdwo0.webp)

```
ls
cd jdk1.8.0_391
ls
cd bin
ls
cd ..
vi /etc/profile

```

![编辑文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS23.416l1n0031e0.webp)

```
export JAVA_HOME=/usr/server/jdk1.8.0_391
export PATH=${JAVA_HOME}/bin:$PATH
```

{{< admonition example "注意">}}

这里一定要注意把path里面的文件路径改成你自己安装的文件路径，按<kbd>i</kbd>进入编辑状态，把代码粘进去之后，<kbd>Esc</kbd>进入command状态，然后输入``:wq``保存并退出。

{{< /admonition>}}

最后输入指令，读一下配置，试一下java命令能不能用

![配置&测试](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS24.69w26blo9ak0.webp)

```
source /etc/profile
java -version

```

### 创建mysql连接服务器

笔者是在Navicat里面创建mysql连接，主机是服务器的公网IP地址，密码和用户名是刚刚设配置数据库的时候设置的密码和用户名。

![创建数据库连接](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240115/XS25.3o53w9dx7ba0.webp)

{{< admonition example "注意">}}

如果这里连接失败了，需要检查前面mysql的远程连接有没有开启，以及安全组里面3306的端口有没有开启。

{{< /admonition>}}

## 本篇流程总结

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
yum install epel-release #更新样本源
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
export JAVA_HOME=/usr/server/jdk1.8.0_391
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

# 由于篇幅原因，打包部署项目到服务器的部分放在下一篇
