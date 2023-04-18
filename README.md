### 可进入 http://fanshu.xyz 在线访问本项目
***
### 版权声明
严禁将本项目用于毕业设计！
### 1.项目介绍
项目介绍：本项目主要有数据总览，学生管理，成绩管理，班级管理，教师管理，疫情管理，系统设置模块。
本项目是毕业设计项目，首页设置数据可视化和学生位置分布大地图的展示，学生、成绩信息可通过Excel灵活导出，此外还设置了疫情管理模块、IP 登录信息，使项目更接近于实际
### 2.技术路线
前端部分采取VUE + Element-UI进行项目的搭建和页面的设计，使用vue-admin-template后台管理模板，采取Axios与后端进行对接，进行数据的传输；后端则采用NodeJS + Express进行接口开发，MySql作为数据库存储数据。
### 3.首页 - 数据总览
设置各班级人数、男女比例、系统近七天登录次数，各省市学生人数分布的可视化图表展示，分别采用柱状图、饼图、折线图和中国大地图展示
### 4.学生管理
分为学生列表、添加学生、毕业学生、误删恢复功能，其中学生列表以分页的形式展示学生的基本信息，包括姓名、性别、年龄、联系电话等，也可在列表中对其进行操作。还可根据需求对学生进行班级、姓名、入学时间的筛选，也可对学生通过Excel的方式批量的导入和导出
### 5.成绩管理
分为成绩列表、成绩录入、考试管理功能，成绩列表根据选择的班级和考试批次进行展示，可将成绩进行Excel的导出；成绩录入功能则将对应学生的分数进行上传，也可导出空白成绩册，考试管理则对考试批次进行修改和添加
### 6.班级管理
对班级进行命名、班主任设置、编辑和删除等功能
### 7.教师管理
可管理教师的姓名、年龄、邮箱等信息，也可添加或开除教师等操作
### 8.疫情管理
在本系统中，将疫情管理作为额外的功能添加到本系统中，该功能是对班级学生进行健康码、行程码、核酸检测、是否在校、离校去向等情况进行记录，达到管理学生的身体健康情况的目的，此外还可通过条件对学生进行筛选
### 9.学生档案
此功能对学生的个人信息进行详细的展示和数据分析，主要包括学生的个人信息如姓名、性别、班级、监护人、联系地址等进行展示，还有最新考试成绩的展示，包括本次考试的平均分和总分，然后是对数据进行分析，包括同省市的人数、科目的优秀，中等以及不及格的科目数的展示，成绩散点图和成绩排名的展示。分别以柱状图、饼图、散点图、进度条的形式进行数据可视化展示。在此功能中，还设置了对学生各项信息和数据的PDF导出，以PDF的形式导出个人信息，在该PDF中有对学生数据的详细分析
### 10.系统设置
系统设置，可修改管理员密码、更换绑定的邮箱、查看系统的IP登陆记录等功能
### 11.项目启动
1.克隆项目到本地并安装依赖
```
npm i
```
2.启动项目
```
npm run dev
```
### 12.接口说明
将项目克隆到本地后, 需要修改.env.development文件中的VUE_APP_BASE_API为后端接口地址
将原文件中
```
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://127.0.0.1:8080'
# VUE_APP_BASE_API = 'http://fanshu.xyz:8080'
```
修改为
```
# just a flag
ENV = 'development'

# base api
# VUE_APP_BASE_API = 'http://127.0.0.1:8080'
VUE_APP_BASE_API = 'http://fanshu.xyz:8080'
```
即可使项目连接到服务器的后端接口
### 13.常见问题
1.项目启动中如有以下报错(没有报错则无需修改)：
```
This relative module was not found:

* ./cptable in ./node_modules/xlsx-style/dist/cpexcel.js
```
解决方法：
```
这个是前端 vue 中的 Excel 文件导出时用到的

程序启动的时候出现错误，显示：not found ./cptable in node_modules/xlsx-style/dist/cpexcel.js
这个不是程序的问题，而是，在该文件目录下面，有段程序写错了，

找到./node_modules/xlsx-style/dist/cpexcel.js，第807行，var cpt = require(’./cpt’ + ‘able’);有误，

改成 var cpt = cptable; 就可以正确启动程序了
```
2.项目中的百度地图做了限制，只能在本域名下使用，如需在其它地方使用，请自行申请并替换public/index.html中的百度地图密钥

3.如果因为安装依赖问题导致项目启动失败, 请检查node版本, 本项目使用的是node v16

#### 如有疑问, 可在留言至gitee