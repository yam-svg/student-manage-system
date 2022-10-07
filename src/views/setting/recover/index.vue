<template>
  <div id="container">
    <div class="form-list">
      <el-form ref="form" :model="form" label-width="140px" :rules="rules" inline>
        <el-form-item label="请输入邮箱" prop="email">
          <el-input v-model="form.email" clearable placeholder="请输入账号绑定的邮箱"></el-input>
        </el-form-item>
        <el-form-item label="请输入验证码" prop="emailCode">
          <el-input v-model="form.emailCode" clearable placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button ref="timer" :disabled="disable" type="primary" size="mini" @click="getEmailCode">获取验证码</el-button>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" type="password" clearable show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" clearable show-password placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item style="display: block; margin-left: 200px">
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as adminApi from '@/api/user'
import _ from 'lodash'

export default {
  name: 'RecoverPassword',
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
      disable: false,
      form: {
        email: '',
        emailCode: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入账号绑定的邮箱', trigger: 'blur' }
        ],
        emailCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
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
    // 获取邮箱验证码 防抖
    getEmailCode: _.debounce(async function() {
      if (this.form.email) {
        const res = await adminApi.getEmailCode({ email: this.form.email })
        if (res.code === 20000) {
          this.$message.success(res.msg)
          // 按钮不可点击
          this.disable = true
          // 倒计时
          let time = 60
          const timer = setInterval(() => {
            time--
            this.$refs.timer.$el.innerHTML = time + 's'
            if (time === 0) {
              this.disable = false
              clearInterval(timer)
              this.$refs.timer.$el.innerHTML = '获取验证码'
            }
          }, 1000)
        } else {
          this.$message.error(res.msg)
        }
      } else {
        this.$message.error('请输入邮箱')
      }
    }, 1000),
    // 提交表单
    async submitForm() {
      await this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await adminApi.retrievePassword(this.form)
          this.$message.success(res.msg)
          this.$router.push('/login')
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
  width: 600px;
  height: 500px;
}
</style>
