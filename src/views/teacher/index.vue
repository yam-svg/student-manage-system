<template>
  <div id="container">
    <!--工具条-->
    <el-form ref="form" label-width="80px" inline>
      <el-form-item label="教师列表">
        <el-button type="primary" size="mini" @click="openDialog">添加教师</el-button>
      </el-form-item>
      <el-form-item label="查询教师">
        <el-input v-model.trim="searchObj.name" clearable size="mini" placeholder="输入教师姓名" @input="getTeacherList" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getTeacherList">查询</el-button>
      </el-form-item>
    </el-form>
    <!--数据表格-->
    <el-table :data="teacherList" style="width: 100%" border>
      <el-table-column label="序号" width="80">
        <template v-slot="{row, $index}">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="年龄">
        <template v-slot="{row}">
          {{ teacherAge(row.join_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="电子邮箱" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="class_id" label="班主任">
        <template v-slot="{row}">
          {{ classMap[row.class_id] }}
        </template>
      </el-table-column>
      <el-table-column prop="id_number" label="身份证号" />
      <el-table-column prop="join_time" label="入职时间" />
      <el-table-column label="操作" width="180">
        <template v-slot="{row}">
          <el-button type="text" size="mini" @click="editTeacher(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="deleteTeacher(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加/更新教师对话框-->
    <el-dialog :title="form.id ? '编辑教师' : '添加教师'" :visible.sync="dialogVisible" :before-close="closeDialog">
      <el-form ref="form" label-width="100px" :model="form" :rules="rule">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="form.name" clearable size="mini" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="form.email" clearable size="mini" placeholder="请输入教师电子邮箱" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model.trim="form.phone" clearable size="mini" placeholder="请输入教师联系电话" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_number">
          <el-input v-model.trim="form.id_number" clearable size="mini" placeholder="请输入教师身份证号" />
        </el-form-item>
        <el-form-item label="入职时间" prop="join_time">
          <el-date-picker v-model="form.join_time" type="date" size="mini" value-format="yyyy-MM-dd" placeholder="请选择入职时间" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="addOrUpdate">保存</el-button>
        <el-button size="mini" @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
import classApi from '@/api/class'
import { mapState } from 'vuex'

export default {
  name: 'TeacherList',
  data() {
    return {
      teacherList: [],
      searchObj: {
        name: ''
      },
      dialogVisible: false,
      form: {
        name: '',
        email: '',
        phone: '',
        id_number: '',
        join_time: ''
      },
      rule: {
        name: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入教师电子邮箱', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入教师联系电话', trigger: 'blur' }
        ],
        id_number: [
          { required: true, message: '请输入教师身份证号', trigger: 'blur' }
        ],
        join_time: [
          { required: true, message: '请选择入职时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('classL', ['classList']),
    // 班级与id的映射关系
    classMap() {
      return this.classList.reduce((map, item) => {
        map[item.id] = item.name
        return map
      }, {})
    },
    // 教师年龄
    teacherAge() {
      return (join_time) => {
        const now = new Date()
        const join = new Date(join_time)
        return now.getFullYear() - join.getFullYear()
      }
    }
  },
  mounted() {
    // 获取班级列表
    this.$store.dispatch('classL/getClassList')
    this.getTeacherList()
  },
  methods: {
    // 获取教师列表
    getTeacherList() {
      teacherApi.getTeacherList(this.searchObj).then(res => {
        this.teacherList = res.data
      })
    },
    // 添加或更新教师
    addOrUpdate() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res
          if (this.form.id) {
            // 去除空字段
            for (const key in this.form) {
              if (this.form[key] === '') {
                this.form[key] = null
              }
            }
            res = await teacherApi.updateTeacher(this.form)
          } else {
            res = await teacherApi.addTeacher(this.form)
          }
          this.$message({
            type: 'success',
            message: res.msg
          })
          // 更新class表中的班主任
          await classApi.updateTeacherName()
          this.dialogVisible = false
          this.getTeacherList()
        }
      })
    },
    // 编辑教师
    editTeacher(row) {
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    // 删除教师
    async deleteTeacher(row) {
      this.$confirm('此操作将永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await teacherApi.deleteTeacher(row.id)
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.getTeacherList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打开添加教师对话框
    openDialog() {
      this.dialogVisible = true
    },
    // 关闭对话框
    async closeDialog() {
      await this.$refs.form.clearValidate()
      this.dialogVisible = false
      this.form = {
        name: '',
        email: '',
        phone: '',
        class_id: '',
        id_number: '',
        join_time: ''
      }
    }
  }
}
</script>

<style scoped>
#container {
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
