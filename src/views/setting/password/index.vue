<template>
  <div id="container">
    <div class="form-list">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" type="password" clearable show-password placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" clearable show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" clearable show-password placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入md5加密
import crypto from 'crypto'
import * as userApi from '@/api/user'

export default {
  name: 'Password',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      // 不允许修改
      this.$message.error('不允许修改')
      return
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 对密码进行加密
          const pass = {}
          pass.oldPassword = crypto.createHash('md5').update(this.form.oldPassword).digest('hex')
          pass.newPassword = crypto.createHash('md5').update(this.form.newPassword).digest('hex')
          pass.confirmPassword = crypto.createHash('md5').update(this.form.confirmPassword).digest('hex')
          // 调用修改密码接口
          userApi.updatePassword(pass).then(res => {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.$router.push({ path: '/' })
          })
        } else {
          this.$message.error('请检查输入')
        }
      })
    }
  }
}
</script>

<style scoped>
#container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-list {
  width: 300px;
  height: 300px;
}
</style>
