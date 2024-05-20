# [Java]读取Excel指定列内容，更新数据库数据

{{< admonition tip "章前导言">}}

根据给的Excel表格更新数据库里面的测点编码，以项目编码&测点名称为准匹配数据库里的记录。

- 代码功能内容：读取.xlsx文件，逐行遍历，根据指定列内容，筛选数据库里面的记录进行更新。

因为在编译的过程中还是耗费的时间和精力不少，也碰了不少壁，就把这次的工作经验拿来写篇文章总结一下
{{< /admonition >}}

<!--more-->

## 项目配置

包含了很多我日常使用的时候用到的配置，不是针对本文专门进行的配置

当然本文的配置也包含在里面，有兴趣的朋友可以看看，我就不多作解释，直接放在下面了

### `.xml`文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>company.name</groupId>
    <artifactId>projectName</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>projectName</name>
    <description>projectName</description>
    <properties>
        <java.version>1.8</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <spring-boot.version>2.5.6</spring-boot.version><!--由于Swagger兼容问题，将版本从2.6.13降至了2.5.6-->
    </properties>
    <dependencies><!--若需要加入其他框架，则进入此处添加即可-->
        <!--SpringBoot将传统Web开发的mvc、json、tomcat等框架整合，提供了spring-boot-starter-web组件，简化了Web应用配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId><!--此处加入了一个JavaWeb依赖-->
        </dependency>
        <!--webmvc为Web开发的基础框架，json为JSON数据解析组件，tomcat为自带的容器依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!--开发环境热部署-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
        </dependency>
        <!--开发环境热部署-->
        <!--添加swagger2相关功能-->
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
        <!--添加swagger2相关功能-->
        <!--MyBatisPlus依赖-->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.4.2</version>
        </dependency>
        <!--MyBatisPlus依赖-->
        <!--mysql依赖-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>
        <!--mysql依赖-->
        <!--数据连接池druid-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.20</version>
        </dependency>
        <!--数据连接池druid-->
        <!--Excel-->
        <!--解析excel-->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>RELEASE</version>
        </dependency>

        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.13.0</version> <!-- 请根据你的需求使用合适的版本 -->
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.7</version>
        </dependency>
        <!--Excel-->
        <!--http-->
            <dependency>
                <groupId>org.apache.httpcomponents</groupId>
                <artifactId>httpclient</artifactId>
                <version>4.5.5</version>
            </dependency>
            <dependency>
                <groupId>commons-httpclient</groupId>
                <artifactId>commons-httpclient</artifactId>
                <version>3.1</version>
            </dependency>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.8.8</version>
        </dependency>
        <!--http-->
    </dependencies>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
                <configuration>
                    <mainClass>company.name.projectname.ProjectNameApplication</mainClass>
                    <skip>true</skip>
                </configuration>
                <executions>
                    <execution>
                        <id>repackage</id>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>
```

### `.properties`文件

```properties
# 应用服务 WEB 访问端口
server.port=18310
# 热部署生效
spring.devtools.restart.enabled=true
# 设置重启目录
spring.devtools.restart.additional-path=src/main/java
# 设置classpath目录下的WEB-INF文件夹内容修改不重启
spring.devtools.restart.exclude=static/**
#  更改Tomcat限制的请求文件的大小和总数
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
#  使用户能够访问其上传的图片
spring.web.resources.static-locations=/upload/
#  配置数据库相关信息
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
#	填写你的数据库链接、名称和密码
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

## 项目代码

### myGetCell工具类——获取单元格内容

```java
public class myGetCell {
    public static  <T> T getCellValue(Row row, int cellNum, Class<T> clazz) {
        // 参数：行数据row、列数cellNum、列数据类型clazz；返回值：clazz类型的单元格内容
        // 获取该行指定列单元格内容
        Cell cell = row.getCell(cellNum);
        DataFormatter formatter = new DataFormatter();
        //如果单元格内容为空则返回null，不为空则对数据进行处理
        if (cell != null) {
            //将单元格内容转换为字符串格式
            String stringCellValue = formatter.formatCellValue(cell);;
            //如果非空，则对单元格内容进行指定数据类型的转换。例如：表中单元格内容为0，但列数据类型应为double，就转换成0.0，以此类推
            boolean hasValue = StringUtils.isNotBlank(stringCellValue);
            if (Double.class.equals(clazz)) {
                return (T) (hasValue ? Double.valueOf(stringCellValue) : new Double(0));
            } else if (Integer.class.equals(clazz)){
                return (T) (hasValue ? Integer.valueOf(stringCellValue) : new Integer(0));
            } else if (Float.class.equals(clazz)){
                return (T) (hasValue ? Float.valueOf(stringCellValue) : new Float(0));
            } else if (Long.class.equals(clazz)){
                return (T) (hasValue ? Long.valueOf(stringCellValue) : new Long(0));
            } else if (String.class.equals(clazz)){
                return (T) stringCellValue;
            }else {
                return (T) stringCellValue;
            }
        } else {
            return null;
        }
    }
}
```

### Result工具类——Http返回值

其实这个类是用来定义控制器方法的，虽然只是和数据库对接，但这样包装一下方便我最后在Postman里面调试的时候抛出结果（所以这个可用可不用）

这个是直接用的别人的工具类，参考链接在章末，我就直接把代码放出来了

```java
import lombok.Data;
/**
 * @author zhanghuiwen
 * http返回值
 */
