# 【Java全栈学习】三、SpringBoot文件上传&拦截器

## Web开发进阶
### 静态资源访问
前后端分离static是不会存放内容的
### 实操
- 当没有配置静态资源时，直接 **“/”** 后接 **静态资源** 名称即可访问（例：localhost:8080/test.jpg）
- 如果不想放在根路径下直接访问，而希望在**资源前**面加一个**统一路径**images方便管理，可以通过static path设置虚拟路径（也叫**过滤规则**）:在application.properties中加入代码
```properties
spring.mvc.static-path-pattern=/images/**
```
- 如果在<u>resource</u>下额外创建了一个文件，将**静态资源放在自创文件**css中，则需要通过static locations进行修改（classpath是整个项目的类路径，在target下的classes，是一个固定的目录）
```properties
spring.web.resources.static-locations=classpath:/css
```

<!--more-->

## 文件上传
### 文件上传原理
传输文件必须要把表单中的enctype（编码类型）改成form-data的类型。
（修改后，例如表单中的字符串字段，还是使用文本形式进行传输；但如果上传的字段是文件，则会与上一个分开，用另外的形式上传）
#### 配置
在application.properties中加入
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```
在控制器方法中加入一个特殊的参数**MultipartFile**（Spring用来接收文件的类型）,通过此对象获取文件信息。
例如：``` public String upload(String nickname, MultipartFile photo, HttpServletRequest request) ```
### 实操
- **如何动态获取web服务器所在位置**（怎么去获取服务器对应路径）：
  在方法里加入**HttpServletRequest** request参数（J2EE提供的原始类，代表网络请求，即前端发送的请求，一个request对象）: ```public String upload(String nickname, MultipartFile photo, HttpServletRequest request)```
  通过此对象可以获取该对象的上下文对象（**request.getServletContext**，也就是该请求的上下文），
  其实也就是web服务器，通过web服务器得到对应的路径（**getRealPath**)，
  其实就得到了web服务器运行的目录，将其存储在自创的虚拟的/upload/目录中:
  ``` String path = request.getServletContext().getRealPath("/upload/"); ```
- 如果status：500，意味着后端出了问题（up是文件太大了）
- 通过自定义函数savefile判断目录是否存在，如果不存在，则使用path与文件名创建目录，最后使用**transferTo**方法把文件传输到创建好的目录中。
- 想让用户通过刚刚创建好的目录访问文件需要在applicaition.properties中加入代码：
```properties
spring.web.resources/static-locations=/upload/ 
```
**全部代码如下**

*在Controller包下创建**FileUploadController**类*

```java
@RestController
public class FileUploadController {
    @PostMapping("/upload")
    public String upload(String nickname, MultipartFile photo, HttpServletRequest request)throws IOException{
        System.out.println(nickname);
        System.out.println(photo.getOriginalFilename());
        System.out.println(photo.getContentType());

        String path = request.getServletContext().getRealPath("/upload/");
        System.out.println(path);
        saveFile(photo,path);
        return "success upload";
    }

    public void saveFile(MultipartFile photo,String path)throws IOException{
        File dir=new File(path);
        if (!dir.exists()){
            dir.mkdir();
        }
        File file=new File(path+photo.getOriginalFilename());
        photo.transferTo(file);
    }
}
```
## 拦截器
### 有关拦截器
- 拦截器主要对于不同控制器可能遇见的统一操作（例如获取用户名），做一个处理
- 用户提交的请求都先到达（自定义的）拦截器，调用prehandle，最终到控制器的目标方法中，到页面渲染结束，再调用afterCompletion
- prehandle调用的最频繁（例如用户想要提交一个请求，但是没有登录，拦截器可以拦截下请求不让它直接到控制器调用方法，而是先登录）
- 如果要定义拦截器一般会在后面加**Interceptor**（然后继承一个系统的拦截器类**HandlerInterceptor**):
``` public class LoginInterceptor implements HandlerInterceptor ```
- 拦截器还需要**注册**，否则无法使用（需要在Java类里面完成，继承**WebMvcConfiguer**，一个专门做配置器的类，对于刚才创建的拦截器进行一个**Login**，然后定义你需要拦截的路径）:
``` public class WebConfig implements WebMvcConfigurer ``` 
······
```registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/user/**"); ```
······
### 实际操作
1. 继承**HandlerInterceptor**（Ctrl+单击进入具体代码）
2. 重写**prehandle**方法，写完之后还需要配置才生效（此配置一般放在config下）：创建一个类，加入**注解Configuration**使其生效（效果为Springboot会自动读取此类）
3. 重写副类**WebMvcConfigurer**，里面提供了添加拦截器的方法
4. 重写**addInterceptors**方法，调用其传递的registry对象，添加一个拦截器，将刚才Login的拦截器进行**new**，最后加入<u>拦截路径</u>（不加的话就是拦截所有，可以不加）

**全部代码如下**

*创建**Interceptor**包，在下面创建**LoginInterceptor**类：*

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,Object handler)throws Exception{
        System.out.println("LoginInterceptor");
        return true;
    }
}
```
*在config下创建**WebConfig**类：*

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry){
//        registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/user/**");
        registry.addInterceptor(new LoginInterceptor());
    }
}
```
