<template>
  <div class="app-container">
    <el-form ref="form" inline label-width="80px">
      <el-form-item>
        <el-button type="primary" size="mini" @click="showDialog">新增考试</el-button>
      </el-form-item>
    </el-form>
    <!--考试列表-->
    <el-table :data="testList" border stripe>
      <el-table-column type="index" label="序号" width="120" />
      <el-table-column prop="title" label="考试名称" />
      <el-table-column prop="note" label="备注" />
      <el-table-column label="操作" width="120">
        <template v-slot="scope">
          <el-button type="text" size="mini" @click="editTest(scope.row)">编辑</el-button>
          <el-button type="text" size="mini" @click="delTest(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增考试对话框-->
    <el-dialog
      :title="testForm.id ? '修改考试' : '新增考试'"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="test" :model="testForm" :rules="rules" label-width="80px">
        <el-form-item label="考试名称" prop="title">
          <el-input v-model="testForm.title" placeholder="考试名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="testForm.note" placeholder="输入考试备注" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="addOrUpdateTest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as courseApi from '@/api/course'
import _ from 'lodash'

export default {
  name: 'TestManage',
  data() {
    return {
      // 新增/修改考试表单数据
      testForm: {
        title: '',
        note: ''
      },
      // 新增考试对话框是否可见
      dialogVisible: false,
      // 考试列表数据
      testList: [],
      // 新增考试表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入考试名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getTestList()
  },
  methods: {
    // 获取考试列表
    async getTestList() {
      const res = await courseApi.getExamBatch()
      if (res.code === 20000) {
        this.testList = res.data
      }
    },
    // 添加/修改考试
    addOrUpdateTest() {
      // 表单验证
      this.$refs.test.validate(async valid => {
        if (valid) {
          // 发送请求
          let res = ''
          if (this.testForm.id) {
            res = await courseApi.updateExam(this.testForm)
          } else {
            res = await courseApi.addExamBatch(this.testForm)
          }
          if (res.code === 20000) {
            this.$message.success('新增考试成功！')
          }
          // 关闭对话框
          this.dialogVisible = false
          // 重新获取考试列表
          await this.getTestList()
        }
      })
    },
    // 删除考试
    async delTest(row) {
      const res = await this.$confirm('此操作将永久删除该考试以及参加此次考试的学生成绩记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (res === 'confirm') {
        const res = await courseApi.deleteExam({ id: row.id })
        if (res.code === 20000) {
          this.$message.success('删除成功！')
          // 重新获取考试列表
          await this.getTestList()
        }
      }
    },
    // 打开新增考试对话框
    showDialog() {
      this.dialogVisible = true
    },
    // 关闭新增考试对话框
    handleClose(done) {
      // 关闭对话框前，重置表单数据
      this.testForm = {
        title: '',
        note: ''
      }
      // 清除表单验证结果
      this.$refs.test.clearValidate()
      done()
    },
    // 修改考试
    editTest(row) {
      this.testForm = _.cloneDeep(row)
      this.dialogVisible = true
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
</style>
