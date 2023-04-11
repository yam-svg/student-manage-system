<template>
  <div id="container">
    <el-form ref="form" :model="student" label-width="120px" :rules="rules">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="student.name" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="student.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="班级" prop="sex">
        <el-radio-group v-model="student.class">
          <el-radio v-for="item in classList" :key="item.id" :label="item.id">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-radio-group v-model="student.remark">
          <el-radio :label="1">低收入</el-radio>
          <el-radio :label="2">低保户</el-radio>
          <el-radio :label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学院" prop="college">
        <el-select v-model="student.college" @change="handleMajorChange" placeholder="请选择学院">
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="major_id">
        <el-select v-model="student.major_id" placeholder="请选择专业">
          <el-option
            v-for="item in majorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监护人姓名" prop="father_name">
        <el-input v-model.trim="student.father_name" />
      </el-form-item>
      <el-form-item label="入学时间" prop="create_time">
        <el-date-picker v-model="student.create_time" value-format="yyyy-MM-dd" type="date" placeholder="time" />
      </el-form-item>
      <el-form-item label="联系电话" prop="father_tel">
        <el-input v-model.trim="student.father_tel" />
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <!--地区选择器-->
        <el-cascader
          v-model="selectedOptions"
          style="width: 25%;"
          size="large"
          :options="options"
          @change="handleChange">
        </el-cascader>
        <!--详细地址-->
        <span> 详细地址: </span>
        <el-input v-model.trim="tempAddress" :disabled="!selectAddress" @input="bindAddress"/>
        <br>
        <el-input :value="student.address" size="mini" disabled placeholder="详细住址"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码" prop="id_number">
        <el-input v-model.trim="student.id_number" @input="getSex" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://fanshu.xyz:8080/api/student/upload/avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="student.avatar" :src="student.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-folder-checked" type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import studentApi from '@/api/student'
import { mapState } from 'vuex'
import { regionData, CodeToText } from 'element-china-area-data'
import { getCollegeList } from '@/api/college'
import { getMajorListByCollegeId } from '@/api/major'

export default {
  name: 'AddStudent',
  data() {
    return {
      // 学院列表
      collegeList: [],
      // 专业列表
      majorList: [],
      student: {
        avatar: '',
        name: '',
        sex: '男',
        class: 1,
        father_name: '',
        father_tel: '',
        id_number: '',
        address: '',
        college: null,
        major_id: null,
        create_time: '',
        remark: 0
      },
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        college: [
          { required: true, message: '请选择学院', trigger: 'blur' }
        ],
        major_id: [
          { required: true, message: '请选择专业', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        father_name: [
          { required: true, message: '请输入监护人名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        father_tel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        create_time: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        id_number: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证格式不正确', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      // 地区选择器选项
      options: regionData,
      // 地区选择器选中的值
      selectedOptions: [],
      selectAddress: '',
      // 详细地址
      tempAddress: ''
    }
  },
  computed: {
    ...mapState('classL', ['classList'])
  },
  beforeMount() {
    // if (!this.$route.params.id) {
    //   // 提示信息 是否自动随机添加学生
    //   this.$confirm('是否自动随机添加学生', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     // 点击确定
    //     for (let i = 0; i < 30; i++) {
    //       axios.get('http://127.0.0.1:4523/mock/2322579/get/studentlist').then(res => {
    //         this.student = res.data
    //         studentApi.addStudent(this.student).then(res => {
    //           if (res.code === 20000) {
    //             this.$message.success(res.msg)
    //           }
    //         }).catch(err => {
    //           console.log(err)
    //         })
    //       })
    //     }
    //   }).catch(() => {
    //     // 点击取消
    //     this.$message.info('取消')
    //   })
    // }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getStudentInfo()
    }
    // 获取学院列表
    this.getCollegeList()
  },
  methods: {
    // 获取学生信息
    getStudentInfo() {
      studentApi.getStudentInfo(this.$route.params.id).then(res => {
        this.student = res.data
        // 获取专业列表
        this.getMajorList()
      })
      // 对时间进行格式化
      this.student.create_time = new Date(this.student.create_time)
    },
    // 获取学院列表
    getCollegeList() {
      getCollegeList().then(res => {
        this.collegeList = res.data
      }).catch()
    },
    // 获取专业列表
    getMajorList() {
      getMajorListByCollegeId(this.student.college).then(res => {
        this.majorList = res.data
      }).catch()
    },
    // 保存按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.student.id ? this.update() : this.add()
        } else {
          this.$message.warning('请检查表单信息')
        }
      })
    },
    // 根据身份证判断性别
    getSex() {
      if (this.student.id_number.length >= 17) {
        const sex = this.student.id_number.at(16) % 2 === 0 ? '女' : '男'
        if (this.student.sex !== sex) {
          this.student.sex = sex
          this.$message.info('已根据身份证修改学生性别为: ' + sex)
        }
      }
    },
    // 添加学生
    add() {
      studentApi.addStudent(this.student).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.msg)
          this.$router.push('/student/list')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 更新学生
    update() {
      studentApi.updateStudent(this.student).then(res => {
        if (res.code === 20000) {
          this.$message.success(res.msg)
          this.$router.push('/student/list')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.student.avatar = res.data
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return true
    },
    // 地区选择器回调
    handleChange() {
      let loc = ''
      for (let i = 0; i < this.selectedOptions.length; i++) {
        loc += CodeToText[this.selectedOptions[i]] + ' '
      }
      this.selectAddress = loc + this.tempAddress
      this.student.address = this.selectAddress
    },
    // 合并地址
    bindAddress() {
      const temp = this.selectAddress || this.student.address
      this.student.address = temp + this.tempAddress
    },
    // 学院选择器回调
    handleMajorChange() {
      this.student.major_id = ''
      this.getMajorList()
    }
  }
}
</script>

<style scoped>
#container {
  padding: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/*el-input的长度*/
.el-input {
  width: 400px;
}
</style>
