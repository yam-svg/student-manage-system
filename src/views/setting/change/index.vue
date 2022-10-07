<template>
  <div>
    <el-steps style="padding: 20px" :active="active" align-center>
      <el-step title="步骤1" description="验证原来的邮箱" />
      <el-step title="步骤2" description="验证新的邮箱是否可用" />
      <el-step title="步骤3" description="完成绑定" />
    </el-steps>
    <div id="container">
      <!-- 步骤一 -->
      <div v-if="active === 1" class="form-list">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules" inline>
          <el-form-item label="请输入邮箱" prop="email">
            <el-input v-model="form.email" clearable placeholder="请输入账号绑定的邮箱" />
          </el-form-item>
          <el-form-item label="请输入验证码" prop="emailCode">
            <el-input v-model="form.emailCode" clearable placeholder="请输入验证码" />
          </el-form-item>
          <el-form-item label="">
            <el-button ref="timer" :disabled="disable" type="primary" size="mini" @click="getEmailCode">获取验证码</el-button>
          </el-form-item>
          <el-form-item style="display: block; margin-left: 200px">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 步骤二 -->
      <div v-if="active === 2" class="form-list">
        <el-form ref="form" :model="form" label-width="140px" :rules="rules" inline>
          <el-form-item label="请输入新邮箱" prop="email">
            <el-input v-model="form.email" clearable placeholder="请输入新的邮箱账号" />
          </el-form-item>
          <el-form-item label="请输入验证码" prop="emailCode">
            <el-input v-model="form.emailCode" clearable placeholder="请输入验证码" />
          </el-form-item>
          <el-form-item label="">
            <el-button ref="timer1" :disabled="disable1" type="primary" size="mini" @click="getEmailCode">获取验证码</el-button>
          </el-form-item>
          <el-form-item style="display: block; margin-left: 200px">
            <el-button type="primary" @click="active--">上一步</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--完成-->
      <div v-if="active === 3" class="form-list">
        <el-result icon="success" title="更换成功" sub-title="您已成功更换绑定邮箱, 立即生效">
          <template slot="extra">
            <el-button type="primary" size="medium" @click="$router.push('/')">返回</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script>
import * as adminApi from '@/api/user'
import _ from 'lodash'

export default {
  name: 'Change',
  data() {
    return {
      disable: false,
      disable1: false,
      timer: null,
      active: 1,
      form: {
        email: '',
        emailCode: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入账号绑定的邮箱', trigger: 'blur' }
        ],
        emailCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取邮箱验证码 防抖
    getEmailCode: _.debounce(async function() {
      if (this.form.email) {
        let codeVerify = ''
        if (this.active === 2) {
          codeVerify = 1
        }
        const res = await adminApi.getEmailCode({ email: this.form.email, codeVerify })
        if (res.code === 20000) {
          this.$message.success(res.msg)
          // 按钮不可点击
          if (this.active === 1) {
            this.disable = true
          } else {
            this.disable1 = true
          }
          // 判断是哪个按钮应该倒计时
          const timerCode = this.active === 1 ? this.$refs.timer : this.$refs.timer1
          // 倒计时
          let time = 60
          this.timer = setInterval(() => {
            time--
            timerCode.$el.innerHTML = time + 's'
            if (time === 0) {
              this.disable = false
              this.disable1 = false
              clearInterval(this.timer)
              timerCode.$el.innerHTML = '获取验证码'
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
          if (this.active === 1) {
            const res = await adminApi.confirmEmailCode(this.form)
            if (res.code === 20000) {
              this.$message.success(res.msg)
              this.active++
              clearInterval(this.timer)
              this.disable = false
              this.$nextTick(() => {
                this.$refs.timer1.$el.innerHTML = '获取验证码'
              })
              this.form = {
                email: '',
                emailCode: ''
              }
            } else {
              this.$message.error(res.msg)
            }
          } else if (this.active === 2) {
            const res = await adminApi.updateEmail(this.form)
            if (res.code === 20000) {
              this.$message.success(res.msg)
              this.active++
            } else {
              this.$message.error(res.msg)
            }
          }
        } else {
          this.$message.error('请填写完整信息')
        }
      })
    }
  }
}
</script>

<style scoped>
#container {
  padding: 20px;
}
.form-list {
  margin: 30px auto 0;
  width: 500px;
}
</style>
