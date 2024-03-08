# 从其他表中查出待存储的表名，并将数据插入该表的实现（跨数据库/数据库平台）

最后实现的功能大概为：根据传入的`person_id`，在存放数据位置信息的表中，筛选出数据要插入的表名（例如，person_id=1的数据，在`work_table_info`表中查出，需要存储在table_id_1表中），并将数据插入。

## 实体类

```java
@Data
public class Daily {
    private String time;	//打卡时间
    private Double longitude;	//打卡经纬度
    private Double latitude;
    private String person_id;	//打卡人员id
}
```
<!--more-->
## Mapper接口

```java
@Mapper
public interface DailyMapper extends BaseMapper<Daily> {
    @Select("select table_name from worker_table_info where worker_id=#{person_id}")
    public String findTableName(String person_id);	//查询待插入的表名

    @DataSource(DataSourceEnum.DB3)	//指定源数据库（跨平台跨数据库）
    @Insert("insert into #{table_name} (time,longitude,latitude) " +
            "values(#{daily.time},#{daily.longitude},#{daily.latitude})")
    public int insertDaily(Daily daily,String table_name);
}
```

## Controller控制器

```JAVA
@RestController
public class DailyController {
    @Autowired
    private DailyMapper dailyMapper;

    @PostMapping("/dailyInsert")
    public String save(@RequestBody Daily daily) {
        // 获取人员ID对应的表名
        String person_id = daily.getPerson_id();
        String table_name = dailyMapper.findTableName(person_id);
        // 向时序数据表插入数据
        int i= dailyMapper.insertDaily(daily,table_name);
        if(i>0){
            return "插入成功";
        }else {
            return "插入失败";
        }
    }
}
```

## Config跨数据库注解

这里开始是为了跨数据库做准备，写了一个注解和枚举类，这样就可以在对应的sql语句前面加上`@`注解，使得编译器识别执行操作的数据库源，从而实现跨数据库的效果。

### DataSource注解类

在`config`下创建需要作为注解使用的DataSource类，具体代码如下

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DataSource {
    DataSourceEnum value() default DataSourceEnum.DB1;
}
```

### DataSourceEnum枚举类

在config下创建上述注解使用到的DataSourceEnum枚举类，方便使用时直接引用，不需要把数据库名的一长串东西打进去，具体代码如下

```java
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum DataSourceEnum {
    DB1("db1"),DB2("db2"),DB3("db3");
    private String value;
}
```

 ## `.yml`文件配置数据库源

上面的Config配置其实都是为了不要在代码里直接写数据库的信息，因为太多了，也很杂乱。

而数据库的全部信息则存放在`application.yml`文件里，大概是这样的格式，代码如下：

```java
server:
  port: 8080

spring:
  main:
    allow-bean-definition-overriding: true
  application:
    name: iotReceive
  datasource:
    aop:
      proxy-target-class: true
      auto: true
    druid:
      db1:
        url: jdbc:mysql://123.456.000.77:8910/my_database?allowMultiQueries=true&autoReconnect=true&useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&allowPublicKeyRetrieval=true
        username: admin
        password: 000000
        initialSize: 5
        minIdle: 5
        maxActive: 20
        testWhileIdle: true
        validationQuery: SELECT 1
        testOnBorrow: false
        testOnReturn: false
        poolPreparedStatements: false
      db2:
        url: jdbc:postgresql://11.222.33.44:5555/my_db?useSSL=false&allowPublicKeyRetrieval=true
        username: admin1
        password: 111111
      db3:
        url: jdbc:TAOS://987.654.321.00:1010/my_data_base?charset=UTF-8&timezone=UTC-8
        username: admin2
        password: 222222
        driver-class-name: com.taosdata.jdbc.TSDBDriver
        pool-name: Cloud-OAuth2-HikariCP-taos
        minimum-idle: 5
        maximum-pool-size: 20
        testWhileIdle: true
        validationQuery: SELECT 1
        testOnBorrow: false
        testOnReturn: false
        poolPreparedStatements: false
  redis:
    host: 127.0.0.1
    port: 9876
    session:
      store-type: redis
mybatis-plus:
  mapper-locations:
    - classpath*:com/my/iot/parse/mapper/mapping/*.xml
```


