<template>
  <div style="padding: 20px">
    <!--工具条-->
    <el-form ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item>
        <el-button v-if="isStudentList" size="mini" type="primary" @click="$router.push('add')">添加学生</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isStudentList || isGraduateList" size="mini" type="danger" @click="batchRemove">批量删除
        </el-button>
        <el-button v-if="isRecycleList" type="success" size="mini" @click="batchRecovery">批量恢复</el-button>
        <el-button v-if="isRecycleList" type="danger" size="mini" @click="batchDelDeep">批量彻底删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isStudentList" size="mini" type="warning" @click="importBtn">导入学生</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isStudentList" size="mini" type="success" @click="exportBtn">导出学生</el-button>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input v-model.trim="searchForm.name" size="mini" clearable placeholder="请输入学生姓名" @input="search" />
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model.trim="searchForm.class" size="mini" clearable placeholder="请选择班级" @change="search">
          <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!--入学时间-->
      <el-form-item label="入学时间">
        <el-date-picker
          v-model="searchForm.startTime"
          type="date"
          size="mini"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          style="width: 150px"
        />
        -
        <el-date-picker
          v-model="searchForm.endTime"
          type="date"
          size="mini"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--数据表格-->
    <el-table :data="studentList" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" width="50">
        <template v-slot="{ row, $index }">
          <span>{{ (page - 1) * limit + $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="150">
        <template v-slot="{ row }">
          <img :src="row.avatar" style="width: 60%; height: 60%">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="sex" label="性别" width="50" />
      <el-table-column label="年龄" width="50">
        <template v-slot="{row}">
          {{ getAge(row.id_number) }}
        </template>
      </el-table-column>
      <el-table-column label="班级" width="95">
        <template v-slot="{row}">
          <el-tag :type="getTagType(row.class)">{{ getClass(row.class) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="father_name" label="监护人" width="100" />
      <el-table-column prop="father_tel" label="联系电话" width="120" />
      <el-table-column prop="address" label="住址" width="200" />
      <el-table-column prop="id_number" label="身份证" width="180" />
      <el-table-column label="入学时间" width="100">
        <template v-slot="{row}">
          {{ getEnterTime(row.create_time) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="80">
        <template v-slot="{ row }">
          {{ getRemark(row.remark) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <div v-if="isStudentList || isGraduateList">
            <el-button type="text" size="small" @click="edit(row)">编辑</el-button>
            <el-button type="text" size="small" @click="del(row)">删除</el-button>
          </div>
          <div v-else>
            <el-button type="text" size="small" @click="recovery(row)">恢复</el-button>
            <el-button type="text" size="small" @click="delDeep(row)">彻底删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center;margin-top: 15px"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20, total]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!--导出对话框-->
    <el-dialog
      title="导出为Excel表格"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="form" inline>
        <el-form-item label="选择需要导出的表头, 请安顺序点击, 否则导出的表格顺序不对">
          <el-checkbox-group v-model="chooseTag">
            <el-checkbox v-for="(item, index) in excelTag" :key="item.key" :checked="item.checked" :label="item">
              <el-input
                v-show="currentIndex === index"
                ref="titleInput"
                v-model="item.label"
                class="title-input"
                :style="{width: inputWidth + 'em'}"
                size="mini"
                @input="inputWidth = $event.length + 1"
                @blur="closeEdit"
              />
              <span v-show="currentIndex !== index">{{ item.label }}</span>
              <i class="el-icon-edit" @click.prevent="changeStatus($event, index)" />
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="导出的表头顺序">
          <span v-for="item in getOrder()" :key="item" style="padding: 5px">{{ getTitleName(item) }}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="reverse">反选</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: flex; justify-content: center; align-items: center" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!--导入对话框-->
        <el-button type="primary" @click="exportExcel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="导入Excel表格"
      :visible.sync="importDialogVisible"
      width="400px"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        action="http://fanshu.xz:8080/api/student/importExcel"
        :auto-upload="false"
        :on-success="handleSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import studentApi from '@/api/student'
import { mapState } from 'vuex'
import { createWs, sheet2blob, openDownloadDialog } from '@/utils/excel'
import _ from 'lodash'

export default {
  name: 'StudentList',
  data() {
    return {
      studentList: [],
      // 选择导出的学生列表
      exportStudentList: [],
      inputWidth: '2',
      total: 0,
      page: 1,
      limit: 5,
      // 0获取未删除的学生列表，1获取已删除的学生列表
      status: 0,
      searchForm: {
        name: '',
        class: '',
        startTime: '',
        endTime: '',
        sex: '',
        address: ''
      },
      // 跳转过来的查询参数
      dashboardParams: {},
      // 批量删除的学生id
      ids: [],
      dialogVisible: false,
      importDialogVisible: false,
      excelTag: [
        { label: '姓名', key: 'name', checked: true },
        { label: '性别', key: 'sex', checked: true },
        { label: '年龄', key: 'age', checked: true },
        { label: '班级', key: 'class', checked: true },
        { label: '监护人', key: 'father_name', checked: true },
        { label: '联系电话', key: 'father_tel', checked: true },
        { label: '住址', key: 'address', checked: true },
        { label: '身份证', key: 'id_number', checked: true },
        { label: '入学时间', key: 'create_time', checked: true },
        { label: '备注', key: 'remark', checked: true }
      ],
      currentIndex: -1,
      chooseTag: []
    }
  },
  computed: {
    // 从vuex中获取班级列表
    ...mapState('classL', ['classList']),
    // 根据身份证号码计算年龄
    getAge() {
      return function(idNumber) {
        const year = idNumber.substring(6, 10)
        const month = idNumber.substring(10, 12)
        const day = idNumber.substring(12, 14)
        const birthday = new Date(year + '-' + month + '-' + day)
        const now = new Date()
        return now.getFullYear() - birthday.getFullYear()
      }
    },
    // 获取班级名称
    getClass() {
      return (classId) => {
        let className = ''
        this.classList.forEach(item => {
          if (item.id === classId) {
            className = item.name
          }
        })
        return className
      }
    },
    // 班级标签样式
    getTagType() {
      return (classId) => {
        let tagType = ''
        if (classId === 1) {
          tagType = 'success'
        } else if (classId === 2) {
          tagType = 'warning'
        } else if (classId === 3) {
          tagType = 'danger'
        } else {
          tagType = 'info'
        }
        return tagType
      }
    },
    // 获取入学时间
    getEnterTime() {
      return (createTime) => {
        const date = new Date(createTime)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return year + '-' + month + '-' + day
      }
    },
    // 获取备注
    getRemark() {
      return (remark) => {
        let newRemark = ''
        if (remark === 0) {
          newRemark = '无'
        } else if (remark === 1) {
          newRemark = '低收入'
        } else {
          newRemark = '低保户'
        }
        return newRemark
      }
    },
    // 判断当前页面是否是学生列表页面
    isStudentList() {
      return this.$route.path.indexOf('list') > 0
    },
    // 判断当前页面是否是毕业学生页面
    isGraduateList() {
      return this.$route.path.indexOf('graduate') > 0
    },
    // 判断当前页面是否是回收站页面
    isRecycleList() {
      return this.$route.path.indexOf('recovery') > 0
    },
    // 表头顺序
    getOrder() {
      return () => {
        const fields = []
        this.chooseTag.forEach(item => {
          fields.push(item.key)
        })
        fields.unshift('index')
        return fields
      }
    },
    // 获得表头的中文名
    getTitleName() {
      return (title) => {
        let name = ''
        this.excelTag.forEach(item => {
          if (item.key === title) {
            name = item.label
          }
        })
        return name
      }
    }
  },
  mounted() {
    // 派发action，获取班级列表
    this.$store.dispatch('classL/getClassList')
    if (this.isStudentList) {
      this.status = 0
    } else if (this.isRecycleList) {
      this.status = 1
    } else {
      this.status = 2
    }
    // 获取首页传过来的查询参数
    this.dashboardParams = this.$route.query
    // 1 班级 2 性别 3 省市区
    const type = this.dashboardParams.type
    if (type === 1) {
      // 班级
      if (this.dashboardParams.name) {
        this.searchForm.class = this.getClassId(this.dashboardParams.name)
      }
    } else if (type === 2) {
      // 性别
      if (this.dashboardParams.name) {
        this.searchForm.sex = this.dashboardParams.name
      }
    } else if (type === 3) {
      // 省市区
      if (this.dashboardParams.name) {
        this.searchForm.address = this.dashboardParams.name
      }
    }
    // 获取学生列表
    this.getStudentList()
  },
  methods: {
    // 获取学生列表
    getStudentList() {
      studentApi.getStudentList({
        status: this.status,
        page: this.searchForm?.name?.length > 0 ? 1 : this.page,
        pageSize: this.limit
      }, this.searchForm).then(res => {
        this.studentList = res.data
        this.total = res.total
      }).catch()
    },
    // 编辑学生
    edit(row) {
      this.$router.push({ path: '/student/edit/' + row.id })
    },
    // 删除学生
    del(row) {
      this.$confirm('此操作将删除该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.deleteStudent(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 彻底删除学生
    delDeep(row) {
      // 不允许删除
      this.$message({
        type: 'error',
        message: '数据不允许删除'
      })
      return
      this.$confirm('此操作将彻底删除该学生, 此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.deleteStudentForever(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 恢复学生
    recovery(row) {
      this.$confirm('此操作将恢复该学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.recoverStudent(row.id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    // 搜索学生
    search() {
      // 整理数据 清除空字段
      for (const key in this.searchForm) {
        if (this.searchForm[key] === '') {
          delete this.searchForm[key]
        }
      }
      this.getStudentList()
    },
    // 批量删除学生
    batchRemove() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的学生'
        })
        return
      }
      this.$confirm('此操作将删除选中学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.batchDeleteStudent(this.ids).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量彻底删除学生
    batchDelDeep() {
      // 不允许删除
      this.$message({
        type: 'error',
        message: '数据不允许删除'
      })
      return
      if (this.ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的学生'
        })
        return
      }
      this.$confirm('此操作将彻底删除选中学生, 此操作不可逆, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.deleteStudentForeverBatch(this.ids).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量恢复学生
    batchRecovery() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要恢复的学生'
        })
        return
      }
      this.$confirm('此操作将恢复选中学生, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        studentApi.batchRecoverStudent(this.ids).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.getStudentList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        })
      })
    },
    // 多选框选中事件
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
      this.exportStudentList = val
    },
    // 导出学生按钮
    exportBtn() {
      if (this.exportStudentList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要导出的学生'
        })
        return
      }
      this.dialogVisible = true
    },
    // 导出学生 ---- 服务器端导出
    // exportExcel() {
    //   this.dialogVisible = false
    //   // 加上年龄字段
    //   this.studentList.forEach(item => {
    //     item.age = this.getAge(item.id_number)
    //   })
    //   // 整理数据
    //   const excelObj = {
    //     student: this.studentList,
    //     tag: this.chooseTag
    //   }
    //   // 导出excel
    //   studentApi.exportExcel(excelObj).then(res => {
    //     console.log(res)
    //     // 数组扁平化
    //     this.$message({
    //       type: 'success',
    //       message: res.msg
    //     })
    //     // 将文件流转换为blob对象
    //     const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    //     // 创建a标签
    //     const a = document.createElement('a')
    //     // 创建一个url对象
    //     const url = window.URL.createObjectURL(blob)
    //     // 设置a标签的href属性
    //     a.href = url
    //     // 设置a标签的download属性
    //     a.download = '学生信息表'
    //     // 将a标签添加到body中
    //     document.body.appendChild(a)
    //     // 模拟点击a标签
    //     a.click()
    //     // 移除a标签
    //     document.body.removeChild(a)
    //     // 释放url对象
    //     window.URL.revokeObjectURL(url)
    //   })
    // },
    // 导出学生 ---- 客户端导出
    exportExcel() {
      if (this.chooseTag.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个导出的字段'
        })
        return
      }
      this.dialogVisible = false
      // 为了不影响到服务端的导出 这里重新整理数据 不修改原来的数据
      // 导出的表格的表头
      const titles = {}
      // 字段名,对应表头 顺序无要求 但是要和表格的字段名一致
      const fields = this.getOrder()
      // 表头数据以键值对的形式 如 {name: '姓名', age: '年龄'} 字段数据以数组的形式 如 ['name', 'age']
      this.chooseTag.forEach(item => {
        titles[item.key] = item.label
      })
      // 添加序号字段
      titles['index'] = '序号'
      // 复制数组
      const student = _.cloneDeep(this.exportStudentList)
      // 字段转换
      student.forEach(item => {
        item.age = this.getAge(item.id_number)
        item.class = this.getClass(item.class)
        item.create_time = this.getEnterTime(item.create_time)
        item.remark = this.getRemark(item.remark)
      })
      // 删除不需要和没选中的字段
      student.forEach((item, index) => {
        Object.keys(item).forEach(key => {
          if (!fields.includes(key)) {
            delete item[key]
          }
        })
        item.index = index + 1
      })

      const ws = createWs(
        student,
        fields,
        titles,
        1
      )
      // 导出excel
      openDownloadDialog(sheet2blob(ws), '学生信息.xlsx')
    },
    // 导出反选
    reverse() {
      this.excelTag.forEach(item => {
        // 如果选中的标签中有这个标签 就删除
        if (this.chooseTag.includes(item)) {
          this.chooseTag.splice(this.chooseTag.indexOf(item), 1)
        } else {
          // 如果选中的标签中没有这个标签 就添加
          this.chooseTag.push(item)
        }
      })
    },
    // 导入学生按钮
    importBtn() {
      this.$message({
        type: 'info',
        message: '表头只能包含 姓名 性别 班级 监护人 联系电话 住址 身份证 入学时间 备注 这几个字段, 其他内容无效',
        duration: 10000
      })
      this.importDialogVisible = true
    },
    // 上传excel按钮
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 上传成功
    handleSuccess(res) {
      this.$message({
        type: 'success',
        message: res.msg
      })
      this.importDialogVisible = false
      this.getStudentList()
    },
    // 上传前验证
    beforeAvatarUpload(file) {
      // 只能是excel文件
      // 获取文件后缀名
      const suffix = file.name.split('.')[1]
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message.error('上传文件只能是excel文件!')
        return false
      }
      return true
    },
    // 表头编辑状态
    changeStatus(e, index) {
      if (this.currentIndex === index) {
        this.currentIndex = -1
      } else {
        this.currentIndex = index
      }
      // 输入框的长度
      this.inputWidth = this.$refs.titleInput[index].value.length + 1
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs.titleInput[index].focus()
      })
    },
    // 表头的编辑状态关闭
    closeEdit() {
      this.currentIndex = -1
    },
    // 分页大小变化
    handleSizeChange(size) {
      console.log(size)
      this.limit = size
      this.getStudentList()
    },
    // 当前页变化
    handleCurrentChange(page) {
      this.page = page
      this.getStudentList()
    },
    // 根据班级名称获取班级id
    getClassId(className) {
      let classId = ''
      this.classList.forEach(item => {
        if (item.name === className) {
          classId = item.id
        }
      })
      return classId
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

/*导出弹出框的输入框*/
/deep/ .title-input .el-input__inner {
  padding: 0;
}
</style>
