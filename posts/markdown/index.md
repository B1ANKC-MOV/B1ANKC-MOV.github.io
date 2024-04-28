# [汇总]Markdown用法&Admonition横幅样式收集


日常使用Markdown编辑文章时，有些技巧和语法非常便捷实用，LoveIt主题自带的admonition横幅也很好用，就是格式太多了，两者在此文汇总方便随取随用。

<!--more-->

---

# Admonition横幅

`admonition` shortcode 支持 **12** 种 帮助你在页面中插入提示的横幅，有以下命名参数:

- **type** *[可选]* (**第一个**位置参数)

  `admonition` 横幅的类型, 默认值是 `note`

- **title** *[可选]* (**第二个**位置参数)

  `admonition` 横幅的标题, 默认值是 **type** 参数的值.

- **open** *[可选]* (**第三个**位置参数) 

  横幅内容是否默认展开, 默认值是 `true`

一个 `admonition` 示例:

```markdown
{{</* admonition type=tip title="This is a tip" open=false */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
或者
{{</* admonition tip "This is a tip" false */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}
```

呈现的输出效果如下:

{{< admonition tip "This is a tip" false >}}
一个 **技巧** 横幅
{{< /admonition >}}

## admonition样式

**12** 种横幅的默认样式（代码）如下：

```shell
{{</* admonition */>}}
一个 **注意** 横幅
{{</* /admonition */>}}

{{</* admonition abstract */>}}
一个 **摘要** 横幅
{{</* /admonition */>}}

{{</* admonition info */>}}
一个 **信息** 横幅
{{</* /admonition */>}}

{{</* admonition tip */>}}
一个 **技巧** 横幅
{{</* /admonition */>}}

{{</* admonition success */>}}
一个 **成功** 横幅
{{</* /admonition */>}}

{{</* admonition question */>}}
一个 **问题** 横幅
{{</* /admonition */>}}

{{</* admonition warning */>}}
一个 **警告** 横幅
{{</* /admonition */>}}

{{</* admonition failure */>}}
一个 **失败** 横幅
{{</* /admonition */>}}

{{</* admonition danger */>}}
一个 **危险** 横幅
{{</* /admonition */>}}

{{</* admonition bug */>}}
一个 **Bug** 横幅
{{</* /admonition */>}}

{{</* admonition example */>}}
一个 **示例** 横幅
{{</* /admonition */>}}

{{</* admonition quote */>}}
一个 **引用** 横幅
{{</* /admonition */>}}

## 注意：除第一个横幅
## 其他横幅都默认加了"" false
## 例如，{{</* admonition abstract "" false */>}}
## 从而在下面展示中呈现默认收起状态
## 而且需要注意的是，如果i18n没有配置好，横幅默认展示的头文字会是英文
```

效果如下：

{{< admonition>}}
一个 **注意** 横幅
{{< /admonition >}}

{{< admonition abstract "" false>}}
一个 **摘要** 横幅
{{< /admonition >}}

{{< admonition info "" false>}}
一个 **信息** 横幅
{{< /admonition >}}

{{< admonition tip "" false>}}
一个 **技巧** 横幅
{{< /admonition >}}

{{< admonition success "" false>}}
一个 **成功** 横幅
{{< /admonition >}}

{{< admonition question "" false>}}
一个 **问题** 横幅
{{< /admonition >}}

{{< admonition warning "" false>}}
一个 **警告** 横幅
{{< /admonition >}}

{{< admonition failure "" false>}}
一个 **失败** 横幅
{{< /admonition >}}

{{< admonition danger "" false>}}
一个 **危险** 横幅
{{< /admonition >}}

{{< admonition bug "" false>}}
一个 **Bug** 横幅
{{< /admonition >}}

{{< admonition example "" false>}}
一个 **示例** 横幅
{{< /admonition>}}

{{< admonition quote "" false>}}
一个 **引用** 横幅
{{< /admonition >}}



# Markdown语法

## 水平线

`---`:

---

`___`:

___

`***`：

***

## 强调

### 粗体

`**粗体**`:**粗体**

`__粗体__`:__粗体__

### 斜体

`*斜体*`:*斜体*

`_斜体_`:_斜体_

### 删除线

`~~删除线~~`:~~删除线~~

## 引用

在要引用的任何文本之前添加 `>`:

> 引用大概会在章末写参考文章链接的时候用到
>
> > 引用也可以嵌套

## 列表

### 无序列表

`* 列表`:

* 列表

`- 列表`:

- 列表

`+ 列表`:

+ 列表

---

```shell
- 列表
	- 列表
		- 列表
# 虽然在我自己的md编辑器里面多级列表是会显示不一样的样式的，例如●→○→■
# 但LoveIt主题的网页似乎并没有在这方面进行渲染↓
```

- 列表
	- 列表
		- 列表

### 有序列表

数字+`.`+空格，接着后面加文字就形成有序列表了，回车列表会自动加一，例如下面的输入

```markdown
1. 列表Ⅰ
2. 列表Ⅱ
3. 列表Ⅲ
4. 列表Ⅳ
5. 列表Ⅴ
```

最后网页呈现是这样的：

1. 列表Ⅰ
2. 列表Ⅱ
3. 列表Ⅲ
4. 列表Ⅳ
5. 列表Ⅴ

### 任务列表

