<template>
  <div class="app-container">
    <!--数据列表-->
    <el-row>
      <el-col :span="24">
        <el-button type="primary" size="mini" @click="editOrAddCollege({})">添加学院</el-button>
      </el-col>
    </el-row>
    <el-table :data="collegeList" style="width: 100%;margin-top: 10px" border>
      <el-table-column type="index" label="序号" width="80"/>
      <el-table-column prop="name" label="学院名称"></el-table-column>
      <el-table-column prop="total" label="学生人数" width="80"></el-table-column>
      <el-table-column prop="phone" label="学院电话"></el-table-column>
      <el-table-column prop="email" label="学院邮箱"></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button type="text" size="small" @click="editOrAddCollege(row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteCollege(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改-->
    <el-dialog
      :title="collegeInfo.id ? '修改学院' : '添加学院'"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="collegeInfo" :model="collegeInfo" :rules="rules" label-width="80px">
        <el-form-item prop="name" label="学院名称">
          <el-input v-model="collegeInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="学院电话">
          <el-input v-model="collegeInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="学院邮箱">
          <el-input v-model="collegeInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as collegeApi from '@/api/college'

export default {
  name: 'College',
  data() {
    return {
      // 学院列表
      collegeList: [],
      // 修改弹窗
      dialogVisible: false,
      // 学院信息
      collegeInfo: {
        name: '',
        phone: '',
        email: ''
      },
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入学院名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getCollegeList()
  },
  methods: {
    // 获取学院列表
    getCollegeList() {
      collegeApi.getCollegeList().then(res => {
        this.collegeList = res.data
      })
    },
    // 编辑学院
    editOrAddCollege(row) {
      this.collegeInfo = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },
    // 提交编辑
    submitEdit() {
      this.$refs['collegeInfo'].validate(valid => {
        if (valid) {
          // 判断是否已经存在
          const isExist = this.collegeList.some(item => {
            return item.name === this.collegeInfo.name && item.id !== this.collegeInfo.id
          })
          if (isExist) {
            this.$message.error('学院名称已存在')
            return
          }
          // 添加
          if (!this.collegeInfo.id) {
            collegeApi.addCollege(this.collegeInfo).then(res => {
              this.$message.success('添加成功')
              this.dialogVisible = false
              this.getCollegeList()
            })
          } else {
            // 修改
            collegeApi.updateCollege(this.collegeInfo).then(res => {
              this.$message.success('修改成功')
              this.dialogVisible = false
              this.getCollegeList()
            })
          }
        }
      })
    },
    // 删除学院
    deleteCollege(id) {
      this.$confirm('此操作将永久删除该学院, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collegeApi.deleteCollege(id).then(res => {
          this.$message.success('删除成功')
          this.getCollegeList()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
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
