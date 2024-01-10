# 全栈学习·Axios网络请求


## Axios的使用
### Axios简介
使用背景：在实际项目开发中，前端页面所需要的数据往往需要从服务器端获取，这必然涉及与服务器的通信。
Axios主要是前端的一个网络请求框架，大部分基于***Ajax***
- Axios基于**promise**网络请求库，作用与node.js和浏览器中。
- Axios在浏览器端使用XMLHttpRequests发送网络请求，并能自动完成**JSON**数据的转换。
- 地址
```
https://www.axios-http.cn/
```

### Axios的安装和导入
- 安装：输入
```
npm install axios
```

- 导入：在文件开头输入
```
import axios from 'axios'
```

### Axios发送请求的方式
这可以与Springboot的GetMapping对应
#### 发送GET请求（通过url传参）
示例代码如下：
```html
//向给定ID的用户发起请求
axios.get('/user?ID=12345')
.then(function(response){
	//若处理成功
	console.log(response);
})
.catch(function(error){
	//若处理失败
	console.log(error);
})
.then(function(){
	//总是执行
});
```
```html
//上述请求也可以按以下方式完成
axios.get('/user',{
	params:{
		ID:12345
	}
})
.then(function(response){
	//若处理成功
	console.log(response);
})
.catch(function(error){
	//若处理失败
	console.log(error);
})
.then(function(){
	//总是执行
});
```
关于上述代码：
1. 如果请求成功，系统会调用.then()；如果请求失败或出现错误，则会调用.catch()。
2. .then()与.catch()就是promise相关的语法。
3. .then()内需要传入一个回调函数（function(response)），.catch()也需要传入一个回调函数（function(error)），这些都是自定义的函数。
4. get请求如果想给后端传递数据，可以通过```? String```的方式传参（Springboot的时候说过）；如果参数较多，可以通过params（在后面再传一个参，参数是对象，对象内可以放多种配置）传参。
5. 最后可以加一个.then()方法，不论成功或失败都执行该方法。
#### 发送POST请求（通过请求体传参）
示例代码如下：
```html
axios.post('/user',{
	firstName:'Fred',
	lastName:'Flintstone'
})
.then(function(response){
	console.log(response);
})
.catch(function(error){
	console.log(error);
})
```
关于上述代码：
用{}括起来，就会放在请求体内传参，而且需要注意的是：*Axois会自动把请求体里面的数据转为JSON格式传送给后端。*后端处理POST请求时，需要注意它是**JSON**的格式，作*特殊的处理*。

#### 异步回调问题
```html
//async/await的用法
async function getUser(){
	try{
		const response = await axios.get('/user?ID=12345');
		console.log(response);
	}catch(error){
		console.log(error);
	}
}
```

- JavaScript最新的标准里面，有async和await的语法结构。
- 前面GET和POST都涉及了异步回调获取数据的形式，如果需要同步获取数据，则可以通过前面加一个async（方法内必须有配对的await）实现。
- 当**方法前面加了async**之后，发送**异步请求的前面就可以加上await**，**无需再添加回调函数**（即.then()），直接拿到响应，以**同步**的形式取代异步的编程。
- 不过*常用的还是加回调函数*的方式。

#### 其他请求方式
参考：
```
https://axios-http.com/zh/docs/req_config
```
更详细的配置项可以去官网文档查询。
## 与Vue整合
1. axios不能直接写在```<script>```标签内，因为网络请求下来的数据最终还是要交给*data*的。
2. 目前虽然data中的电影信息是我们自己写的，但这些数据本应该是从数据库中查询出来交给前端的，最终再放在data里面去。
3. 因为这个请求最终需要交给data，所以axios需要写在vue范围内（即export default{}内）。
4. Vue内部提供的一些**生命周期的函数**，即对于我们现在的组件App.vue来讲，从创建到加载、渲染、销毁，每一个阶段会有对应的函数。[例如：该组件在程序运行时会被创建，接下来加载到界面（绑定/挂载到界面），当页面切换了（即切换到其他组件上了），该组件就会被销毁]
5. 其中，**created要和data平级**（不能放在methods:里面，这里面放的是自定义的函数），当组件被创建的时候，created:function()会被自动调用。
6. 还有一个类似的方法叫mounted，这个方法作用时间会稍微迟一点，被挂载（渲染到界面上）的时候调用。（其他的方法/生命周期可以在vue.js官网上查看。）
示例代码如下：

```html
......
<script>
import Movie from './compents/Movie.vue'
import Hello from './compents/Hello.vue'
import axios from 'axios'

export default{
	name:'App',
    data:function(){
        return{
            movies:[
                {id:1,title:"金刚狼1",rating:8.7},
                {id:1,title:"金刚狼2",rating:8.8},
                {id:1,title:"金刚狼3",rating:8.6},
            ]
        }
    },
      created:function(){
        console.log("App组件被创建了")
      },
      mounted:function(){
        console.log("App被挂载完毕")
      },
    components:{
        Movie,
        Hello
    }
}
</script>
......
```

