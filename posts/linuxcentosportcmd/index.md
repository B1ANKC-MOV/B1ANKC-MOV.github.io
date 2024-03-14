# [汇总] CentOS中查询端口&终止进程的指令

由于搭建服务器过程中，经常需要查询端口占用进程，并将进程终止以释放端口，所以将CentOS中相关的操作在这里进行一下汇总，方便以后查询使用，下文*端口有关的操作皆以8080为例*

## 端口查看

### 查看监听的端口

```shell
netstat -lntp 
```

*TCP*

```shell
netstat -antp
```

```shell
netstat -ntlp
```

*UDP*

```shell
netstat -nulp
```

<!--more-->

### 查看端口是否被占用

```shell
netstat -tunpl | grep "8080"
```

### 查看端口是否打开

```shell
firewall-cmd --zone= public --query-port=80/tcp
```
## 进程操作

### 终止进程

*强制中止进程，即发送SIGKILL信号*

```shell
kill -9 pid
```

*默认选项，发送SIGTERM信号，让进程优雅地终止*

```shell
kill -15 pid
```

## 如何查找`java -jar`中的进程

### 根据进程名`java`查看进程id

```shell
ps -ef | grep java
```

*或者使用以下指令查看占用内存等信息*

```shell
ps -aux | grep java
```

### 根据进程id查看占用端口

*如果没有netstat命令，使用 `yum -y install net-tools`安装*

```shell
netstat -nap | grep 18381
```

### 根据端口查看对应进程id

```shell
netstat -tunlp | grep 8080
```

### 根据进程id查看进程信息

```shell
ps -ef | grep 18381
```

## 端口操作

### 开放单个端口

*开放后需要重启防火墙才生效*  	***--permanent 为永久生效，不加为单次有效（重启失效）***

*开放tcp8080端口*

```shell
firewall-cmd --zone=public --add-port=8080/tcp --permanent
```

*开放udp8080端口*

```shell
firewall-cmd --zone=public --add-port=8080/udp --permanent
```

### 开放多个端口

*开放后需要要重启防火墙才生效*

```sh
firewall-cmd --zone=public --add-port=20000-29999/tcp --permanent
```

***--permanent 为永久生效，不加为单次有效（重启失效）***

### 关闭端口

*关闭后需要要重启防火墙才生效*

*关闭tcp8080端口*

```shell
firewall-cmd --zone=public --remove-port=8080/tcp --permanent
```

*关闭udp8080端口*

```shell
firewall-cmd --zone=public --remove-port=8080/udp --permanent
```

### 配置生效

*配置立即生效*

```shell
firewall-cmd --reload
```

## 防火墙操作

### 查看防火墙所有开放的端口

```shell
firewall-cmd --list-ports
```

```shell
firewall-cmd --zone=public --list-ports
```

### 查看防火墙状态

```shell
systemctl status firewalld
```

```shell
firewall-cmd --state
```

### 开启防火墙

```shell
systemctl start firewalld
```

### 关闭防火墙

*如果需要开放的端口太多，嫌麻烦，可以关闭防火墙*

```shell
systemctl stop firewalld
```

```shell
systemctl stop firewalld.service
```

### 重启防火墙

```shell
systemctl restart firewalld
```

### 设置开机启动防火墙

```shell
systemctl enable firewalld
```

### 查看防火墙开机自启是否成功

```shell
systemctl is-enabled firewalld;echo $?
```

### 禁止防火墙开机启动

```shell
systemctl disable firewalld
```

## 其他

### 查看Linux系统主机名

```shell
hostname
```

### 查看服务器IP地址

```shell
ifconfig|grep 'inet addr:'|grep -v '127.0.0.1'|cut -d: -f2|awk '{ print $1}'
```

### 查看Linux网关

```shell
route |grep default
```

### 查看Linux打开服务

```shell
chkconfig --list|grep
```

### 查看服务器DNS配置

```shell
cat /etc/resolv.conf
```

### 其他网络信息

*查看防火墙规则*

```shell
iptables -L 
```

*查看路由表*

```shell
route -n
```

*查看网络统计信息*

```shell
netstat -s
```


