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
      <el-form-item label="批量选择">
        <el-button :disabled="studentList.length === 0" type="primary" size="mini" @click="dialogVisible = true">选择学生</el-button>
      </el-form-item>
      <el-form-item v-if="studentInfo.id" style="float: right">
        <el-avatar :size="65" shape="square" :src="studentInfo.avatar" />
      </el-form-item>
    </el-form>
    <!--内容-->
    <el-descriptions
      v-if="studentInfo.id"
      class="margin-top"
      style="margin-top: 40px"
      :title="studentInfo.name + ' - 个人信息'"
      :column="3"
      size="large"
      border
    >
      <template slot="extra">
        <el-button type="warning" size="mini" @click="exportPDF('default')">导出PDF</el-button>
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
        右上角
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
      title="最新考试成绩"
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
    <!--数据分析-->
    <el-descriptions
      v-if="studentInfo.id"
      class="margin-top score-list"
      style="margin-top: 20px"
      title="数据分析"
      direction="vertical"
      size="large"
      :colon="false"
      border
    >
      <el-descriptions-item label-style="width: 45%">
        <template slot="label">
          <div class="score-list">
            同省市人数
          </div>
        </template>
        <div class="chart-pos">
          <barChart
            ref="barChart"
            :province-list="provinceList"
            :address="studentInfo.address.split(' ')[0]"
            @getChart="getChart"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item label-style="width: 55%">
        <template slot="label">
          <div class="score-list">
            成绩分析
          </div>
        </template>
        <div class="chart-pos">
          <pieChart ref="pieChart" style="width: 40%" :score-list="scoreList" @getChart="getChart" />
          <scatterChart ref="scatterChart" style="width: 35%" :score-list="scoreList" @getChart="getChart" />
          <rankChart
            ref="rankChart"
            style="width: 25%"
            :student-info="studentInfo"
            :total="studentList.length"
            @getChart="getChart"
          />
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <!--选择导出的学生-->
    <el-dialog
      title="选择导出的学生"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;" />
      <el-checkbox-group v-model="selectExportList" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="s in studentList" :key="s.id" :label="s">{{ s.name }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createZip">确 定</el-button>
      </span>
    </el-dialog>
    <!--进度条对话框-->
    <el-dialog
      title="PDF批量导出中,请稍后..."
      :visible.sync="centerDialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      center
    >
      <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" status="success" />
      <span slot="footer" class="dialog-footer">
        <span style="font-size: 12px; color: gray">请保持前台不要切换页面，速度取决于计算机的性能</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import studentApi from '@/api/student'
import { getStudentRank, getStudentScore } from '@/api/course'
import dayjs from 'dayjs'
import JSPDF from 'jspdf'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import 'jspdf-autotable'
import barChart from './barChart/index'
import pieChart from '@/views/portfolio/pieChart'
import rankChart from '@/views/portfolio/rankChart'
import scatterChart from '@/views/portfolio/scatterChart'
import _ from 'lodash'

export default {
  name: 'Portfolio',
  components: { barChart, pieChart, rankChart, scatterChart },
  data() {
    return {
      // 搜索条件
      searchForm: {
        class: null,
        name: ''
      },
      // 学生列表
      studentList: [],
      // 选择的学生
      studentId: null,
      studentInfo: { id: null },
      // 选择导出PDF的学生列表
      selectExportList: [],
      // 成绩
      scoreList: [],
      // 省份数据 用于pdf数据分析
      provinceList: [],
      // 图表数据 保存子组件的echarts图像,用于pdf导出
      barChart: null,
      pieChart: null,
      scatterChart: null,
      rankChart: null,
      // pdf对象
      pdf: null,
      // loading
      loading: null,
      centerDialogVisible: false,
      dialogVisible: false,
      // 进度掉的进度
      progress: 0,
      isIndeterminate: false,
      checkAll: false
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
    // 本校学生数量
    schoolStudentNum() {
      return this.classList.reduce((total, item) => {
        return total + item.student
      }, 0)
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
    },
    // 有几个人是相同省份的
    provinceNum() {
      let pos = this.studentInfo.address.split(' ')[0]
      // 由于数据原因 天津 重庆 北京 上海 要转为 天津市 重庆市 北京市 上海市
      if (pos === '天津') {
        pos = '天津市'
      }
      if (pos === '重庆') {
        pos = '重庆市'
      }
      if (pos === '北京') {
        pos = '北京市'
      }
      if (pos === '上海') {
        pos = '上海市'
      }
      const num = this.provinceList.find(item => item.name === pos).value
      return `1、你来自${pos}，全校有${num - 1}个同学与你同一个省、市、区。`
    },
    // 根据成绩计算标准差 表示成绩的波动性 公式为：方差=∑(x-平均分)^2/n n为总数 x为每科的成绩 值越小表示成绩越稳定
    variance() {
      const avg = this.scoreList[this.scoreList.length - 2].score
      const courseScore = _.cloneDeep(this.scoreList.slice(0, this.scoreList.length - 2))
      const variance = courseScore.reduce((total, item) => {
        return total + Math.pow(item.score - avg, 2)
      }, 0) / courseScore.length
      // 标准差
      const standardDeviation = Math.sqrt(variance)
      return standardDeviation.toFixed(2)
    },
    // 数据分析内容
    dataAnalysis() {
      const rate = ((this.studentList.length) / this.schoolStudentNum * 100).toFixed(2)
      const str1 = `2、本校共有${this.schoolStudentNum}名学生，其中有${this.studentList.length - 1}名是你的同班同学，你们班级的人数占全校${rate}%。`
      // 前10%为优秀， 10%-30%为良好， 30%-50%为中等， 50%-70%为中等偏下， 70%以上为靠后
      const pos = {
        1: '优秀',
        2: '良好',
        3: '中等',
        4: '中等偏下',
        5: '靠后'
      }
      // Math.ceil 向上取整
      const rank = Math.ceil(this.studentInfo.rank / this.studentList.length * 5)
      // 不及格和90分以上的科目数
      const fail = this.scoreList.filter(item => {
        if (item.score < 60 && item.name !== '平均分' && item.name !== '总分') {
          return item
        }
      }).length
      const good = this.scoreList.filter(item => {
        if (item.score >= 90 && item.name !== '平均分' && item.name !== '总分') {
          return item
        }
      }).length
      const str2 = `3、在本次考试中，共参加了${this.scoreList.length - 2}科考试，有${fail}科不及格，${good}科达到90分及以上，你的平均分`
      const average = this.scoreList.find(item => item.name === '平均分')?.score >= 60 ? '在及格线以上，希望继续努力,' : '低于及格线，需要加把劲了,'
      const str3 = `考试排名位于第${this.studentInfo.rank}名，在班级${this.studentList.length}名学生中属于${pos[rank] || '逆天'}范围。`

      const variance = this.variance
      // 根据标准差和平均分判断成绩的稳定性
      let str4 = `4、你的成绩标准差为${variance}，`
      if (variance <= 15) {
        str4 += '成绩稳定性很高，各科目的分数都比较均衡。'
      } else if (variance <= 25) {
        str4 += '成绩稳定性一般，个别科目出现偏科现象。'
      } else {
        str4 += '成绩稳定性不高，偏科极为严重，需要多加注意。'
      }

      return this.provinceNum + '\n' + str1 + '\n' + str2 + '\n' + average + str3 + '\n' + str4
    }
  },
  mounted() {
    this.$store.dispatch('classL/getClassList')
    // 获取省份列表
    studentApi.getProvince().then(res => {
      this.provinceList = res.data
    })
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
        pageSize: this.studentNum(this.searchForm.class)
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
      this.studentInfo = this.studentList.find(item => item.id === this.studentId)
      this.getStudentScore()
    },
    // 获取学生成绩和排名
    getStudentScore() {
      return new Promise((resolve) => {
        // 获取学生成绩
        getStudentScore(this.studentInfo?.id).then(res => {
          this.scoreList = res.data
          // 获取学生排名
          getStudentRank(this.studentInfo?.id).then(res => {
            this.$set(this.studentInfo, 'rank', res.data)
            resolve()
          })
        })
      })
    },
    // 自定义事件 获取图表
    getChart(type, canvas) {
      if (type === 1) {
        this.barChart = canvas
      } else if (type === 2) {
        this.pieChart = canvas
      } else if (type === 3) {
        this.scatterChart = canvas
      } else if (type === 4) {
        this.rankChart = canvas
      }
    },
    // 导出PDF
    exportPDF(type = 'default') {
      // 使用promise解决异步问题 保证数据加载完成
      return new Promise((resolve) => {
        // 显示进度条 单个学生导出则显示
        if (type === 'default') {
          this.loading = this.$loading({
            lock: true,
            text: '正在导出PDF',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
        }
        const doc = new JSPDF()
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
          doc.text('姓名', this.getCenterX(doc, '姓名', tableX, 20), tableY + cellHeight + 7)
          doc.text(this.studentInfo.name, this.getCenterX(doc, this.studentInfo.name, tableX + 20, 30), tableY + cellHeight + 7)
          doc.text('性别', this.getCenterX(doc, '性别', tableX + 50, 20), tableY + cellHeight + 7)
          doc.text(this.studentInfo.sex, this.getCenterX(doc, this.studentInfo.sex, tableX + 70, 20), tableY + cellHeight + 7)
          doc.text('年龄', this.getCenterX(doc, '年龄', tableX + 90, 20), tableY + cellHeight + 7)
          doc.text(this.age(this.studentInfo.id_number).toString(), this.getCenterX(doc, this.age(this.studentInfo.id_number).toString(), tableX + 110, 20), tableY + cellHeight + 7)

          // 第二行表格 电话 班级 备注
          doc.rect(tableX, tableY + cellHeight * 2, 20, cellHeight, 'S')
          doc.rect(tableX + 20, tableY + cellHeight * 2, 30, cellHeight, 'S')
          doc.rect(tableX + 50, tableY + cellHeight * 2, 20, cellHeight, 'S')
          doc.rect(tableX + 70, tableY + cellHeight * 2, 20, cellHeight, 'S')
          doc.rect(tableX + 90, tableY + cellHeight * 2, 20, cellHeight, 'S')
          doc.rect(tableX + 110, tableY + cellHeight * 2, 20, cellHeight, 'S')
          // 第二行数据
          doc.text('电话', this.getCenterX(doc, '电话', tableX, 20), tableY + cellHeight * 2 + 7)
          doc.text(this.studentInfo.father_tel.toString(), this.getCenterX(doc, this.studentInfo.father_tel.toString(), tableX + 20, 30), tableY + cellHeight * 2 + 7)
          doc.text('班级', this.getCenterX(doc, '班级', tableX + 50, 20), tableY + cellHeight * 2 + 7)
          doc.text(this.className(this.studentInfo.class), this.getCenterX(doc, this.className(this.studentInfo.class), tableX + 70, 20), tableY + cellHeight * 2 + 7)
          doc.text('备注', this.getCenterX(doc, '备注', tableX + 90, 20), tableY + cellHeight * 2 + 7)
          doc.text(this.remark(this.studentInfo.remark), this.getCenterX(doc, this.remark(this.studentInfo.remark), tableX + 110, 20), tableY + cellHeight * 2 + 7)

          // 第三行表格 居住地 身份证
          doc.rect(tableX, tableY + cellHeight * 3, 20, cellHeight, 'S')
          doc.rect(tableX + 20, tableY + cellHeight * 3, 40, cellHeight, 'S')
          doc.rect(tableX + 60, tableY + cellHeight * 3, 20, cellHeight, 'S')
          doc.rect(tableX + 80, tableY + cellHeight * 3, 50, cellHeight, 'S')
          // 第三行数据
          doc.text('居住地', this.getCenterX(doc, '居住地', tableX, 20), tableY + cellHeight * 3 + 7)
          doc.text(this.studentInfo.address.split(' ')[0], this.getCenterX(doc, this.studentInfo.address.split(' ')[0], tableX + 20, 40), tableY + cellHeight * 3 + 7)
          doc.text('身份证', this.getCenterX(doc, '身份证', tableX + 60, 20), tableY + cellHeight * 3 + 7)
          doc.text(this.studentInfo.id_number.toString(), this.getCenterX(doc, this.studentInfo.id_number.toString(), tableX + 80, 50), tableY + cellHeight * 3 + 7)

          // 第四行表格 监护人 入学时间
          doc.rect(tableX, tableY + cellHeight * 4, 20, cellHeight, 'S')
          doc.rect(tableX + 20, tableY + cellHeight * 4, 40, cellHeight, 'S')
          doc.rect(tableX + 60, tableY + cellHeight * 4, 20, cellHeight, 'S')
          doc.rect(tableX + 80, tableY + cellHeight * 4, 50, cellHeight, 'S')
          // 第四行数据
          doc.text('监护人', this.getCenterX(doc, '监护人', tableX, 20), tableY + cellHeight * 4 + 7)
          doc.text(this.studentInfo.father_name, this.getCenterX(doc, this.studentInfo.father_name, tableX + 20, 40), tableY + cellHeight * 4 + 7)
          doc.text('入学时间', this.getCenterX(doc, '入学时间', tableX + 60, 20), tableY + cellHeight * 4 + 7)
          doc.text(this.createTime(this.studentInfo.create_time).toString(), this.getCenterX(doc, this.createTime(this.studentInfo.create_time).toString(), tableX + 80, 50), tableY + cellHeight * 4 + 7)

          // 第五行表格 家庭地址
          doc.rect(tableX, tableY + cellHeight * 5, 35, cellHeight, 'S')
          doc.rect(tableX + 35, tableY + cellHeight * 5, 135, cellHeight, 'S')
          // 第五行数据
          doc.text('家庭地址', this.getCenterX(doc, '家庭地址', tableX, 35), tableY + cellHeight * 5 + 7)
          doc.text(this.studentInfo.address, this.getCenterX(doc, this.studentInfo.address, tableX + 35, 135), tableY + cellHeight * 5 + 7)

          // 第六行表格 获奖信息
          doc.rect(tableX, tableY + cellHeight * 6, 35, cellHeight, 'S')
          doc.rect(tableX + 35, tableY + cellHeight * 6, 135, cellHeight, 'S')
          // 第六行数据
          doc.text('获奖信息', this.getCenterX(doc, '获奖信息', tableX, 35), tableY + cellHeight * 6 + 7)
          doc.text('无', this.getCenterX(doc, '无', tableX + 35, 135), tableY + cellHeight * 6 + 7)

          // 第七行表格 中间显示'各科成绩平均分'
          doc.rect(tableX, tableY + cellHeight * 7, 170, cellHeight, 'S')
          // 第七行数据
          doc.text('最新考试成绩', this.getCenterX(doc, '最新考试成绩', tableX, 170), tableY + cellHeight * 7 + 7)

          // 第八 九 行 表格和数据
          for (let i = 0; i < 9; i++) {
            const width = i === 8 ? 18 : 19
            // 第八行 课程标题
            doc.rect(tableX + 19 * i, tableY + cellHeight * 8, width, cellHeight, 'S')
            doc.text(this.scoreList[i].name, this.getCenterX(doc, this.scoreList[i].name, tableX + 19 * i, width), tableY + cellHeight * (8) + 7)
            // 第九行 课程成绩
            doc.rect(tableX + 19 * i, tableY + cellHeight * 9, width, cellHeight, 'S')
            doc.text(this.scoreList[i].score.toString(), this.getCenterX(doc, this.scoreList[i].score.toString(), tableX + 19 * i, width), tableY + cellHeight * (9) + 7)
          }

          // 第十行 表格 平均分 总分 排名
          doc.rect(tableX, tableY + cellHeight * 10, 29, cellHeight, 'S')
          doc.rect(tableX + 29, tableY + cellHeight * 10, 29, cellHeight, 'S')
          doc.rect(tableX + 58, tableY + cellHeight * 10, 29, cellHeight, 'S')
          doc.rect(tableX + 87, tableY + cellHeight * 10, 29, cellHeight, 'S')
          doc.rect(tableX + 116, tableY + cellHeight * 10, 25, cellHeight, 'S')
          doc.rect(tableX + 141, tableY + cellHeight * 10, 29, cellHeight, 'S')
          // 第十行 数据
          doc.text('平均分', this.getCenterX(doc, '平均分', tableX, 29), tableY + cellHeight * 10 + 7)
          doc.text(this.scoreList[9].score.toString(), this.getCenterX(doc, this.scoreList[9].score.toString(), tableX + 29, 29), tableY + cellHeight * 10 + 7)
          doc.text('总分', this.getCenterX(doc, '总分', tableX + 58, 29), tableY + cellHeight * 10 + 7)
          doc.text(this.scoreList[10].score.toString(), this.getCenterX(doc, this.scoreList[10].score.toString(), tableX + 87, 29), tableY + cellHeight * 10 + 7)
          doc.text('排名', this.getCenterX(doc, '排名', tableX + 116, 25), tableY + cellHeight * 10 + 7)
          const rankPositionX = this.getCenterX(doc, this.studentInfo.rank.toString() + ' / ' + this.studentNum(this.studentInfo.class), tableX + 141, 29)
          doc.text(this.studentInfo.rank.toString() + ' / ' + this.studentNum(this.studentInfo.class), rankPositionX, tableY + cellHeight * 10 + 7)

          // 第十一行 表格 数据分析
          doc.rect(tableX, tableY + cellHeight * 11, 170, cellHeight, 'S')
          // 第十一行 数据
          doc.text('数据分析', this.getCenterX(doc, '数据分析', tableX, 170), tableY + cellHeight * 11 + 7)

          // 下面画出十字线 用于存放四个图表
          doc.line(pageWidth / 2, tableY + cellHeight * 12, pageWidth / 2, tableY + cellHeight * 23)
          doc.line(tableX, tableY + cellHeight * 17.5, tableX + 170, tableY + cellHeight * 17.5)
          doc.line(tableX, tableY + cellHeight * 23, tableX + 170, tableY + cellHeight * 23)

          // 底部 表格 数据分析内容
          doc.rect(tableX, tableY + cellHeight * 12, 170, cellHeight * 14, 'S')
          // 底部 数据
          doc.text(this.dataAnalysis, tableX + 5, tableY + cellHeight * 23 + 7)

          // 获取图表图片
          this.$refs['barChart'].getChartImg()
          this.$refs['pieChart'].getChartImg()
          this.$refs['scatterChart'].getChartImg()
          this.$refs['rankChart'].getChartImg()
          // 创建一个图片
          const barChartImg = new Image()
          const pieChartImg = new Image()
          const scatterChartImg = new Image()
          const rankChartImg = new Image()
          barChartImg.src = this.barChart
          pieChartImg.src = this.pieChart
          scatterChartImg.src = this.scatterChart
          rankChartImg.src = this.rankChart

          // 图表图片加载完成后添加到pdf
          barChartImg.onload = () => {
            doc.addImage(barChartImg, 'PNG', 24, 142, 74, 52)
          }
          pieChartImg.onload = () => {
            doc.addImage(pieChartImg, 'PNG', 110, 142, 78, 52)
          }
          scatterChartImg.onload = () => {
            doc.addImage(scatterChartImg, 'PNG', 24, 198, 78, 51)
          }
          rankChartImg.onload = () => {
            doc.addImage(rankChartImg, 'PNG', 118, 198, 55, 51)
          }

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
          img.onload = () => {
            doc.addImage(img, 'JPEG', photoX + 0.5, photoY + 0.5, photoWidth, photoHeight)
            // 判断是单个导出还是批量导出
            if (type === 'default') {
              doc.save(this.studentInfo.name + ' - 学生信息.pdf')
              // 关闭加载
              this.loading.close()
            } else if (type === 'batch') {
              // 批量导出
              this.pdf = doc.output('blob')
              // promise完成
              resolve()
            }
          }
        })
      })
    },
    // 获取PDF文本居中的x坐标
    getCenterX(doc, text, x, tableWidth) {
      // q: 为什么要除以doc.internal.scaleFactor
      // a: 因为jsPDF的单位是pt，而html的单位是px，所以需要转换
      // q: 为什么要乘以doc.internal.getFontSize()
      // a: 因为jsPDF的字体大小是以pt为单位的，而html的字体大小是以px为单位的，所以需要转换
      // q: doc.getStringUnitWidth是什么意思
      // a: 获取字符串的宽度，单位是pt
      const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor
      return x + (tableWidth - textWidth) / 2
      /*
      * 计算文本在表格中水平居中时的X轴坐标值。
      * 具体实现是先使用doc.getStringUnitWidth(text)计算文本的宽度，
      * 再乘以当前字体大小和文本缩放比例的乘积得到真实的文本宽度，
      * 然后用表格宽度减去文本宽度，再除以2，即可得到文本居中时的X轴坐标值。
      * 最后将这个值加上表格的起始X轴坐标值x，即可得到文本在表格中的水平居中位置。
      *  */
    },
    // zip压缩 批量pdf下载
    async createZip() {
      this.dialogVisible = false
      const zip = new JSZip()
      // 存储学生姓名 用于重名处理
      const names = []
      this.centerDialogVisible = true
      for (const item of this.selectExportList) {
        const index = this.selectExportList.indexOf(item)
        this.studentInfo = item
        // 等待数据和pdf生成完毕
        await this.getStudentScore()
        // 试图等待echarts动画完毕 不然生成的图像会有问题
        await this.sleep(300)
        await this.exportPDF('batch')
        // 往zip里面添加文件 解决重名问题
        if (names.includes(this.studentInfo.name)) {
          zip.file(this.studentInfo.name + ' - 学生信息 - ' + index + '.pdf', this.pdf)
        } else {
          zip.file(this.studentInfo.name + ' - 学生信息.pdf', this.pdf)
        }
        // 存储学生姓名
        names.push(item.name)
        // 进度条
        this.progress = Number(((index + 1) / this.selectExportList.length * 100).toFixed(0))
        if (index === this.selectExportList.length - 1) {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, '学生信息.zip')
            this.centerDialogVisible = false
          })
        }
      }
    },
    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    // 获取选择批量导出的学生 全选或全不选
    handleCheckAllChange(val) {
      this.selectExportList = val ? this.studentList : []
      this.isIndeterminate = false
    },
    // 选择批量导出的学生
    handleCheckedCitiesChange(value) {
      this.selectExportList = value
      const checkedCount = value.length
      // 是否已经全选
      this.checkAll = checkedCount === this.studentList.length
      // 选择了但没全部选择
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.studentList.length
    }
  }
}
</script>

<style scoped>
.score-list {
  /*  居中显示*/
  text-align: center;
}

.chart-pos {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 250px;
}

/*
  el-table样式穿透 表格居中
*/
/deep/ .el-table th > .cell {
  text-align: center;
}

/deep/ .el-table .cell {
  text-align: center;
}
</style>