## 跨域
### 和后端进行关联
1. 首先，需要修改后端启动的端口：server.port=8088，再启动。
2. 在created:function(){}里面写的axois.get("")，它这个链接的发送需要有一个后端的接口。（比如说，想要控制器查询所有的用户，url访问其中的一个控制器，localhost:8088/user/findAll，就能看见所有的数据。）（TIPS：一般来说如果要查看问题，可以在*网页处右键→检查→network*）
3. 所以axois.get("")里面写↓
```html
axios.get("http://localhost:8088/user/findAll").then(function(response){console.log(response)})
```
4. 该处get请求一经发送，正好对应后端的@GetMapping，于是就拿到数据。（注意，虽然created先执行，但是里面的console.log()是异步回调函数，所以输出的文本先后并不代表方法调用的先后）

<u>***但是！还是会失败并报错的！***</u>
 **这是跨域问题引起的**↓

 ### 跨域问题
#### 为什么会出现跨域问题
- 为了保证浏览器的安全,不同源的客户端脚本在没有明确授权的情况下，不能读写对方资源，称为同源策略,同源策略是浏览器安全的基石
- 同源策略(Sameoriginpolicy) 是一种约定，它是浏览器最核心也最基本的安全功能
- 所谓同源(即指在同一个域)就是两个页面具有相同的协议(protocol) ，主机(host) 和端口号(port)
- 当一个请求url的协议、 域名、端口三者之间任意-个与当前页面url不同即为跨域，此时无法读取非同源网页的Cookie,无法向非同源地址发送AJAX请求
#### 跨域问题解决
- CORS (Cross-Origin Resource Sharing)是由W3C制定的一种跨域资源共享技术标准，其目的就是为了解决前端的跨域请求。
- CORS可以在不破坏即有规则的情况下，通过后端服务器实现CORS接口,从而实现跨域通信。
- CORS将请求分为两类：简单请求和非简单请求，分别对跨域通信提供了支持。
##### 简单请求的服务器处理
- 对于简单请求，CORS的策略是请求时在请求头中增加一个Origin字段
```http
Host:localhost:8080
Origin:http://localhost:8081
Referer:http://localhost:8081/index.html
```

- 服务器收到请求后， 根据该字段判断是否允许该请求访问，如果允许，则在HTTP头信息中添加Access-Control- Allw-Origin字段。
``` http
Access-Control-Allow-Origin:http://localhost:8081
Content-Length:20
Content-Type:text/plain;charset=UTF-8
Date:Thu,12 Jul 2018 12:51:14 GMT
```
##### 非简单请求
1. 对于非简单请求的跨源请求，浏览器会在真实请求发出前增加一次OPTION请求，称为预检请求(preflight request)
2. 预检请求将真实请求的信息，包括请求方法、自定义头字段、源信息添加到HTTP头信息字段中，询问服务器是否允许这样的操作。
3. 例如一个GET请求:
```http
OPTIONS/test HTTP/1.1
origin:http://ww.test.com
Access-Control-Request-Method:GET
Access-Control-Request-Headers:X-Custom-Header
Host:www.test.com
```
4. Access-Control-Request-Method表示请求使用的HTTP方法，Access-Control-Request-Headers包含请求的自定义头字段
5. 服务器收到请求时，需要分别对Origin、 Access-Control-Request-Method、Access-Control-Request-Headers进行验证，验证通过后，会在返回HTTP头信息中添加:
```http
Access-Control-Allow-Origin: http://www.test.com
Access-Control-Allow-Methods: GET,POST,PUT,DELETE
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials:true
Access-Control-Max-Age: 1728000
```
- Access-Control-Allow-Methods、Access -Control-Allow-Headers:真实请求允许的方法、允许使用的字段
- Accss-Control-Allow-Credentials: 是否允许用户发送、处理cookie
- Access-Control-Max-Age:预检请求的有效期，单位为秒，有效期内不会重新发送预检请求。
##### Spring Boot中配置CORS
在传统的Java EE开发中，可以通过过滤器统一配置, 而Spring Boot中对此则提供了更加简洁的解决方案：
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")//允许跨域访问的路径
                .allowedOrigins("*")//允许跨域访问的源
                .allowedMethods("POST", "GET", "PUT", "OPTIONS", "DELETE")//允许请求方法
                .maxAge(168000)//预检间隔时间
                .allowedHeaders("*") //允许头部设置
                .allowCredentials(true);//是否发送cookie
    }
}
```
### 跨域问题解决方法
1. 在控制器之前加注解@CrossOrigin，使得控制器里面所有的方法都允许被跨域。要么就加一个配置类，使得所有的控制器都能被跨域。（加完之后重启服务器）
2. 拿到以后渲染到界面上：赋值给data，把response.data取出来，显示到表格里面。直接this.tableData = response.data就可以了。
3. 解决回调函数this作用域的限制：改写.成then(response)=>{}
4. 每个组件都要导入axios，以及写相同的域名localhost:8088，可以抽出来进行整合。（在main.js里面做一个统一的导入）
#### 与Vue整合
- 在实际项目开发中，几乎每个组件中都会用到axios发起数据请求。此时会遇到如下两个问题:
- 每个组件中都需要导入axios
- 每次发请求都需要填写完整的请求路径
- 可以通过全局配置的方式解决上述问题(写入main.js):
```json
//配置请求根路径
axios.defaults.baseURL = 'http://localhost:8088'
//将axios 作为全局的自定义属性，每个组件可以在内部直接访问(Vue3)
app.config.globalProperties.$http = axios
//将axios 作为全局的自定义属性，每个组件可以在内部直接访间(Vue2)←
Vue.prototype.$http = axios
```