任务列表使你可以创建带有复选框的列表

要创建任务列表, 请在任务列表项之前添加破折号 (`-`) 和带有空格的方括号 (`[ ]`)  

要选择一个复选框，请在方括号之间添加 x (`[x]`)

简单来说就是勾选框的渲染，这个日常记事也蛮好用的

~~就是LoveIt网页渲染的时候怎么前面老加个点，我的md编辑器里面是很干净的复选框~~

`- [ ] 任务列表`:

- [ ] 任务列表

`- [x] 任务列表`:

- [x] 任务列表

## 代码

### 行内代码

用<kbd>`</kbd> 包装行内代码段.

```markdown
在这个例子中, `<section></section>` 会被包裹成代码
```

呈现的输出效果如下:

在这个例子中, `<section></section>` 会被包裹成代码

### 缩进代码

将几行代码缩进至少四个空格，例如:

```markdown
    // 只需要在一行代码的第一个字符前面打四个及以上的空格
    line 1 of code
    line 2 of code
    line 3 of code
```

呈现的效果如下:

    // 只需要在一行代码的第一个字符前面打四个及以上的空格
    line 1 of code
    line 2 of code
    line 3 of code

### 围栏代码块

使用 “围栏” <kbd>```</kbd> 来生成一段带有语言属性的代码块

```
​```markdown
Sample text here...
​```
```

呈现的效果如下:

```markdown
Sample text here...
```

## 表格

通过在每个单元格之间添加竖线作为分隔线

并在标题下添加一行破折号 (也由竖线分隔) 来创建表格

PS: 竖线不需要垂直对齐

```markdown
| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
```

呈现的输出效果如下:

| Option | Description                                                  |
| ------ | ------------------------------------------------------------ |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files.                         |

---

**文本右对齐或居中对齐**

在任何标题下方的破折号**右侧添加冒号**将使该列的文本**右对齐**

在任何标题下方的破折号**两边添加冒号**将使该列的对齐文本**居中**

```
| Option | Description |
|:------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |
```

呈现的输出效果如下:

| Option |                                                  Description |
| :----: | -----------------------------------------------------------: |
|  data  | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
|  ext   |                         extension to be used for dest files. |

## 链接

### 基本链接

`<https://github.com/B1ANKC-MOV>`:<https://github.com/B1ANKC-MOV>

`<VVulpes@163.com>`:<VVulpes@163.com>

`[VVulpes · GitHub](https://github.com/B1ANKC-MOV)`:[VVulpes · GitHub](https://github.com/B1ANKC-MOV)

**添加一个标题**

```markdown
[VVulpes·Github](https://github.com/B1ANKC-MOV "欢迎访问我的Github!")
```

呈现的输出效果如下 (将鼠标悬停在链接上，会有一行提示):

[VVulpes的Github](https://github.com/B1ANKC-MOV "欢迎访问我的Github!")

### 定位标记

定位标记使你可以跳至同一页面上的指定锚点. 例如, 每个章节:

```markdown
   [表格](#表格)
   [链接](#链接)
   [基本链接](#基本链接)
   [定位标记](#定位标记)
```

呈现的效果如下：

   [表格](#表格)  
   [链接](#链接)  
   [基本链接](#基本链接)  
   [定位标记](#定位标记)    

## 脚注

要创建脚注引用, 请在**方括号**中添加插入符号和标识符 (`[^1]`)  
标识符可以是**数字或单词**, 但**不能包含空格或制表符**  
在中括号内使用插入符号和数字以及用冒号和文本来添加脚注内容 ：(`[^1]：这是一段脚注`)

标识符仅将脚注引用与脚注本身相关联  且  在脚注输出（它会自动生成）中, 脚注按顺序编号


你不一定要在文档末尾添加脚注，可以将它们放在除列表, 引用和表格等元素之外的任何位置

```markdown
这是一个数字脚注[^1].
这是一个带标签的脚注[^label]

[^1]: 这是一个数字脚注
[^label]: 这是一个带标签的脚注
```

这是一个数字脚注[^1]   
这是一个带标签的脚注[^label]



[^1]: 这是一个数字脚注
[^label]: 这是一个带标签的脚注

## 图片

图片的语法与链接相似, 但包含一个在前面的感叹号

`![fox](https://b1ankc-mov.github.io/fox.png)`:![fox](https://b1ankc-mov.github.io/fox.png)

---

`![fox](https://b1ankc-mov.github.io/fox.png "What does the fox say?")`:![fox](https://b1ankc-mov.github.io/fox.png "What does the fox say?")

---

像链接一样, 图片也具有脚注样式的语法：`![Fox][id]`

![Fox][id]

然后在文档中随便一个位置提供参考内容, 用来定义 URL 即可：`[id]: https://b1ankc-mov.github.io/fox.png  "Title"`

[id]: https://b1ankc-mov.github.io/fox.png  "Title"

> 参考文章链接
>
> 1. *[Markdown 基本语法 - LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/basic-markdown-syntax/)*
> 2. *[主题文档 - 扩展 Shortcodes - LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/theme-documentation-extended-shortcodes/#4-admonition)*
> 3. *[Hugo系列(3.0) - LoveIt主题美化与博客功能增强 · 第一章 - Yulin Lewis' Blog (lewky.cn)](https://lewky.cn/posts/hugo-3.html/)*
