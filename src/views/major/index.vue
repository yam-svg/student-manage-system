<template>
  <div id="app-container">
    <!--数据列表-->
    <el-table :data="majorList" style="width: 100%" row-key="id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="学院名称" />
      <el-table-column prop="major" label="专业名称" />
      <el-table-column prop="total" label="人数" />
      <el-table-column label="操作" width="180">
        <template v-slot="{row}">
          <div v-if="isShowAction(row)">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="small" @click="handleAdd(row)">添加</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!---->
    <el-dialog
      :title="majorInfo.id ? '编辑专业' : '添加专业'"
      :visible.sync="dialogVisible"
      width="30%"
      before-close="handleClose"
    >
      <el-form ref="form" :model="majorInfo" :rules="rules" label-width="80px">
        <el-form-item label="专业名称" prop="major">
          <el-input v-model="majorInfo.major" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as majorApi from '@/api/major'

export default {
  name: 'Major',
  data() {
    return {
      // 学院列表
      collegeList: [],
      // 专业列表
      majorList: [],
      // 专业信息
      majorInfo: {
        major: ''
      },
      // 学院id
      collegeId: '',
      // 是否显示弹窗
      dialogVisible: false,
      // 表单验证规则
      rules: {
        major: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 是否显示操作列
    isShowAction() {
      return (row) => {
        return row.major
      }
    }
  },
  mounted() {
    this.getMajorList()
  },
  methods: {
    // 获取专业列表
    getMajorList() {
      majorApi.getMajorList().then(res => {
        this.majorList = res.data
      })
    },
    // 编辑
    handleEdit(row) {
      // 修改id
      const id = row.id.split('-')[1]
      this.majorInfo = JSON.parse(JSON.stringify(row))
      this.majorInfo.id = id
      this.dialogVisible = true
    },
    // 添加
    handleAdd(row) {
      this.collegeId = row.id
      this.dialogVisible = true
    },
    // 保存
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.majorInfo.id) {
            // 编辑
            majorApi.updateMajor(this.majorInfo).then(res => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.dialogVisible = false
              this.getMajorList()
            })
          } else {
            // 添加
            const params = {
              collegeId: this.collegeId,
              name: this.majorInfo.major
            }
            majorApi.addMajor(params).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.dialogVisible = false
              this.getMajorList()
            })
          }
        }
        this.majorInfo = {
          major: ''
        }
      })
    },
    // 删除
    handleDelete(row) {
      if (row.total > 0) {
        this.$message({
          type: 'warning',
          message: '该专业下有学生, 不能删除!'
        })
        return
      }
      this.$confirm('此操作将永久删除该专业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.majorInfo = {
        major: ''
      }
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
