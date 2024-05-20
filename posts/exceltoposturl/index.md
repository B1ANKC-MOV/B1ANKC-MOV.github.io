# [Java]读取Excel表，转为Json格式发送至Url，获取接口应答报文，失败记录输出至txt


{{< admonition question "阅前提示">}}

1. “转为Json格式”是直接使用我自己定义的方法，强行转换为Json字符串的（因为格式上有一些要求）

2. 由于需要获取请求网址的应答报文，代码使用第三方库Apache HttpClient向Url发送JSON数据，而不是HttpURLConnection
3. 对HttpURLConnection示例代码感兴趣的，这部分我会放在章末

{{< /admonition >}}

<!--more-->

# 项目配置

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



# 项目代码

## Config工具/配置类

### myGetCell工具类——获取单元格内容

```java
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
/**
 * @author VVulpes
 * @CreateDate 2024/5/8
 * @ProjectDetails [获取单元格内容方法]
 */
public class myGetCell {
    public static  <T> T getCellValue(Row row, int cellNum, Class<T> clazz) {
        // 参数：行数据、列数、列数据类型；返回值：clazz类型的单元格内容
        // 获取该行指定列单元格内容
        Cell cell = row.getCell(cellNum);
        DataFormatter formatter = new DataFormatter();
        //如果单元格内容为空则返回null,不为空则对数据进行处理
        if (cell != null) {
            //将单元格内容转换为字符串格式
            String stringCellValue = formatter.formatCellValue(cell);;
            //如果非空,则对单元格内容进行指定数据类型的转换,例如内容为0且指定为double的,就转换成0.0，以此类推
            boolean hasValue = StringUtils.isNotBlank(stringCellValue);
            if (Double.class.equals(clazz)) {
                return (T) (hasValue ? Double.valueOf(stringCellValue) : new Double(0));
            } else if (Integer.class.equals(clazz)){
                return (T) (hasValue ? Integer.valueOf(stringCellValue) : new Integer(0));
            } else if (Float.class.equals(clazz)){
                return (T) (hasValue ? Float.valueOf(stringCellValue) : new Float(0));
            } else if (float[].class.equals(clazz)){//转换为浮点型数组
                float[] tmp = {0};
                if(hasValue){
                    tmp[0] = Float.valueOf(stringCellValue);//直接读取单元格中的单个数字填入长度为1的浮点型数组【非常偷懒】
                    return (T) tmp;
                }else {
                    return null;
                }
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

### exportTXT工具类——输出`.txt`文件

```java
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

/**
 * @author VVulpes
 * @CreateDate 2024/5/9
 * @ProjectDetails [输入存放内容与文件名，输出.txt文件]
 */
public class exportTXT {
    public static String exportTxtFile(List<String> dataStr, String fileName) {
        //参数：存入txt文件的字符串List——dataStr,输出文件的名称——flieName
        String TXTStr = String.valueOf(dataStr);//把List转换为要存入txt文件的字符串
        String outPath="src/main/resources/";//存入项目同目录下资源文件夹中
        FileWriter fw ;
        String path =  outPath + fileName + ".txt";//文件路径
        File file = new File(path);//创建File对象，表示要写入数据的文件
        try {
            System.out.print("<txt文件创建开始>");
            if (file.exists()) {
                System.out.print("---|已存在文件|---");
            }
            fw = new FileWriter(file);//实例化FileWriter对象fw，将其与指定的文件file关联
            BufferedWriter bw = new BufferedWriter(fw);//创建BufferedWriter对象bw，用于缓冲写入数据到文件，提高写入效率
            bw.write(TXTStr);//将字符串TXTStr写入到bw中，准备写入到文件
            bw.flush();//将缓冲区中的数据写入到文件中
            bw.close();//关闭BufferedWriter与底层的FileWriter，确保文件被正确地写入并释放资源
            System.out.print("txt文件创建成功!---文件输出路径------------------------------[" + path +"]------------------------------");
            return path;
        } catch (IOException e) {
            System.out.print("txt文件创建失败!");
            e.printStackTrace();
        }
        return file.getAbsolutePath();
    }
}
```

## Entity实体类

### Data数据存储实体类——存储从表格中读取的每一行数据

```java
import java.util.Arrays;
/**
 * @author VVulpes
 * @CreateDate 2024/5/6
 * @ProjectDetails [当N级上下限为单个数字时]
 */
