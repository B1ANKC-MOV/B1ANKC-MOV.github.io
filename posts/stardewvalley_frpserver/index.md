# [服务器搭建] 利用Frp内网穿透搭建星露谷服务器局域网的过程

{{< admonition example "注意">}}

服务器端操作系统为`CentOS 7.6 64位`（阿里云服务器）***需要提前在安全组放行端口7000与24642（TCP&UDP）***，客户端操作系统为`Windows 10 64位`，可视化工具与文件传输工具使用`XShell`与`Xftp`

{{< /admonition >}}



购买服务器和XShell连接服务器的操作在

***[Springboot+Vue云端环境配置（上）](https://b1ankc-mov.github.io/posts/springbootvuep19/)***

***[Springboot+Vue云端环境部署（下）](https://b1ankc-mov.github.io/posts/springbootvuep20/)***

里面详细介绍过，就不再赘述了，有需要可以去翻看一下。

<!--more-->

## 配置Frps（CentOS服务器端）

在GitHub中下载适合自己的frp版本，需要注意的是，我下载的是`frp_0.35.0_windows_386.zip`和`frp_0.35.0_linux_386.tar.gz`，并非最新的版本。

下载地址：

```http
https://github.com/fatedier/frp/releases
```

下载完成后，使用Xftp将服务器打开，直接将Linux版本的压缩包拖到root目录下。

![将压缩包放在根目录下](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp1.2vehwpa2md.webp)

接着在终端中输入指令解压压缩包

```shell
tar -zxvf frp_0.35.0_linux_386.tar.gz
```

右键刷新后就能在Xfrp中看见解压好的文件夹了

接着在终端中打开文件夹

```shell
cd frp_0.35.0_linux_386
```

输入命令，运行Frps（Frp Server），也就是服务器端

```shell
./frps -c frps.ini
```

![运行成功后的终端窗口](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp3.2ruvyzgzwn.webp)

## 配置Frpc（Win10客户端）

将下载好的Windows版本的压缩包解压，然后记事本编辑`frpc.ini`文件，将里面的内容替换如下

```ini
[common]
server_addr = 114.55.101.34 #这里是你服务器的公网IP
server_port = 7000

[stardew valley TCP]
type = tcp
local_ip = 127.0.0.1
local_port = 24642
remote_port = 24642

[stardew valley UDP]
type = udp
local_ip = 127.0.0.1
local_port = 24642
remote_port = 24642
```

![配置frpc.ini](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp2.1754zijsg6.webp)

然后在文件夹空白处按下<kbd>shift</kbd>+右键，选择***在此处打开Powershell***

![打开Powershell](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp4.4uaon218yv.webp)

在PS终端窗口中输入指令启动Frpc（Frp Client），也就是客户端

```shell
./frpc -c frpc.ini
```

![启动成功后的PS窗口](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp5.9dcpq0l1w1.webp)

相应的，XShell窗口里也会出现客户端连接成功的代码

![启动成功后的XShell窗口](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp6.2dog848p21.webp)

## 星露谷连接

打开星露谷游戏，选择[合作]

![进入合作模式](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp7.4qr2pbmi8p.webp)

接着选择[加入局域网游戏...]

![加入](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp8.1zi0h90e6y.webp)

最后输入你的服务器IP地址和游戏端口（例如127.0.0.1:24642）就可以进行联机啦

![连接](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/frp9.6pn9fns0kb.webp)

> 参考文章链接：
>
> 1. *[用阿里云和frp内网穿透搭建星露谷服务器](https://www.jianshu.com/p/1437fb670ebf)*
> 2. *[使用frp在Linux上实现星露谷远程联机的简易教程](https://blog.csdn.net/weixin_63783406/article/details/131693258)*
