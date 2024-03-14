# [Java] TDengine时序数据库时间戳(timestamp)字段插入数据的实现方法


## 实体类

定义实体类，插入数据分别代表`打卡时间`、`员工id`，

打卡时间是最后需要插入时序数据库中的**时间戳类型字段**。

```java
@Data
public class Daily {
    private String collect_time;
    private String id;
}
```
<!--more-->

## Mapper接口

继承Mybatis的BaseMapper接口，利用`insert`语句进行插入，`#{}`中写的内容会自动填入方法中对应的同名参数内容。

```java
@Mapper
public interface DailyMapper extends BaseMapper<Daily> {
    @Insert("insert into #{table_name} (collect_time) " +
            "values(#{timestamp})")
    public int insertDaily(Daily daily,String table_name,long timestamp);
}
```

## Controller控制器

```java
@RestController
public class DailyController {
    @Autowired
    private DailyMapper dailyMapper;

    @PostMapping("/dailyInsert")
    public String save(@RequestBody Daily daily) {
        // 解决时间戳问题
        String collect_time=daily.getCollect_time();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = sdf.parse(collect_time);
        long timestamp = date.getTime();
        // 向时序数据表插入数据
        int i= pavRollMapper.insertDaily(daily,"table1",timestamp);
        // 返回插入结果
        if(i>0){
            return "插入成功";
        }else {
            return "插入失败";
        }
    }
}
```