@lombok.Data
public class Data {
    private int bridgeUniqueCode;
    private Long pointUniqueCode;
    private String pointCode;
    private String pointPosition;
    private String monitorCategory;
    private String monitorTypeCode;
    private Integer monitorContentCode;
    private String monitorContent;
    private Float bridgeInitValue;
    private Float designValue;
    private String sensorType;
    private String sensorBrand;
    private String sensorModel;
    private String collectorCode;
    private String collectorBrand;
    private String collectorModel;
    private Float samplingFrequence;
    private float[] levelOneUpLimit;
    private float[] levelOneDownLimit;
    private float[] levelTwoUpLimit;
    private float[] levelTwoDownLimit;
    private float[] levelThreeUpLimit;
    private float[] levelThreeDownLimit;
    private Long installDate;

    public String ExceltoJsonStr() {//自定义方法将表格转换为Json格式的数据
        return "{" +
                "\n\t\"bridgeUniqueCode\":" + bridgeUniqueCode +
                ",\n\t\"pointUniqueCode\":" + pointUniqueCode +
                ",\n\t\"pointCode\":" + '\"' + pointCode + '\"' +
                ",\n\t\"pointPosition\":" + '\"' + pointPosition + '\"' +
                ",\n\t\"monitorCategory\":" + '\"' + monitorCategory + '\"' +
                ",\n\t\"monitorTypeCode\":" + '\"' + monitorTypeCode + '\"' +
                ",\n\t\"monitorContentCode\":" + monitorContentCode +
                ",\n\t\"monitorContent\":" + '\"' + monitorContent + '\"' +
                ",\n\t\"bridgeInitValue\":" + bridgeInitValue +
                ",\n\t\"designValue\":" + designValue +
                ",\n\t\"sensorType\":" + '\"' + sensorType + '\"' +
                ",\n\t\"sensorBrand\":" + '\"' + sensorBrand + '\"' +
                ",\n\t\"sensorModel\":" + '\"' + sensorModel + '\"' +
                ",\n\t\"collectorCode\":" + '\"' + collectorCode + '\"' +
                ",\n\t\"collectorBrand\":" + '\"' + collectorBrand + '\"' +
                ",\n\t\"collectorModel\":" + '\"' + collectorModel + '\"' +
                ",\n\t\"samplingFrequence\":" + samplingFrequence +
                ",\n\t\"levelOneUpLimit\":" + Arrays.toString(levelOneUpLimit) +
                ",\n\t\"levelOneDownLimit\":" + Arrays.toString(levelOneDownLimit) +
                ",\n\t\"levelTwoUpLimit\":" + Arrays.toString(levelTwoUpLimit) +
                ",\n\t\"levelTwoDownLimit\":" + Arrays.toString(levelTwoDownLimit) +
                ",\n\t\"levelThreeUpLimit\":" + Arrays.toString(levelThreeUpLimit) +
                ",\n\t\"levelThreeDownLimit\":" + Arrays.toString(levelThreeDownLimit) +
                ",\n\t\"installDate\":" + installDate +
                "\n}";
    }
}
```

### ResponseBody应答报文实体类——存储url返回的应答报文数据

```java
import lombok.Data;
/**
 * @author VVulpes
 * @CreateDate 2024/5/9
 * @ProjectDetails [存储应答报文实体类]
 */
@Data
public class ResponseBody {
    private String data;
    private Boolean success;
    private Integer errorCode;
    private String errorMsg;
    private Integer status;
    private Long timestamp;
}
```

### Count统计实体类——统计成功&失败次数

```java
import lombok.Data;
/**
 * @author VVulpes
 * @CreateDate 2024/5/9
 * @ProjectDetails [统计成功&失败次数实体类]
 */
