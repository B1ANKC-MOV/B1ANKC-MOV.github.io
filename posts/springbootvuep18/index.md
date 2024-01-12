# 全栈学习·阿里云服务器的配置&搭建&购买&使用


## 云服务器介绍

### 云服务器概念

- 云服务器(Elastic Compute Service, ECS)是一种简单高效、安全可靠、处理能力可弹性伸缩的计算服务。其管理方式比物理服务器更简单高效。
- 用户无需提前购买硬件，即可迅速创建或释放任意多台云服务器。

![物理服务器vs云服务器](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/cloud.54ennbdcvg00.webp)

### 云服务器的特点

1. ECS的最重要的特点是弹性，支持垂直和水平扩展两种能力。

![ECS的特点](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/cloudECS.4xfvaawgsa80.webp)

2. ECS一般提供自动宕机迁移、数据备份和回滚、系统性能报警等功能，稳定性更高

![传统服务器的缺点](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS.51qy710ju400.webp)

## 阿里云ECS的使用

{{< admonition example "注意">}}

服务器部署仅适合此系列项目演示使用，首次注册倾向于使用支付宝扫码，账户需要预存100￥才能购买服务器。

{{< /admonition >}}

### 进入官网

```
https://www.aliyun.com/
```

### 点击菜单栏中的[产品]，选择[计算]分类，选择云服务器ECS

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS1.2eqzzhs7hou8.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS2.55ys4n801hk0.webp)

### 选择按量付费，地域随意，网络及可用区随意

{{< admonition example "注意">}}

此为旧版购买网页，新版购买方式可以查看官方文档：

```
https://help.aliyun.com/zh/ecs/getting-started/create-and-manage-an-ecs-instance-by-using-the-ecs-console
```

{{< /admonition >}}

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS5.42y6x9wtkm40.webp)

### 选择架构[X86计算]，在下拉列表里面选择[共享型]，vCPU选1核及以上的，内存选1GiB及以上的

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS6.6f7rpq05i0w0.webp)

### 选择[公共镜像]里的[CentOS]，在下拉列表里面选择7.6版

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS7.3hlkyoyv1oo0.webp)

### 选择ESSD云盘，容量默认40GiB，可以自行添加容量与数据盘

{{< admonition example "注意">}}

目前默认的高效云盘要比ESSD云盘差些。

{{< /admonition >}}

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS8.569ii2b8r2o0.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS9.77xu73ytgcw0.webp)

### 网络配置全部默认，公网IP处勾选[分配公网IPv4地址]，[按使用流量]，带宽峰值默认为[5Mbps]

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS10.14lm6xveo200.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS11.63qm4w44lgc0.webp)

### 网卡交换机选择默认

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS13.39s67680s280.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS14.2zh27j93qpg0.webp)

### 选择[自定义密码]，设置密码，实例名称等默认，点击[确认订单]

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS15.5gi5vgv8ljk0.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/ECS12.4cc0sybg1k00.webp)

### 可以在使用时限里面勾选[设置自动释放服务时间]，设置个一两天的节点，要不然会一直扣钱的。

## 远程链接（XShell）

### 进入云服务器ECS管理台

```
https://ecs.console.aliyun.com/server/region
```

### 查看安全组，点进安全组

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link1.3t2u34snjyc0.webp)

### 将入方向的22端口开启

{{< admonition example "注意">}}

如果后续在服务器里面安装了数据库，或是要提供Web服务，那么对应的80端口和443端口也要打开。MySQL则需要打开3306端口。

{{< /admonition >}}

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link2.748pr9pnaz40.webp)

### 使用XShell远程连接服务器

{{< admonition info >}}

XShell安装比较简单，一直下一步即可，这里就不再详写了，免费版官网地址：

```
https://www.xshell.com/zh/free-for-home-school/
```

{{< /admonition >}}

打开XShell后新建会话

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link3.1mnks98krp28.webp)

### 输入服务器公网IP

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link4.7abb00x4ags0.webp)

### 连接服务器，输入服务器账号密码

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link5.5hg8caxbwnw0.webp)

### 连接服务器，不想每次都输入密码的可以点击接受并保存主机密钥

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link6.2iwke3gaxx80.webp)

![ ](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240112/Link7.dya51rwpc00.webp)
