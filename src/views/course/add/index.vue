<template>
  <div class="app-container">
    <!--工具条-->
    <el-form ref="form" inline label-width="160px">
      <!--级联选择器-->
      <el-form-item label="选择考试批次和班级">
        <el-cascader
          v-model="value"
          clearable
          style="width: 280px"
          size="mini"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item class="right-float">
        <el-button type="warning" size="mini" @click="exportEmptyScore">导出空白成绩册</el-button>
      </el-form-item>
      <el-form-item class="right-float">
        <el-button v-if="scoreData.length > 0" :type="isSave ? 'success' : 'danger'" size="mini" @click="saveScore">保存成绩</el-button>
      </el-form-item>
    </el-form>
    <!--数据列表-->
    <el-table :data="scoreData" stripe :max-height="screenHeight" border style="width: 100%">
      <el-table-column fixed label="序号" width="60">
        <template v-slot="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed label="学生姓名" width="80">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语文">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.chinese"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="数学">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.mathematics"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="英语">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.english"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="物理">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.physics"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="化学">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.chemistry"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="生物">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.biology"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="政治">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.politics"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="历史">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.history"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="地理">
        <template v-slot="scope">
          <!--显示和输入成绩-->
          <el-input
            v-model.number="scope.row.geography"
            :min="0"
            :max="100"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="总分">
        <template v-slot="scope">
          <span v-text="total(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="平均分">
        <template v-slot="scope">
          <span v-text="average(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import * as courseApi from '@/api/course'
import { mapState } from 'vuex'
// 引入Excel导出工具
import { createWs, openDownloadDialog, sheet2blob } from '@/utils/excel'

export default {
  name: 'AddCourse',
  data() {
    return {
      // 考试数据
      scoreData: [],
      // 考试批次列表
      examBatchList: [],
      // 选择的考试批次id
      examBatchId: null,
      // 级联选择器值
      value: [],
      // 成绩是否已经保存
      isSave: true,
      // 屏幕高度
      screenHeight: 0
    }
  },
  computed: {
    ...mapState('classL', ['classList']),
    // 级联选择器数据
    options() {
      const options = []
      // 如果考试记录不为空
      if (this.examBatchList.length > 0) {
        this.examBatchList.forEach(item => {
          const option = {
            value: item.id,
            label: item.title,
            children: []
          }
          this.classList.forEach(item => {
            option.children.push({
              value: item.id,
              label: item.name
            })
          })
          options.push(option)
        })
      }
      return options
    },
    // 计算总分
    total() {
      return function(row) {
        let total = 0
        const courseList = ['chinese', 'mathematics', 'english', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography']
        // 计算学科总分
        for (const courseItem in courseList) {
          total += row[courseList[courseItem]] || 0
        }
        // 给元数据添加总分属性
        row.total = total
        return total
      }
    },
    // 计算平均分
    average() {
      return function(row) {
        let total = 0
        const courseList = ['chinese', 'mathematics', 'english', 'physics', 'chemistry', 'biology', 'politics', 'history', 'geography']
        // 计算学科总分
        for (const courseItem in courseList) {
          total += row[courseList[courseItem]] || 0
        }
        const average = (total / courseList.length).toFixed(1)
        row.average = average
        return average
      }
    }
  },
  // 监视属性 当学生成绩被修改而且成绩没有保存时，isSave为false
  watch: {
    scoreData: {
      handler() {
        this.isSave = false
      },
      deep: true
    }
  },
  beforeMount() {
    this.$store.dispatch('classL/getClassList')
    // 获取考试批次列表
    this.getExamBatchList()
    // 获取屏幕高度的78%
    this.screenHeight = Math.floor(document.documentElement.clientHeight * 0.78)
  },
  methods: {
    // 获取考试批次列表
    async getExamBatchList() {
      const res = await courseApi.getExamBatch()
      if (res.code === 20000) {
        this.examBatchList = res.data || []
      }
    },
    // 获取成绩数据
    getScoreData() {
      // 整理考试批次和班级id
      const params = {
        testId: this.value[0],
        classId: this.value[1],
        type: 1
      }
      // 获取成绩数据
      courseApi.getScoreData(params).then(res => {
        this.scoreData = res.data || []
        // 随机添加分数
      //   this.scoreData.forEach(item => {
      //     item.chinese = Math.floor(Math.random() * 101)
      //     item.mathematics = Math.floor(Math.random() * 101)
      //     item.english = Math.floor(Math.random() * 101)
      //     item.physics = Math.floor(Math.random() * 101)
      //     item.chemistry = Math.floor(Math.random() * 101)
      //     item.biology = Math.floor(Math.random() * 101)
      //     item.politics = Math.floor(Math.random() * 101)
      //     item.history = Math.floor(Math.random() * 101)
      //     item.geography = Math.floor(Math.random() * 101)
      //   })
      })
    },
    // 级联选择器值改变时触发
    handleChange(value) {
      this.value = value
      this.getScoreData()
    },
    // 保存成绩
    saveScore() {
      this.isSave = true
      // 整理成绩数据
      const scoreData = []
      this.scoreData.forEach(item => {
        const scoreItem = {
          student_id: item.student_id,
          chinese: item.chinese || null,
          mathematics: item.mathematics || null,
          english: item.english || null,
          physics: item.physics || null,
          chemistry: item.chemistry || null,
          biology: item.biology || null,
          politics: item.politics || null,
          history: item.history || null,
          geography: item.geography || null,
          total: item.total,
          average: item.average,
          test_id: item.test_id
        }
        scoreData.push(scoreItem)
      })
      // 发送请求
      courseApi.saveScoreData(scoreData).then(res => {
        if (res.code === 20000) {
          this.$message.success('保存成功！')
        }
      })
    },
    // 导出空白成绩册
    exportEmptyScore() {
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
          chinese: '',
          mathematics: '',
          english: '',
          physics: '',
          chemistry: '',
          biology: '',
          politics: '',
          history: '',
          geography: '',
          // 总分 为Excel求和函数
          total: '',
          average: ''
        }
      })

      const ws = createWs(data, fields, title)
      // 获取当前考试批次和班级名称
      const testTimeName = this.examBatchList.find(item => item.id === this.value[0]).title
      const className = this.classList.find(item => item.id === this.value[1]).name
      openDownloadDialog(sheet2blob(ws), testTimeName + '-' + className + '-空白成绩表.xlsx')
    }
  },
  // 组件内路由守卫
  // 当成绩未保存时 当离开页面时 提示用户
  beforeRouteLeave(to, from, next) {
    if (this.isSave === false) {
      this.$confirm('成绩未保存，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  }
}
</script>

<style scoped>
/*
  el-table样式穿透 表格居中
*/
/deep/ .el-table th > .cell {
  text-align: center;
}

/deep/ .el-table .cell {
  text-align: center;
}

.right-float {
  float: right;
}
</style>
