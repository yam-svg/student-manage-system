<template>
  <div class="class-list">
    <!--工具条-->
    <el-form ref="form" label-width="80px" inline>
      <el-form-item label="班级列表">
        <el-button type="primary" size="mini" @click="openDialog">添加班级</el-button>
      </el-form-item>
    </el-form>
    <!--数据表格-->
    <div class="class-list__content">
      <el-table :data="classList" border>
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="master_name" label="班主任" />
        <el-table-column prop="student" sortable label="在读学生人数" />
        <el-table-column prop="note" label="班级备注" />
        <el-table-column label="操作" width="200">
          <template v-slot="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加/编辑对话框-->
    <el-dialog
      :title="classInfo.id ? '编辑班级' : '添加班级'"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="classInfo" label-width="80px" :rules="rules">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="classInfo.name" clearable placeholder="班级的名字" />
        </el-form-item>
        <el-form-item label="班主任" prop="master_id">
          <el-select v-model="classInfo.master_id" clearable placeholder="请选择班主任">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级备注">
          <el-input v-model="classInfo.note" type="textarea" :rows="2" clearable placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleAddOrUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import teacherApi from '@/api/teacher'
import classApi from '@/api/class'
import _ from 'lodash'

export default {
  name: 'ClassList',
  data() {
    return {
      classInfo: {
        name: '',
        master_id: null,
        note: '',
        master_name: ''
      },
      teacherList: [],
      dialogVisible: false,
      // 表单验证
      rules: {
        name: [
          { required: true, message: '请输入班级名称', trigger: 'blur' }
        ],
        master_id: [{ required: true, message: '请选择班主任', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState('classL', ['classList'])
  },
  mounted() {
    // 获取班级列表
    this.$store.dispatch('classL/getClassList')
    this.getTeacherList()
  },
  methods: {
    // 获取教师列表
    getTeacherList() {
      teacherApi.getTeacherList().then(res => {
        this.teacherList = res.data
      })
    },
    // 打开对话框
    openDialog() {
      this.dialogVisible = true
      // 清除表单验证上次的错误信息
      this.$refs.form && this.$refs.form.clearValidate()
    },
    // 编辑班级
    handleEdit(row) {
      this.dialogVisible = true
      this.classInfo = _.cloneDeep(row)
      // 清除表单验证上次的错误信息
      this.$refs.form && this.$refs.form.clearValidate()
    },
    // 弹出框确定按钮
    handleAddOrUpdate() {
      this.classInfo.id ? this.updateClass() : this.addClass()
    },
    // 添加班级
    addClass() {
      this.dialogVisible = false
      // 添加老师名称字段
      this.classInfo.master_name = this.teacherList.find(item => item.id === this.classInfo.master_id).name
      classApi.addClass(this.classInfo).then(res => {
        this.$message.success(res.msg)
        this.$store.dispatch('classL/getClassList')
      })
    },
    // 更新班级
    updateClass() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.dialogVisible = false
          // 添加老师名称字段
          this.classInfo.master_name = this.teacherList.find(item => item.id === this.classInfo.master_id).name
          classApi.updateClass(this.classInfo).then(res => {
            this.$message.success(res.msg)
            this.$store.dispatch('classL/getClassList')
          })
        }
      })
    },
    // 删除班级
    handleDelete(row) {
      // 不允许删除
      this.$message.error('不允许删除')
      return
      this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        classApi.deleteClass(row.id).then(res => {
          this.$message.success(res.msg)
          this.$store.dispatch('classL/getClassList')
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 窗口关闭
    handleClose() {
      this.dialogVisible = false
      this.classInfo = {
        name: '',
        master_id: null,
        note: '',
        master_name: ''
      }
    }
  }
}
</script>

<style scoped>
.class-list {
  padding: 20px;
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
