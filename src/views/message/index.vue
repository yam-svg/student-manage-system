<template>
  <div class="main">
    <!--留言 包括内容 邮箱-->
    <div class="container">
      <div class="content">
        <el-input v-model="form.content" placeholder="留言的内容"></el-input>
      </div>
      <div class="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </div>
      <div class="button">
        <el-button size="mini" type="primary" @click="send">留言</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/user'

export default {
  name: 'Message',
  data() {
    return {
      form: {
        content: '',
        email: ''
      }
    }
  },
  methods: {
    send() {
      const { content, email } = this.form
      if (content && email) {
        api.leaveMessage(this.form).then(res => {
          this.$message.success('留言成功')
          this.form.content = ''
          this.form.email = ''
        })
      } else {
        this.$message.error('请输入内容和邮箱')
      }
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.email {
  margin-top: 20px;
}
.button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
