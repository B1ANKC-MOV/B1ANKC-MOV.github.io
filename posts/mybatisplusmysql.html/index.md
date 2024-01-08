# [Java] Mybatis向Mysql插入主副表JSON数据


## 创建主表实体类

首先创建一个entity包下的主表实体类，这里命名为User。

代码如下：

```java
/**
 * 主表实体类
 * @author VVulpes
 * @CreateDate 2023-12-28
 */
@Data
// Mybatis规定了如果类名与表名一致，会自动找寻对应的数据表，如果不一致，需要加一个注解告诉它对应的表格名称
@TableName("t_user")
public class User {
    // 这个注解告诉了Mybatis字段id为主键，且自增，使得代码中能拿到主键的值
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    // 该字段为与子表相连的外键，需要注意的是，使用Mybatis写SQL语句时，类中的属性名一定要和表中的字段名相同，如果不同，可以使用@TableField("字段名")进行注解
    private Integer user_id;

    // 为子表数据创建虚拟字段，这里用来存放JSON格式数据中传入的子表内容，后面再通过控制器一一插入子表字段
    @TableField(exist = false)
    private List<Order> orders;

}
```

## 创建子表实体类

类似地，在entity包下创建子表实体类Order。

代码如下：

```java
/**
 * 子表实体类
 * @author VVulpes
 * @CreateDate 2023-12-28
 */
@Data
@TableName("t_order")
public class Order {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Long order_id;
    private String order_time;
    private Float order_val;
    private Integer user_id;

}
```

## 创建主表Mapper接口

接下来，在mapper包下为主表创建一个接口（interfac）类。

代码如下：

```java
/**
 * 主表Mapper接口
 * @author VVulpes
 * @CreateDate 2023-12-28
 */
@Mapper
// 由于Mybatis内置了很多的语句，已经帮我们写好了增删改查等操作，我们这里不需要写任何方法，只需要继承Mybatis的BaseMapper，接着在控制器中调用方法即可
public interface User extends BaseMapper<User> {

}
```

## 创建子表Mapper接口

类似地，在mapper包下创建子表Mapper接口。

代码如下：

```java
/**
 * 子表Mapper接口
 * @author VVulpes
 * @CreateDate 2023-12-28
 */
@Mapper
public interface Order extends BaseMapper<Order> {

}
```

## 创建控制器类

接下来就到了重头戏和主要实现部分——控制器

首先在controller包下创建一个控制器类，这里命名为UserOrderController。

具体代码如下：

```java
/**
 * 用户订单数据存储接口
 * @author VVulpes
 * @CreateDate 2023-12-28
 */
@RestController
public class UserOrderController {
    // 向接口类中注入字段，否则为空
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    // 由于传入数据为JSON格式，需要加一个@RequestBody注解
    @PostMapping("/insertuserorder")
    public GeneralResponse save(@RequestBody User user){
        // 插入数据，i代表着插入的数据条数
        int i= userMapper.insert(user);
        List<Order> orders = User.getOrders();
        if(orders != null){
            for(Order order : orders){
                order.setUser_id(User.getUser_id());
                orderMapper.insert(order);
            }
        }
        if(i>0){
            return "插入成功";
        }else {
            return "插入失败";
        }
    }

}
```

## 演示JSON数据

格式如下：

```json
{
"user_name":"用户06",
"user_id":7899,
"orders":[
    {
        "order_id":6,
        "order_time":"2023-01-03 11:35:56",
        "order_val":46,
        "user_id":""
    }
]
}
```