@Data
public class Result<T> {
    public Result(boolean success, int code) {
        this.setSuccess(success);
        this.setCode(code);
    }
    public Result(boolean success, int code, T data) {
        this.setSuccess(success);
        this.setCode(code);
        this.setData(data);
    }
    public Result(boolean success, int code, String msg) {
        this.setSuccess(success);
        this.setCode(code);
        this.setData(data);
    }
    /**
     * 请求是否成功
     * true:成功
     * false：失败
     */
    private boolean success;
    /**
     * 状态码
     * 成功：200
     * 失败：其他
     */
    private int code;
    /**
     * 失败状态码描述
     * 如果成功不返回
     * 失败返回状态码对应的msg消息
     */
    private String msg;
    /**
     * 请求数据的结果
     */
    private T data;
    public static <T> Result<T> success() {
        return new Result<T>(true, 200);
    }
    public static <T> Result<T> success(T data) {
        return new Result<T>(true, 200, data);
    }
}
```

### PscMapper接口——筛选记录并更新数据方法

就是存放了一个能够根据给出的项目编码ID和测点内容PointCode，筛选出数据库中与之匹配的记录，然后使用传入的SensorCode参数的内容，更新记录里push_sensor_code字段的内容

```java
@Mapper
public interface PscMapper {//其实这里我还extends BaseMapper<>了一个实体类，但是后续并没有用到，应该是不受影响的，我就把这继承给删掉了
    @Update("UPDATE project_sensor " +
            "SET push_sensor_code = #{sensorcode} " +
            "WHERE pro_id = #{id} AND measure_point_code = #{pointcode}")
    public int updateSensorCode(@Param("sensorcode")String sensorcode,@Param("id")String id,@Param("pointcode")String pointcode);
}
```

### PscController控制器类——功能实现的主要代码文件

```java
@RestController
public class PscController {

    @Autowired
    private PscMapper pscMapper;

    @PostMapping("/readExcel")
    public Result GetExcel (@RequestParam("file") MultipartFile file,@RequestParam("id") String id) throws Exception{
        //参数：.xlsx表格文件，项目编码id
        try{
            //读取Excel文件
            InputStream inputStream = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
            //拿取Excel文件中的第一张表
            Sheet sheet = workbook.getSheetAt(0);
            int rowLength = sheet.getLastRowNum()+1;//总行数
            List<String> list = new ArrayList<>();//用于失败行记录的List
            int sn=0;//成功次数
            int fn=0;//失败次数
            for(int i=2;i<rowLength;i++) {//真正的数据从第3行开始，前面两行是表头
                Row row = sheet.getRow(i);//获取行数据
                if (row != null) {//如果不是空行
                    String ID = id;//项目编码
                    String PointCode = getCellValue(row, 3, String.class);//获取测点名称（在每一行的第4列）
                    String SensorCode = getCellValue(row, 1, String.class);//获取要更新的内容——测点编码（在每一行的第2列）
                    int r = 0;//用来判断更新方法成功了没有，成功了使用次数就大于1（非常简陋的确认）
                    if(PointCode!=null && SensorCode !=null) {//参数不为空则执行更新语句
                        r = pscMapper.updateSensorCode(SensorCode, ID, PointCode);
                    }
                    if (r > 0) {
                        System.out.println("更新成功!");
                        sn++;
                    } else {
                        int n=i+1;//当前数据对应的表格行数
                        String Str = "\n失败行:" + n + ",数据: " + SensorCode + " 插入失败," + "数据库中无匹配 " + PointCode + " 的记录";
                        list.add(Str);//将数据加入失败记录List
                        System.out.println("更新失败!");
                        fn++;
                    }
                }
            }
            System.out.println("数据更新结束,成功更新数据<"+sn+">行,失败<"+fn+">行.");
            System.out.println("失败记录:\n"+list);
        }catch (IOException e){
            e.printStackTrace();
        }
        return Result.success("数据更新完毕");
    }
}
```



> 参考文章链接：
>
> 1. [**使用Java后台导入excel文件，读取数据后，更新数据库，并返回数据给到前端**](https://blog.csdn.net/weixin_43228155/article/details/117017197)
> 2. **[java http返回值Result 工具类](https://www.cnblogs.com/zhangshiwen/p/12707461.html)**
> 3. *[Java、SpringBoot实现对Excel内容的读取并将Excel内容导入到数据库中](https://blog.csdn.net/weixin_57466771/article/details/134338250)*
> 4. *[对Excel内容读写，将Excel内容导入导出数据库](https://blog.csdn.net/weixin_51201930/article/details/123827779)*
> 5. *[Excel文件解析方式](https://blog.csdn.net/m0_65467013/article/details/125764397)*
> 6. *[读取大数据量excel并执行批量更新数据库操作](https://blog.csdn.net/u010964869/article/details/73916745)*
> 7. *[公共返回工具Result＜返回实体类＞](https://blog.csdn.net/weixin_51114236/article/details/118639827)*
> 8. *[POI-EXCEL导入导出工具](https://blog.csdn.net/Mr_Hellon/article/details/127426640)*
> 9. *[Java读取excel表数据类型判断](https://blog.csdn.net/FUCCKL/article/details/86215712)*
> 10. [**idea使用@data注解报红警告**](https://blog.51cto.com/u_15127590/4312161)
> 11. [**Parameter ‘xxx‘ not found错误**](https://blog.csdn.net/qq_51025538/article/details/121265866)
> 12. [**Required request part 'file' is not present**](https://www.cnblogs.com/tobycold/p/17867856.html)
> 13. *[文心一言](https://yiyan.baidu.com/welcome)*