@Data
public class Count {
    private Integer sn;//成功次数
    private Integer fn;//失败次数
}
```

## Controller控制器类

### DataController数据传输类——功能实现的主要代码文件

```java
/**
 * @author VVulpes
 * @CreateDate 2024/5/8
 * @ProjectDetails [测点注册信息同步接口:将表格内容打包成Json数据进行发送]
 */
@RestController
public class DataController {
    @PostMapping("/bridgeMonitorPointInfoSync")
    public Result PostJsonData (@RequestParam("file") MultipartFile file,@RequestParam("id")Integer pro_id) throws Exception{//传入表格文件与项目ID，转为Json数据发送至url的方法
        //file参数对应传入Excel表(且需要是.xlsx),pro_id是项目编号
        String fileName = "Log_"+file.getOriginalFilename();//最后导出的txt文件的名称
        try{
            //读取Excel的.xlsx文件
            InputStream inputStream = file.getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream);
			//读取Excel文件的第一张表
            Sheet sheet = workbook.getSheetAt(0);
            int rowLength = sheet.getLastRowNum()+1;//总行数
            int sn = 0;//成功次数
            int fn = 0;//失败次数
            List<String> list = new ArrayList<>();//失败记录，记录失败后返回的响应报文及失败行
            List<String> Jsonlist = new ArrayList<>();//最后要导出至txt中的内容，记录每一次的失败记录与对应的失败Json数据
            for(int i=2;i<rowLength;i++){
                Row row = sheet.getRow(i);//获取某行的数据

                    Count allcount = new Count();//count类记录每次发送后累积的成功与失败次数
                        allcount = postData(pro_id, row, sn, fn, i, list, Jsonlist);//调用方法，发送数据至指定url
                        sn = allcount.getSn();
                        fn = allcount.getFn();
            }
            int sum = sn + fn;//读取的表中检索到的总行数
            System.out.println("\n---------------------------------------------");
            System.out.println("检索到数据共<"+sum+">条,成功<"+ sn +">行,失败<"+fn+">行\n");
            if(fn>0) {//如果有失败记录，则输出txt文件
                System.out.println("失败记录:\n" + list + "\n");
                exportTxtFile(Jsonlist, fileName);//将报错的信息与数据打包至txt文件中
            }
        }catch (IOException e){
            e.printStackTrace();
        }
        return Result.success("数据注册结束");
    }

    private Count postData(Integer pro_id, Row row, int sn, int fn, int i, List<String> list, List<String> Jsonlist){//参数：项目ID、行数据、当前成功次数、当前失败次数、行、当前记录的所有失败记录、当前存储的所有最后要导出至txt的内容
        //将数据发送至url的主要方法
    try{
        Data data = new Data();

        Integer bridgeUniqueCode = getCellValue(row,0,Integer.class);
        Long pointUniqueCode = getCellValue(row, 1,Long.class);
        String pointCode = getCellValue(row, 2,String.class);
        String pointPosition = getCellValue(row, 3,String.class);
        String monitorCategory = getCellValue(row, 4,String.class);
        String monitorTypeCode = getCellValue(row, 5,String.class);
        Integer monitorContentCode = getCellValue(row, 6,Integer.class);
        String monitorContent = getCellValue(row, 7,String.class);
        Float bridgeInitValue = getCellValue(row, 8,Float.class);
        Float designValue = getCellValue(row, 9,Float.class);
        String sensorType = getCellValue(row, 10,String.class);
        String sensorBrand = getCellValue(row, 11,String.class);
        String sensorModel = getCellValue(row, 12,String.class);
        String collectorCode = getCellValue(row, 13,String.class);
        String collectorBrand = getCellValue(row, 14,String.class);
        String collectorModel = getCellValue(row, 15,String.class);
        Float samplingFrequence = getCellValue(row, 16,Float.class);
        float[] levelOneUpLimit = getCellValue(row, 17,float[].class);
        float[] levelOneDownLimit = getCellValue(row, 18,float[].class);
        float[] levelTwoUpLimit = getCellValue(row, 19,float[].class);
        float[] levelTwoDownLimit = getCellValue(row, 20,float[].class);
        float[] levelThreeUpLimit = getCellValue(row, 21,float[].class);
        float[] levelThreeDownLimit = getCellValue(row, 22,float[].class);
        int installDate = getCellValue(row, 23,Integer.class);//获取安装年份

        data.setBridgeUniqueCode(bridgeUniqueCode);
        data.setPointUniqueCode(pointUniqueCode);
        data.setPointCode(pointCode);
        data.setPointPosition(pointPosition);
        data.setMonitorCategory(monitorCategory);
        data.setMonitorTypeCode(monitorTypeCode);
        data.setMonitorContentCode(monitorContentCode);
        data.setMonitorContent(monitorContent);
        data.setBridgeInitValue(bridgeInitValue);
        data.setDesignValue(designValue);
        data.setSensorType(sensorType);
        data.setSensorBrand(sensorBrand);
        data.setSensorModel(sensorModel);
        data.setCollectorCode(collectorCode);
        data.setCollectorBrand(collectorBrand);
        data.setCollectorModel(collectorModel);
        data.setSamplingFrequence(samplingFrequence);
        data.setLevelOneUpLimit(levelOneUpLimit);
        data.setLevelOneDownLimit(levelOneDownLimit);
        data.setLevelTwoUpLimit(levelTwoUpLimit);
        data.setLevelTwoDownLimit(levelTwoDownLimit);
        data.setLevelThreeUpLimit(levelThreeUpLimit);
        data.setLevelThreeDownLimit(levelThreeDownLimit);
        data.setInstallDate(YearToTimestamp(installDate,pro_id));//将安装年份转为13位时间戳
		//根据项目编号，向对应的url发送数据
        HttpPost httpPost = new HttpPost("https://xxx.gov.cn:8888/POST_JSON_HTTP/?token=");// 替换为你的网址
        if(pro_id==2) {
            httpPost = new HttpPost("https://xxx.gov.cn:8888/POST_JSON_HTTP/?token=");// 替换为你的网址
        }else if(pro_id==3){
            httpPost = new HttpPost("https://xxx.gov.cn:8888/POST_JSON_HTTP/?token=");// 替换为你的网址
        }else if(pro_id==4) {
            httpPost = new HttpPost("https://xxx.gov.cn:8888/POST_JSON_HTTP/?token=");// 替换为你的网址
        }

        String JsonStr="\n{\"data\": ["+data.ExceltoJsonStr()+"]}";//最后向网站发送的Json格式

        CloseableHttpClient httpClient = HttpClients.createDefault();//创建Httpclient对象

        String jsonInputString = JsonStr;//要发送的Json字符串
        StringEntity entity = new StringEntity(jsonInputString, ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = httpClient.execute(httpPost);//response存储服务器响应
        System.out.print("服务器响应码: " + response.getStatusLine().getStatusCode());//200意味着成功连上服务器，但不代表数据成功注册了

        //获取网站应答报文
        String responseBody = EntityUtils.toString(response.getEntity());
        JSONObject jsonObject = JSONObject.parseObject(responseBody);

        ResponseBody Message = new ResponseBody();//自定义ResponseBody类存储应答报文数据
        Message.setData(jsonObject.getString("data"));
        Message.setSuccess(jsonObject.getBoolean("success"));
        Message.setErrorCode(jsonObject.getInteger("errorCode"));
        Message.setErrorMsg(jsonObject.getString("errorMsg"));
        Message.setStatus(jsonObject.getInteger("status"));
        Message.setTimestamp(jsonObject.getLong("timestamp"));

        Integer status = Message.getStatus();//获取应答报文中的响应码
        String errorMsg = Message.getErrorMsg();//获取应答报文中的报错信息
        // 检查应答报文
        int n=i+1;
        if(status==200){//如果应答报文返回200，才是真正的成功发送
            sn++;
            System.out.print(" 第"+ n +"行: "+ pointUniqueCode + " 状态码: " + status + " 注册成功！");
        }else{//如果应答报文不是200，则发送失败
            fn++;
            String Str = "\n失败行:" + n + ",数据:" + pointUniqueCode + "|-----报错信息:<" + errorMsg + ">-----|应答报文: " + responseBody ;
            list.add(Str);
            Jsonlist.add(Str);
            Jsonlist.add(JsonStr);
            System.out.print(" 第"+ n +"行: "+ pointUniqueCode + " 状态码: " + status + " 注册失败! ");
        }
        httpClient.close();

    }catch (IOException e){
        e.printStackTrace();
    }
        Count count = new Count();
        count.setFn(fn);//Count类存储失败记录
        count.setSn(sn);//Count类存储成功记录
        return count;//由于需要返回两个数据（成功、失败）才把该方法定义成Count，这样返回Count类的参数的时候，就能从外面的方法拿到两个数据
    }
}
```

## [示例代码]使用HttpURLConnection向某网址发送JSON数据

在Java中，你可以使用HttpURLConnection或者第三方库如Apache HttpClient来向某个网址发送JSON数据。

以下是使用HttpURLConnection的示例代码：

```java
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class HttpPostExample {
    public static void main(String[] args) {
        try {
            URL url = new URL("http://your-url.com"); // 替换为你的网址
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; utf-8");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);
            String jsonInputString = "{\"key1\":\"value1\",\"key2\":\"value2\"}"; // 替换为你的JSON数据
            try(OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonInputString.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            // 检查响应代码
            int responseCode = conn.getResponseCode();
            System.out.println("Response Code: " + responseCode);
            // 根据需要处理响应
            // ...
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

{{< admonition success "注意" >}}
HttpURLConnection应该也是能拿到网站返回的应答报文的，但是最后没找到，或者文章显示的太乱了，最后代码也没有调出来，这一块示例代码也是Chat-GPT给的，有条件的朋友可以自己再完善完善，欢迎在下面留言你的代码╰(*°▽°*)╯
{{< /admonition >}}


> 参考文章链接：
>
> 1. [**使用Java后台导入excel文件，读取数据后，更新数据库，并返回数据给到前端**](https://blog.csdn.net/weixin_43228155/article/details/117017197)
> 2. **[用Java实现将Excel表格数据转成Json格式数据](https://blog.csdn.net/weixin_43818651/article/details/102747602)**
> 3. **[java http返回值Result 工具类](https://www.cnblogs.com/zhangshiwen/p/12707461.html)**
> 4. *[Java、SpringBoot实现对Excel内容的读取并将Excel内容导入到数据库中](https://blog.csdn.net/weixin_57466771/article/details/134338250)*
> 5. *[对Excel内容读写，将Excel内容导入导出数据库](https://blog.csdn.net/weixin_51201930/article/details/123827779)*
> 6. *[读取大数据量excel并执行批量更新数据库操作](https://blog.csdn.net/u010964869/article/details/73916745)*
> 7. *[公共返回工具Result＜返回实体类＞](https://blog.csdn.net/weixin_51114236/article/details/118639827)*
> 8. *[Java读取excel表数据类型判断](https://blog.csdn.net/FUCCKL/article/details/86215712)*
> 9. *[POI-EXCEL导入导出工具](https://blog.csdn.net/Mr_Hellon/article/details/127426640)*
> 10. *[Excel文件解析方式](https://blog.csdn.net/m0_65467013/article/details/125764397)*
> 11. [**idea使用@data注解报红警告**](https://blog.51cto.com/u_15127590/4312161)
> 12. [**Parameter ‘xxx‘ not found错误**](https://blog.csdn.net/qq_51025538/article/details/121265866)
> 13. [**Required request part 'file' is not present**](https://www.cnblogs.com/tobycold/p/17867856.html)
> 14. *[文心一言](https://yiyan.baidu.com/welcome)*


