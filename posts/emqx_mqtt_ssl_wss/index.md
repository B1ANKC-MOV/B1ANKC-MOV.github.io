# [MQTT]服务器EMQX搭建SSL/TLS连接过程（wss://)


{{< admonition example "注意">}}

本文采用**8084端口**进行连接，是EMQX 默认提供了四个常用的监听器之一，如果需要添加其他类型的监听器，可参考官方文档🔗[管理 | EMQX 文档](https://www.emqx.io/docs/zh/latest/dashboard/configuration.html#管理)。

本文使用**自签名CA**，需要提前在Linux系统上安装🔗[OpenSSL](https://www.openssl.org/)，具体安装教程请自行搜索。

本文采用**SSL/TLS连接**，需要提前在EMQX上启用，可参考🔗[开启 SSL/TLS 连接| EMQX 文档](https://www.emqx.io/docs/zh/latest/network/emqx-mqtt-tls.html#开启-ssl-tls-连接)

{{< /admonition >}}

## 使用OpenSSL获取证书

### CA文件

1. 打开**Linux系统**终端操作窗口，输入以下指令，查看**OpenSSL是否安装**，如果有，则会显示版本信息。

```shell
openssl version
```

2. 生成私钥：`my_root_ca.key`

```shell
openssl genrsa -out my_root_ca.key 2048
```

3. 使用该密钥生成根（CA）证书：`my_root_ca.pem`

```shell
openssl req -x509 -new -nodes -key my_root_ca.key -sha256 -days 3650 -out my_root_ca.pem
```

系统会提示以下信息，对应含义如下（根据下面的内容填就可以了，#后面的不需要填）：

```bash
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]: CN# 国家/地区
State or Province Name (full name) [Some-State]:Zhejiang # 省/市
Locality Name (eg, city) []:Hangzhou # 城市
Organization Name (eg, company) [Internet Widgits Pty Ltd]:EMQX # 组织机构（或公司名），如 EMQ
Organizational Unit Name (eg, section) []:EMQX # 机构部门，如 EMQX
Common Name (e.g. server FQDN or YOUR name) []:none # 通用名称，此处应当设置为服务器域名如 mqtt.emqx.com
...
```

<!--more-->

### Server文件

1. 生成EMQX（服务器）端的私钥：`emqx.key`

```shell
openssl genrsa -out emqx.key 2048
```

2. 使用 `vi`命令创**建配置文件：`openssl.cnf`**

```shell
vi openssl.cnf
```

文件内容如下，**`BROKER_ADDRESS` 修改为 EMQX 服务器实际的 IP 或 DNS 地址**      

例如：IP.1 = 127.0.0.1，或 DNS.1 = broker.xxx.com（可以只填IP，把域名DNS那一行删掉）    

```makefile
[req]
default_bits  = 2048
distinguished_name = req_distinguished_name
req_extensions = req_ext
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
countryName = CN
stateOrProvinceName = Zhejiang
localityName = Hangzhou
organizationName = EMQX
commonName = Server certificate
[req_ext]
subjectAltName = @alt_names
[v3_req]
subjectAltName = @alt_names
[alt_names]
IP.1 = BROKER_ADDRESS
DNS.1 = BROKER_ADDRESS
```

​		最后<kbd>Esc</kbd>+`:wq` **保存并退出**。

3. 使用上面的密钥和配置文件签发证书请求：`emqx.csr`

```shell
openssl req -new -key ./emqx.key -config openssl.cnf -out emqx.csr
```

4. 使用请求文件、CA密钥、配置文件，以根证书签发EMQX实体证书：`emqx.pem`

```shell
openssl x509 -req -in ./emqx.csr -CA my_root_ca.pem -CAkey my_root_ca.key -CAcreateserial -out emqx.pem -days 3650 -sha256 -extensions v3_req -extfile openssl.cnf
```

{{< admonition tip 贴士 >}}

​		**准备好Server文件（EMQX证书）后，就可以启用EMQX<u>单向认证</u>的SSL/TLS连接功能了**

如果需要**双向认证**或**客户端证书和客户端Key文件**，用来满足配置nginx等需求的，请<u>继续配置Client文件↓</u>

{{< /admonition>}}

-----

### Client文件

这一部分原理和内容跟配置Server文件一样，不赘述了，直接放步骤。

1. 生成client.key

```shell
openssl genrsa -out client.key 2048
```

2. 生成client.csr

```shell
openssl req -new -key ./client.key -config openssl.cnf -out client.csr
```

3. 生成client.pem

```shell
openssl x509 -req -in ./client.csr -CA my_root_ca.pem -CAkey my_root_ca.key -CAcreateserial -out client.pem -days 3650 -sha256 -extensions v3_req -extfile openssl.cnf
```

-----

## 登录EMQX平台配置服务器

1. 将前文中通过OpenSSL工具生成的 `emqx.pem`、`emqx.key` 及 `my_root_ca.pem` 文件拷贝到 EMQX 的 `etc/certs/` 目录下，并参考如下配置修改 `emqx.conf`：

```shell
## listener.ssl.$name is the IP address and port that the MQTT/SSL
## Value: IP:Port | Port
listener.ssl.external = 8084

## Path to the file containing the user's private PEM-encoded key.
## Value: File
listener.ssl.external.keyfile = etc/certs/emqx.key

## Path to a file containing the user certificate.
## Value: File
listener.ssl.external.certfile = etc/certs/emqx.pem

## Path to the file containing PEM-encoded CA certificates. The CA certificates
## Value: File
listener.ssl.external.cacertfile = etc/certs/my_root_ca.pem
```

博主8084端口部分修改之后是这样的↓

![emqx配置文件修改后代码参考](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418111945111.7i06bavt1d.webp)

2. 打开 Dashboard，点击**管理** -> **监听器**进入监听器管理页面

打开8084端口配置界面，重新设置**TLS Cert**，**TLS Key**和**CA Cert**，分别对应上传`emqx.pem`，`emqx.key`，`my_root_ca.pem`文件

{{< admonition example "注意">}}

- **这里类型两个字下面框里的内容要提前设置成wss要不然SSL/TLS连接没法用**

- 另外SSL版本最好是这样![官方文档建议添加的SSL版本](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418111257697.7p3e6qkn6j.webp)

这些章前的参考文档都说明了，这里再提醒一下，其他设置基本默认，出问题回去看官方文档

{{</ admonition>}}

3. **重启EMQX服务器**

```shell
emqx restart
```

## 使用MQTTX客户端测试连接

MQTTX官网🔗:[MQTTX：全功能 MQTT 客户端工具](https://mqttx.app/zh)

官方安装文档🔗:[安装 - MQTTX 文档](https://mqttx.app/zh/docs/downloading-and-installation)

官方使用文档🔗:[MQTT 客户端工具演示 | EMQX 文档](https://www.emqx.io/docs/zh/latest/messaging/publish-and-subscribe.html#mqtt-客户端工具演示)

### 单向认证的SSL/TLS连接

1. 打开MQTTX客户端，添加连接，填写信息：

   名称随便填，Client ID随机

   服务器地址选择wss://，后面填IP地址，端口8084

   **SSL安全按钮关闭**

   证书类型选择CA or Self signed certificates，在CA文件处上传根（CA）证书即可，客户端证书和客户端key文件两栏不填

   MQTT版本3.1.1

![单向认证连接设置](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/SSL1.13lkfphn42.webp)

![单向认证连接设置](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418114235083.esavovbcr.webp)

2. 点击连接按钮，连接成功

![单向认证连接成功](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418114606497.4n7i5imejz.webp)

3. 发送测试消息，发送成功

![单向认证测试消息发送成功](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418114703481.lvir4j98h.webp)

4. 参考官方使用文档的步骤🔗[MQTT 客户端工具演示 | EMQX 文档](https://www.emqx.io/docs/zh/latest/messaging/publish-and-subscribe.html#mqttx-desktop)，创建另一个连接作为消息接受客户端（配置与之前相同），添加订阅，在Topic中输入test

   接着在原来的EMQX_SSL_TEST连接重新发送test消息，客户端会收到新消息

![单向认证订阅消息测试成功](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/image-20240418115101333.7ljs90w6f9.webp)

### 双向认证的SSL/TLS连接

除了**SSL安全按钮启动**和填入客户端证书、key文件之外，与单向认证没有什么区别，具体看图：

![双向认证连接设置](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/20240418/SSL2.8vmpfcaloh.webp)

至此，**所有测试连接成功**√，你会在EMQX监听器上看见连接数增加。

> 参考文章链接：
>
> 1. *[EMQ X MQTT 服务器启用 SSL/TLS 安全连接](https://www.cnblogs.com/emqx/p/13293166.html)*
> 2. *[开启 SSL/TLS 连接 | EMQX 文档](https://www.emqx.io/docs/zh/latest/network/emqx-mqtt-tls.html#开启-ssl-tls-连接)*
> 3. *[获取 SSL/TLS 证书 | EMQX 文档](https://www.emqx.io/docs/zh/latest/network/tls-certificate.html)*
> 4. *[MQTT 客户端工具演示 | EMQX 文档](https://www.emqx.io/docs/zh/latest/messaging/publish-and-subscribe.html#mqttx-desktop)*
> 5. *[管理 | EMQX 文档](https://www.emqx.io/docs/zh/latest/dashboard/configuration.html#管理)*
