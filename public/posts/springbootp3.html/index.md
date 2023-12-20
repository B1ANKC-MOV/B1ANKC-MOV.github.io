# 全栈学习·Springboot控制器/映射/前端传参&APIPOST的应用


## Web入门
1. Spring Web提供了启动器starter，主要包含了三个组件：mvc、json、tomcat。
2. webmvc组件主要提供web开发的注解（类似于控制器的注解）是web开发的基础框架
3. json组件主要提供了JSON数据的解析，使能够接收前端发送数据并返回
4. Tomcat为自带的容器依赖
## 控制器
### 控制器介绍
- **mvc**为后端开发的一种模式：m为**Model**，用于存储收发数据；c为**Controller**，用于**协调控制**；v为**View(视图)**，是用来显示数据的。

- 在**mvc模式**下，从数据库中加载的数据首先被**封装在Model**中，通过**Controller**，**绑定**到**View**上（视图可以理解为html的页面）。

- 所以控制器负责**接收将数据交给浏览器与接收用户请求**。用户操作时，实际上是→对控制器发出请求→控制器取用数据→交给视图→最终响应给用户。

 **两种注解**

  - **@Controller**(无法前后端分离）：既有页面又有数据。
  - **@RestController**：只有数据。RestController（为了方便前端处理）会将返回的对象数据转换为JSON格式。

### 路由映射

 **控制器如何接收前端的请求**

- **@RequestMapping**(可以用在类或者方法上）

- **value**参数：用于配置路径，支持普通字符串与正则表达式。可以规定前端用什么方法请求（比如get或post）

### 实际操作

1. 使用```@RequestMapping```

2. 加入value值：```/hello```。

   使hello方法能够接收前端的请求，前端通过/hello路径能够访问到该方法。（在地址栏里面发送的请求都是get请求）

3. 规定方法：加入```method=RequestMethod.GET```，规定只能通过get请求。(```@RequestMapping(value="/hello",method=RequestMethod.GET)```等价于```@GetMapping("/hello")```)
### 参数传递

- **@RequestParam**可以将前端的数据绑定到控制器的方法上以获取前端传递的信息。当传参与参数名一致时可省略。

  此时只需要在**方法**里面加入一个参数：String nickname，就可自动将前端输入的昵称传入nickname中。

- **传参与定义参数名不一致**，可以在方法里加入```@RequestParam(value = "nickname",required = false)String name```

  （代表参数映射,加上这个注解，就代表这个参数是必须的，如果希望可选就加上```required = false```)

  （如果必须，没输入会报错，报错结果为status=400，400一般意味着是客户端，也就是浏览器出了问题）
  

**全部代码如下**

*创建**entity**实体包，在entity下**创建User类**<u>(按住<kbd>alt</kbd>+<kbd>insert</kbd>快捷加入get/set/to String方法)</u>*

```
public class User {
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    private String username;
    private String password;

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```
*在**Controller**包下创建**ParamsController**控制器类(后面的POST方法用APIPOST可以调试)*

```
@RestController
public class ParamsController {
    @RequestMapping(value = "/getTest1",method = RequestMethod.GET)
    public String getTest1(){
        return "Get请求";
    }

    @RequestMapping(value ="/getTest2",method = RequestMethod.GET)
    public String getTest2(String nickname,String phone){
        System.out.println("nickname"+nickname);
        System.out.println("phone"+phone);
        return "GET请求";
    }

    @RequestMapping(value = "/getTest3",method = RequestMethod.GET)
    public String getTest3(@RequestParam(value = "nickname",required = false)String name){
    //↑注解，代表参数映射，表示如果传参名字与参数不一致，就映射nickname
        System.out.println("nickname"+name);
        return "GET请求";
    }

    @RequestMapping(value = "/postTest1",method = RequestMethod.POST)
    public String postTest1(){
        return "POST请求";
    }

    @RequestMapping(value = "/postTest2",method = RequestMethod.POST)
    public String postTest2(String username,String password){
        System.out.println("username:"+username);
        System.out.println("password:"+password);
        return "POST请求";
    }

    @RequestMapping(value = "/postTest3",method = RequestMethod.POST)
    public String postTest3(User user){
        System.out.println(user);
        return "POST请求3";
    }

    @RequestMapping(value = "/postTest4",method = RequestMethod.POST)
    public String postTest4(@RequestBody User user){
        System.out.println(user);
        return "post请求";
    }

    @GetMapping("/test/**")
    public String test(){
        return "通配符请求";
    }
}
```
## APIPOST

- 可以模拟post请求

（本来需要通过专门的前端程序或者表单，这里可以通过APIPOST进行前端调试）

（在地址栏里面发送的是get请求，不能直接/postTest（post请求的方法），会有405（4开头一般是浏览器的问题））

- JSON类型需要使用{}传递
- 如果需要接收JSON类型的数据需要加一个单独的注解 **@RequestBody** 
- 需要注意<u>类型与参数名</u>都要**对的上**
- 通配符（了解即可）```/test/**```,意味着/test/a/b/c都行。```/test/*```意味着只能/test/abcc。


