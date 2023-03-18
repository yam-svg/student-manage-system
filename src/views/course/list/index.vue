<template>
  <div class="app-container">
    <!--工具条-->
    <el-form ref="form" label-width="160px" inline>
      <!--级联选择器-->
      <el-form-item label="选择考试批次和班级">
        <el-cascader
          v-model="value"
          clearable
          style="width: 200px"
          size="mini"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item class="right-float">
        <el-button type="warning" size="mini" @click="exportScore">导出当前成绩</el-button>
      </el-form-item>
    </el-form>
    <!--数据列表-->
    <el-table :data="scoreData" stripe border style="width: 100%">
      <el-table-column label="序号" width="60">
        <template v-slot="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="chinese" label="语文">
        <template v-slot="scope">
          <span>{{ scope.row.chinese || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="mathematics" label="数学">
        <template v-slot="scope">
          <span>{{ scope.row.mathematics || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="english" label="英语">
        <template v-slot="scope">
          <span>{{ scope.row.english || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="physics" label="物理">
        <template v-slot="scope">
          <span>{{ scope.row.physics || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="chemistry" label="化学">
        <template v-slot="scope">
          <span>{{ scope.row.chemistry || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="biology" label="生物">
        <template v-slot="scope">
          <span>{{ scope.row.biology || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="politics" label="政治">
        <template v-slot="scope">
          <span>{{ scope.row.politics || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="history" label="历史">
        <template v-slot="scope">
          <span>{{ scope.row.history || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="geography" label="地理">
        <template v-slot="scope">
          <span>{{ scope.row.geography || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="total" label="总分">
        <template v-slot="scope">
          <span>{{ scope.row.total || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable sort-by="average" label="平均分">
        <template v-slot="scope">
          <span>{{ scope.row.average || 0 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as courseApi from '@/api/course'
// 引入Excel导出工具
import { createWs, openDownloadDialog, sheet2blob } from '@/utils/excel'

export default {
  name: 'Course',
  data() {
    return {
      // 级联选择器数据
      value: [],
      // 考试批次数据
      testTime: [],
      // 成绩数据
      scoreData: [],
      // 新增考试表单数据
      form: {
        title: '',
        note: ''
      }
    }
  },
  computed: {
    ...mapState('classL', ['classList']),
    // 根据考试批次和班级整合级联选择器数据
    options() {
      const options = []
      this.testTime.forEach(item => {
        const obj = {
          value: item.id,
          label: item.title,
          children: []
        }
        this.classList.forEach(item2 => {
          const obj2 = {
            value: item2.id,
            label: item2.name
          }
          obj.children.push(obj2)
        })
        options.push(obj)
      })
      return options
    }
  },
  mounted() {
    this.$store.dispatch('classL/getClassList')
    // 获取考试批次
    this.getTestTime()
  },
  methods: {
    // 获取考试批次
    getTestTime() {
      courseApi.getExamBatch().then(res => {
        this.testTime = res.data
      })
    },
    // 获取成绩数据
    getScoreData() {
      // 整理考试批次和班级id
      const params = {
        testId: this.value[0],
        classId: this.value[1],
        type: 0
      }
      // 获取成绩数据
      courseApi.getScoreData(params).then(res => {
        this.scoreData = res.data
        // 计算各科及格率
        if (this.scoreData.length) {
          this.coursePassRate()
        }
      })
    },
    // 级联选择器change事件 value为数组 ['考试批次id', '班级id']
    handleChange(value) {
      this.value = value
      this.getScoreData()
    },
    // 计算各科及格率
    coursePassRate() {
      // 总人数
      const total = this.scoreData.length || 1
      // 语文
      const chinese = this.scoreData.filter(item => item.chinese >= 60).length / total
      // 数学
      const mathematics = this.scoreData.filter(item => item.mathematics >= 60).length / total
      // 英语 / total
      const english = this.scoreData.filter(item => item.english >= 60).length / total
      // 物理 / total
      const physics = this.scoreData.filter(item => item.physics >= 60).length / total
      // 化学 / total
      const chemistry = this.scoreData.filter(item => item.chemistry >= 60).length / total
      // 生物 / total
      const biology = this.scoreData.filter(item => item.biology >= 60).length / total
      // 政治 / total
      const politics = this.scoreData.filter(item => item.politics >= 60).length / total
      // 历史 / total
      const history = this.scoreData.filter(item => item.history >= 60).length / total
      // 地理 / total
      const geography = this.scoreData.filter(item => item.geography >= 60).length / total
      // 添加到成绩数据中
      this.scoreData.push({
        name: '及格率',
        chinese: (chinese * 100).toFixed(2) + '%',
        mathematics: (mathematics * 100).toFixed(2) + '%',
        english: (english * 100).toFixed(2) + '%',
        physics: (physics * 100).toFixed(2) + '%',
        chemistry: (chemistry * 100).toFixed(2) + '%',
        biology: (biology * 100).toFixed(2) + '%',
        politics: (politics * 100).toFixed(2) + '%',
        history: (history * 100).toFixed(2) + '%',
        geography: (geography * 100).toFixed(2) + '%',
        // 有一个 \ 是转义字符，两个 \\ 才是一个 \
        total: '\\',
        average: '\\'
      })
    },
    // 导出当前成绩
    exportScore() {
      if (this.value.length === 0) {
        this.$message.warning('请选择考试批次和班级！')
        return
      }
      // 整理考试批次和班级id
      const title = {
        index: '序号',
        name: '学生姓名',
        chinese: '语文',
        mathematics: '数学',
        english: '英语',
        physics: '物理',
        chemistry: '化学',
        biology: '生物',
        politics: '政治',
        history: '历史',
        geography: '地理',
        total: '总分',
        average: '平均分'
      }
      const fields = ['index', 'name', 'chinese', 'mathematics', 'english', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography', 'total', 'average']
      // 整理成表格数据
      const data = this.scoreData.map((item, index) => {
        return {
          index: index + 1,
          name: item.name,
          chinese: item.chinese || 0,
          mathematics: item.mathematics || 0,
          english: item.english || 0,
          physics: item.physics || 0,
          chemistry: item.chemistry || 0,
          biology: item.biology || 0,
          politics: item.politics || 0,
          history: item.history || 0,
          geography: item.geography || 0,
          total: item.total || 0,
          average: item.average || 0
        }
      })
      const ws = createWs(data, fields, title)
      // 获取当前考试批次和班级名称
      const testTimeName = this.testTime.find(item => item.id === this.value[0]).title
      const className = this.classList.find(item => item.id === this.value[1]).name
      openDownloadDialog(sheet2blob(ws), testTimeName + '-' + className + '-成绩表.xlsx')
    }
  }
}
</script>

<style scoped>
.right-float {
  float: right;
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
