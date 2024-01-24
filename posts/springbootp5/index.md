# 全栈学习·RESTful服务+Swagger

## RESTful服务
### RESTful介绍
RESTful是一种软件服务架构设计风格
### RESTful特点
例如，将请求清晰分类，GET用于获取，POST用于新建，等等等等
- 每一个URI代表一种资源。
- 客户端使用GET、POST、PUT、DELETE四种表示操作方式的动词对服务端资源进行操作:GET用于获取资源,POST用于新建资源(也可以用于更新资源)，PUT用于更新资源，DELETE用于删除资源。
- 通过操作资源的表现形式来实现服务端请求操作。
- 资源的表现形式是JSON或者HTML。
- 客户端与服务端之间的交互在请求之间是无状态的。从客户端到服务端的每个请求都包含必需的信息。

### RESTful API（符合此架构接口的必备特质）
**符合RESTful规范的Web API需要具备如下两个关键特性:**
- 安全性:安全的方法被期望不会产生任何副作用。当我们使用GET操作获取资源时。不会引起资源本身的改变，也不会引起服务器状态的改变。
- 幂等性:幂等的方法保证了重复进行一个请求和一次清求的效果相同（并不是指响应总是相同的,而是指服务器上资源的状态从第一次请求后就不再改变了），在数学上幂等性是指N次变换和一次变换相同。

**在做BS架构程序时，想要符合RESTful风格，对应几种请求方法即可**

**实际编程时如何实现RESTful风格**：

  - Spring Boot提供的spring-boot-starter-web组件完全支持开发RESTful API,提供了与REST操作方式(GET.POST、PUT、DELETE)对应的注解：
  	- GetMapping:处理GET请求，获取资源。
  	- PostMapping:处理POST请求，新增资源。
  	- putMapping:处理PUT请求，更新资源。
  	- DeleteMapping:处理DELETE请求，删除资源。
  	- PatchMapping:处理PATCH请求，用于部分更新资源。
- **URL中不要包含动词**（传统的比如删除用户操作为http://xxx/del?id=10，但是RESTful需要delete http://xxx/user/10）
**示例：（RESTful增删改查）**（加**{}**意味其为**动态**，需要加入PathVariable注解）
### 实操
**全部代码如下**


```java
@RestController
public class UserController {
    @GetMapping("/user/{id}")
    public String getUserById(@PathVariable int id){
        System.out.println(id);
        return "根据ID获取用户信息";
    }
    @PostMapping("/user")
    public String save(User user){return "添加用户";}
    @PutMapping("/user")
    public String update(User user){return "更新用户";}
    @DeleteMapping("/user/{id}")
    public String deleteById(@PathVariable int id){
        System.out.println(id);
        return "根据ID删除用户";
    }
}
```
## Swagger
Java内提供的测试工具
通过Swagger动态生成web接口文档（方便前端使用），也可以进行端口测试
### 配置

1. 在pom.xml加入依赖↓
``` xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```
{{< admonition warning >}}
Spring Boot 2.6.X后与Swagger有版本冲突问题，需要在application.properties中加入以下配置:
```spring.mvc.pathmatch.matching-strategy=ant_path_matcher```
{{< /admonition >}}

2. 然后做一个基本的配置↓（在config下创建一个SwaggerConfig配置类）
```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select()
                .apis( RequestHandlerSelectors.basePackage("com"))
                .paths(PathSelectors.any()).build();

    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("演示项目API")//标题
                .description("学习Swagger2的演示项目")//描述
                //附加信息
                .build();
    }
}
```


### 使用Swagger2进行接口测试
启动项目访问http://127.0.0.1:8080/swagger-ui.html，即可打开自动生成的可视化测试页面

