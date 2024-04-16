# 【Java全栈学习】五、MybatisPlus增/删/改

## ORM
1. ORM (Object Relational Mapping,对象关系映射）是为了解决面向对象与关系数据库存在的互不匹配现象的一种技术。
2. ORM通过使用描述对象和数据库之间映射的元数据将程序中的对象自动持久化到关系数据库中。
3. ORM框架的本质是简化编程中操作数据库的编码。

<!--more-->

## Mybatis-Plus
### 介绍
- MyBatis是一款优秀的数据持久层ORM框架。被广泛地应用于应用系统。
- MyBatis能够非常灵活地实现动态SQL。可以使用XML或注解来配置和映射原生信息。能够轻松地将Java的POJO(Plain Ordinary Java Object，普通的Java对象)与数据库中的表和字段进行映射关联。
- MyBatis-Plus是一个MyBatis的增强工具。在MyBatis的基础上做了增强。简化了开发。
### 配置
1. 添加依赖到pom.xml：（MybatisPlus其实依赖了Mybatis）（需要准备好Mysql数据库）
```xml
<!--MyBatisPlus依赖-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.4.2</version>
</dependency>
<!--mysql驱动依赖-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
<!--数据连接池druid-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.20</version>
</dependency>

```
2. 加入配置（在.properties)：使用什么连接池\数据库、数据库在哪、账号\密码、日志输出格式等等（数据库的组件都在mapper包里，需要给出mapper包路径）
### 实操
1. 加入**控制器**
2. 定义**mapper**相关的**组件**（要创建的是接口，不是类，名称都以要操作的表+mapper命名）（sql语句都用@注解来实现）
3. **新建**user**类**，存储表中有的字段。（按住<kbd>alt</kbd>+<kbd>insert</kbd>加入get、set、toString方法）
4. **加入注解**使得方法生效`@select("select * from user")`(记得加入`@mapper`)
5. 通过`@autowired`注入参数usermapper内容，再使用find()方法返回用户列表。
6. 改成**JSON**
7. 插入user**对象**
8. `int insert()`代表插入几条记录，插入失败返回值为0
9. mysql插入会自增
10. mybatis会**自动**帮助你**增删改**，不需要再自写方法了，只需要**告诉其**user**类**
11. **mybatis-plus**当表名与类名不一样时使用`@TableName("表名")`告知mybatis需要操作的表名，如果需要id作为组件自增则使用`@TableId(type=IdType.AUTO)`。
    如果不加的话，数据库里面的id可能是自增的值，但是代码print不出来id的值。
