# 全栈学习·MybatisPlus多表查询及分页查询

## Mybatis多表查询

实现复杂关系映射，可以使用@Results注解，@Result注解，@One注解，@Many注解组合完成复杂关系的配置。

| 注解       | 说明         |
|:-----------|:-------------|
|@Reults|代替<resultMap>标签,该注解中可以加入单个或多个@Result注解|
|@Result  |代替<id>标签和<Result>标签，@Result中可以使用以下属性: <br/>- column: 数据表的字段名称<br />- property:类中对应的属性名<br />- one:与@one注解配合，进行一对一的映射<br />- many: 与@Many注解配合，进行一对多的映射|
|@One|代替<assocation>标签，用于指定查询中返回的单一对象<br />通过select属性指定用于多表查询的方法<br />使用格式:@Result(column="",property="",one=@one(select=""))|
|@Many|代替<collection>标签,用于指定查询中返回的集合对象<br />使用格式:@Result(column="",property="",many=@Many(select=""))|

**实际使用**
1.  要查同一用户下的所有订单：加入一个字段orders，字段orders并不存在，其属性为List集合，存放的是订单对象Orders。
``` 
TableName("t_user")
public class User {
    @TableId(type = IdType .AUT0)
    private int id;
    priwate string username ;
    private string password;
    private string birthday ;
    //描述用户的所有订单
    @TableField(exist = false)
    private List<0rder>orders;
    //alt + insert
…………
```
2.  这个字段需要自行映射
```
…………
//查询用户及其所有的订单
    @Select(""select * from t_user"")
    @Results(
        {
            @Result(column = "id" , property = "id"),
            @Result(column = "username" , property = "username"),
            @Result(column = "password" , property = "password""),
            @Result(column = "birthday" , property = "birthday"") ,
            @Result(column = "id " , property = "orders",javaType = List.class,
                many=@Many(select = "com.example.mpdemo.mapper.OrderMapper.selectBy……
            )
        }
    }
    List<User> selectAllUserAnd0rders();
}
```
3.  前面意思是↑从数据库里面调取的id这一列需要赋值给user类中的id属性。
    关键在于映射orders：最后一行，标记需要使用id字段，需要映射orders，类型为集合list。还需要写一个方法：
```
@Select("select * from t_order where uid = #{uid}")
List<Order> selettByUid(int uid);
```
4. many注解，意思是一个用户会有多个订单，后接需要调用哪个mapper的哪个方法（对着mapper右键copy path选最后一个就行）,查询出来的订单最后传给了orders属性，就完成了映射。
5. 如果我们需要查订单的用户：需要用one注解
```
one=@0ne(select = "com.example.mpdemo.mapper .UserHapper.selectById")
```
**条件查询**：
```
@GetMapping("/user/find")
public List<User> findBycond(){
    QueryWrapper<User> queryWrapper = new QueryWrapper();
    queryWirapper.eq( "username" , "zhangsan");
    return userMapper.selectList(queryWrapper);
}
```
**分页查询**：

```
@GetMapping("/user/findByPage")
public IPage findByPage(){
    //设置起始值及每页条数
    Page<User> page = new Page<>(0, 2) ;
    IPage iPage = userMapper.selectPage(page,  null);
    return iPage;
}
```
