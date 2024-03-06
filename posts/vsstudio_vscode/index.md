# 在VS code中打开VS studio的cpp文件并调试运行（弹出独立窗口）


在电脑上复现以前的C++项目的时候，自觉VS studio太繁重，准备重新拿VS code编译，没想到还是有很多地方需要注意的，在这里记录一下。

## 安装扩展

为了编译打开C++文件，需要在VS code上面先安装一些拓展，如下图：

![安装的扩展](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240306/VSCODE4.19r4f0j3lfmo.webp)

<!--more-->

## 安装gcc编译器MinGW

进入MinGW官网

```
https://winlibs.com/
```

下载对应的zip安装包，win10的64位下载版本如下：

![下载MinGW的zip包](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/VSCODE7.8dwm1dfdc4.webp)

下载后解压缩，进入对应的bin目录

![打开MinGW目录](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/VSCODE8.7p3chcruc1.webp)

在目录栏里面输入`cmd`后回车打开目录下终端，输入代码

```shell
g++ --version
```

能弹出下图的信息说明安装成功

![输入指令显示信息](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/VSCODE9.41xsttw1uh.webp)

## 配置MinGW至环境变量

右键此电脑，选择属性，在弹出的设置窗口中下拉，选择高级系统设置。

点击环境变量，选中系统变量中的Path，点击编辑。

在弹出的编辑环境变量窗口中，点击新建按钮，将上面打开的bin路径复制到里面，然后逐一进行确定保存。

![配置环境变量](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/picx-images-hosting@master/VSCODE10.9gwbc9b78b.webp)

## 重命名cpp

由于VS studio里面的cpp是可以用中文命名的，到VS code里面会编译错误，所以需要重新命名一下，这里随便用英文命名就行了。

![重命名cpp文件](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240306/VSCODE6.3cvfpsp98qk0.webp)

{{< admonition example "注意">}}

如果打开的cpp中有中文变成乱码了，可以尝试将编码进行修改，过程如下图

![点击底边栏编码按钮弹出选择窗口](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240306/VSCODE1.2ureooo0gy80.webp)

![修改编码](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240306/VSCODE2.184mt0b16c4.webp)

{{< /admonition >}}

## 创建launch.json

第一次试调试运行之后会出现`.vscode`的文件（有什么报错都先点掉），在这里面创建`launch.json`。

注意下文`"cwd": "D:\\Environment\\MinGW\\mingw64\\bin",`和`"miDebuggerPath": "D:\\Environment\\MinGW\\mingw64\\bin\\gdb.exe",`的地方改成自己的路径。

```json
{
    "version": "0.2.0",
    "configurations": [
    
        {
            "name": "编译",
            "type": "cppvsdbg",
            "request": "launch",
            "program": "cmd",
            "args": [
                "/C"
            ],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "console": "internalConsole",
            "internalConsoleOptions": "neverOpen",
            "preLaunchTask": "C/C++: g++.exe 生成活动文件"
        },
        {
            "name": "编译并执行",
            "type": "cppvsdbg",
            "request": "launch",
            "program": "cmd",
            "args": [
                "/C",
                "${fileDirname}/${fileBasenameNoExtension}.exe"
            ],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "console": "externalTerminal",
            "preLaunchTask": "C/C++: g++.exe 生成活动文件"
        },
        {
            "name": "Debug",
            "type": "cppdbg",
            "request": "launch",
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "D:\\Environment\\MinGW\\mingw64\\bin",
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "miDebuggerPath": "D:\\Environment\\MinGW\\mingw64\\bin\\gdb.exe",
            "setupCommands": [
                {
                    "description": "为 gdb 启用整齐打印",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "将反汇编风格设置为 Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "C/C++: g++.exe 生成活动文件"
        }
    ]
}
```

## 创建tasks.json

在同一位置下，创建**tasks.json**。

注意下文`"command": "d:\\Environment\\MinGW\\mingw64\\bin\\g++.exe",`和`"cwd": "d:\\Environment\\MinGW\\mingw64\\bin"`的地方改成自己的路径。

```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: g++.exe 生成活动文件",
            "command": "d:\\Environment\\MinGW\\mingw64\\bin\\g++.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe",
                "-fexec-charset=utf-8"
            ],
            "options": {
                "cwd": "d:\\Environment\\MinGW\\mingw64\\bin"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        }
    ],
    "version": "2.0.0"
}
```

{{< admonition example "注意">}}

如果调试运行之后弹出来的窗口中有中文变成乱码了，可以尝试将`"-fexec-charset=utf-8"`里面的`utf-8`编码进行修改

{{< /admonition >}}

这些都搞好了之后，就可以调试运行了。

![运行弹出独立窗口](https://cdn.jsdelivr.net/gh/B1ANKC-MOV/HttpImg@master/20240306/VSCODE5.5ep2tqxh1ww0.webp)

> 参考文章链接：
>
> 1. *[VSCode配置C++环境——弹出黑窗运行和断点调试程序_vscode运行c语言如何弹出运行窗口](https://blog.csdn.net/m0_60679171/article/details/129671758?spm=1001.2014.3001.5506)*
> 2. *[VSCode运行CPP单文件_vscode 运行cpp](https://blog.csdn.net/weixin_44736530/article/details/123233446)*
