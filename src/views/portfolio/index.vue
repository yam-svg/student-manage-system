<template>
  <div class="app-container">
    <!--工具条-->
    <el-form ref="form" inline label-width="80px">
      <el-form-item label="选择班级">
        <el-select v-model="searchForm.class" placeholder="选择班级" size="mini" @change="getStudentList">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="选择学生">
        <el-select v-model="studentId" placeholder="选择一个学生" size="mini" @change="selectStudentInfo">
          <el-option
            v-for="item in studentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input v-model="searchForm.name" clearable size="mini" placeholder="学生姓名" @change="getStudentList" />
      </el-form-item>
    </el-form>
    <!--内容-->
    <el-descriptions
      v-if="studentInfo.id"
      class="margin-top"
      :title="studentInfo.name + ' - 个人信息'"
      :column="3"
      size="large"
      border
    >
      <template slot="extra">
        <el-button type="primary" size="mini" @click="exportPDF">导出PDF</el-button>
      </template>
      <el-descriptions-item label-style="height: 20px">
        <template slot="label">
          <i class="el-icon-user" />
          姓名
        </template>
        {{ studentInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item label-style="height: 20px">
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          手机号
        </template>
        {{ studentInfo.father_tel }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-apple" />
          头像
        </template>
        <el-image
          style="width: 100px; height: 100px"
          :src="studentInfo.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'"
          fit="cover"
        />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          性别
        </template>
        {{ studentInfo.sex }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets" />
          班级
        </template>
        <el-tag size="small">{{ className(studentInfo.class) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading" />
          备注
        </template>
        <el-tag size="small">{{ remark(studentInfo.remark) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-reading" />
          年龄
        </template>
        {{ age(studentInfo.id_number) }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          居住地
        </template>
        {{ studentInfo.address.split(' ')[0] }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building" />
          联系地址
        </template>
        {{ studentInfo.address }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-refrigerator" />
          身份证
        </template>
        {{ studentInfo.id_number }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-rank" />
          监护人
        </template>
        {{ studentInfo.father_name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-refresh" />
          入学时间
        </template>
        {{ createTime(studentInfo.create_time) }}
      </el-descriptions-item>
    </el-descriptions>
    <!--成绩-->
    <el-descriptions
      v-if="studentInfo.id"
      class="margin-top score-list"
      style="margin-top: 20px"
      title="各科平均分"
      direction="vertical"
      :column="11"
      size="large"
      border
    >
      <el-descriptions-item v-for="item in scoreList" :key="item.id" :span="item.id === scoreList.length ? 2 : 1">
        <template slot="label">
          <div class="score-list">
            <i class="el-icon-edit" />
            {{ item.name }}
          </div>
        </template>
        <div class="score-list">
          {{ item.score }}
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import studentApi from '@/api/student'
import { getStudentScore } from '@/api/course'
import dayjs from 'dayjs'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'Portfolio',
  data() {
    return {
      // 搜索条件
      searchForm: {
        class: 2,
        name: ''
      },
      // 学生列表
      studentList: [],
      // 选择的学生
      studentId: null,
      studentInfo: { id: null },
      // 成绩
      scoreList: []
    }
  },
  computed: {
    ...mapState('classL', ['classList']),
    // 计算班级
    className() {
      return (id) => {
        const item = this.classList.find(item => item.id === id)
        return item ? item.name : ''
      }
    },
    // 计算备注
    remark() {
      return (id) => {
        if (id === 0) return '正常'
        if (id === 1) return '低收入'
        if (id === 2) return '低保户'
      }
    },
    // 入学时间
    createTime() {
      return (time) => {
        return dayjs(time).format('YYYY-MM-DD')
      }
    },
    // 获得班级的学生数量
    studentNum() {
      return (id) => {
        const item = this.classList.find(item => item.id === id)
        return item ? item.student : 0
      }
    },
    // 计算年龄
    age() {
      return (id) => {
        const year = id.substr(6, 4)
        const month = id.substr(10, 2)
        const day = id.substr(12, 2)
        const birthday = year + '-' + month + '-' + day
        return dayjs().diff(birthday, 'year')
      }
    }
  },
  mounted() {
    this.$store.dispatch('classL/getClassList')
    // 测试
    this.getStudentList()
    setTimeout(() => {
      this.selectStudentInfo()
    }, 500)
  },
  methods: {
    // 获取学生列表
    getStudentList() {
      // 先清空
      this.studentList = []
      this.studentInfo = { id: null }
      this.scoreList = []
      this.studentId = null
      // 搜索条件
      const params = {
        status: 0,
        page: 1,
        // pageSize: this.studentNum(this.searchForm.class)

        // 测试
        pageSize: 99
      }
      studentApi.getStudentList(params, this.searchForm).then(res => {
        this.studentList = res.data
        // 如果只有一个学生，直接选择
        if (this.searchForm.name && this.studentList.length === 1) {
          this.studentInfo = this.studentList[0]
        }
      })
    },
    // 选择学生
    selectStudentInfo() {
      // 测试
      // this.studentId = 506

      this.studentInfo = this.studentList.find(item => item.id === this.studentId)
      this.getStudentScore()
    },
    // 获取学生成绩
    getStudentScore() {
      getStudentScore(this.studentInfo.id).then(res => {
        this.scoreList = res.data
      })
    },
    // 导出PDF
    exportPDF() {
      // 显示进度条
      const loading = this.$loading({
        lock: true,
        text: '正在导出PDF',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      this.$message({ message: '功能持续完善中', type: 'success' })
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      // 中文字题
      const fontFile = require('@/assets/simsun.ttf')
      const font = new FontFace('SimSun', `url(${fontFile})`)
      font.load().then(() => {
        // 加载字体
        doc.addFont(fontFile, 'SimSun', 'normal')
        doc.setFont('SimSun', 'normal')
        // 个人信息居中大号显示
        doc.setFontSize(30)
        const title = '个人信息'
        const titleWidth = doc.getTextWidth(title)
        // 页面宽度 和 高度
        const pageWidth = doc.internal.pageSize.width
        // const pageHeight = doc.internal.pageSize.height
        const titleX = (pageWidth - titleWidth) / 2
        doc.text('个人信息', titleX, 20)

        const tableX = 20
        const tableY = 20
        // const tableWidth = 130
        // const colCount = 6
        // const rowCount = 5
        // 单元格宽度和高度
        // const cellWidth = 20
        const cellHeight = 10

        doc.setFontSize(12)
        // 表格数据说明 每一行可分配 130 + 40(头像) = 170  边缘部分 15
        // 第一行表格
        doc.rect(tableX, tableY + cellHeight, 20, cellHeight, 'S')
        doc.rect(tableX + 20, tableY + cellHeight, 30, cellHeight, 'S')
        doc.rect(tableX + 50, tableY + cellHeight, 20, cellHeight, 'S')
        doc.rect(tableX + 70, tableY + cellHeight, 20, cellHeight, 'S')
        doc.rect(tableX + 90, tableY + cellHeight, 20, cellHeight, 'S')
        doc.rect(tableX + 110, tableY + cellHeight, 20, cellHeight, 'S')
        // 第一行数据 姓名 性别 年龄
        doc.text('姓名', tableX + 5, tableY + cellHeight + 7)
        doc.text(this.studentInfo.name, tableX + 20 + 8, tableY + cellHeight + 7)
        doc.text('性别', tableX + 50 + 5, tableY + cellHeight + 7)
        doc.text(this.studentInfo.sex, tableX + 70 + 8, tableY + cellHeight + 7)
        doc.text('年龄', tableX + 90 + 5, tableY + cellHeight + 7)
        doc.text(this.age(this.studentInfo.id_number).toString(), tableX + 110 + 6, tableY + cellHeight + 7)

        // 第二行表格 电话 班级 备注
        doc.rect(tableX, tableY + cellHeight * 2, 20, cellHeight, 'S')
        doc.rect(tableX + 20, tableY + cellHeight * 2, 30, cellHeight, 'S')
        doc.rect(tableX + 50, tableY + cellHeight * 2, 20, cellHeight, 'S')
        doc.rect(tableX + 70, tableY + cellHeight * 2, 20, cellHeight, 'S')
        doc.rect(tableX + 90, tableY + cellHeight * 2, 20, cellHeight, 'S')
        doc.rect(tableX + 110, tableY + cellHeight * 2, 20, cellHeight, 'S')
        // 第二行数据
        doc.text('电话', tableX + 5, tableY + cellHeight * 2 + 7)
        doc.text(this.studentInfo.father_tel.toString(), tableX + 20 + 3, tableY + cellHeight * 2 + 7)
        doc.text('班级', tableX + 50 + 5, tableY + cellHeight * 2 + 7)
        doc.text(this.className(this.studentInfo.class), tableX + 70 + 5, tableY + cellHeight * 2 + 7)
        doc.text('备注', tableX + 90 + 5, tableY + cellHeight * 2 + 7)
        doc.text(this.remark(this.studentInfo.remark), tableX + 110 + 3, tableY + cellHeight * 2 + 7)

        // 第三行表格 居住地 身份证
        doc.rect(tableX, tableY + cellHeight * 3, 20, cellHeight, 'S')
        doc.rect(tableX + 20, tableY + cellHeight * 3, 40, cellHeight, 'S')
        doc.rect(tableX + 60, tableY + cellHeight * 3, 20, cellHeight, 'S')
        doc.rect(tableX + 80, tableY + cellHeight * 3, 50, cellHeight, 'S')
        // 第三行数据
        doc.text('居住地', tableX + 3, tableY + cellHeight * 3 + 7)
        doc.text(this.studentInfo.address.split(' ')[0], tableX + 20 + 11, tableY + cellHeight * 3 + 7)
        doc.text('身份证', tableX + 60 + 3, tableY + cellHeight * 3 + 7)
        doc.text(this.studentInfo.id_number.toString(), tableX + 80 + 5, tableY + cellHeight * 3 + 7)

        // 第四行表格 监护人 入学时间
        doc.rect(tableX, tableY + cellHeight * 4, 20, cellHeight, 'S')
        doc.rect(tableX + 20, tableY + cellHeight * 4, 40, cellHeight, 'S')
        doc.rect(tableX + 60, tableY + cellHeight * 4, 20, cellHeight, 'S')
        doc.rect(tableX + 80, tableY + cellHeight * 4, 50, cellHeight, 'S')
        // 第四行数据
        doc.text('监护人', tableX + 3, tableY + cellHeight * 4 + 7)
        doc.text(this.studentInfo.father_name, tableX + 20 + 13, tableY + cellHeight * 4 + 7)
        doc.text('入学时间', tableX + 60 + 1, tableY + cellHeight * 4 + 7)
        doc.text(this.createTime(this.studentInfo.create_time).toString(), tableX + 80 + 12, tableY + cellHeight * 4 + 7)

        // 第五行表格 家庭地址
        doc.rect(tableX, tableY + cellHeight * 5, 35, cellHeight, 'S')
        doc.rect(tableX + 35, tableY + cellHeight * 5, 135, cellHeight, 'S')
        // 第五行数据
        doc.text('家庭地址', tableX + 8, tableY + cellHeight * 5 + 7)
        doc.text(this.studentInfo.address, tableX + 35 + 25, tableY + cellHeight * 5 + 7)

        // 右上角 学生照片
        const photoX = tableX + 130 // 20 + 130
        const photoY = 30
        const photoWidth = 38
        const photoHeight = 38
        // 画出头像边框
        doc.rect(photoX, photoY, 40, 40, 'S')
        // 获取图片
        const img = new Image()
        const defaultImg = require('@/assets/1.jpg')
        img.crossOrigin = 'anonymous'
        img.src = this.studentInfo.avatar || defaultImg
        img.onload = function() {
          doc.addImage(this, 'JPEG', photoX + 0.5, photoY + 0.5, photoWidth, photoHeight)
          doc.save('学生信息.pdf')
          // 关闭加载
          loading.close()
        }
      })
    }
  }
}
</script>

<style scoped>
.score-list {
  /*  居中显示*/
  text-align: center;
}
</style>
