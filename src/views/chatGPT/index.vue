<template>
  <div class="main">
    <div class="container">
      <input ref="input" :disabled="disabled" type="text">
      <el-button style="margin-left: 10px" :disabled="disabled" size="mini" type="primary" @click="send">发送</el-button>
      <br>
    </div>
    <p ref="info" class="text" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ChatGPT',
  data() {
    return {
      disabled: false,
      info: ['.', '.', '.', '内', '容', '获', '取', '中', '.']
    }
  },
  methods: {
    send() {
      const value = this.$refs.input.value
      let index = 0

      // 发送数据
      if (value) {
        this.disabled = true
        this.$refs.info.innerText = ''
        // 显示内容获取中...
        const interval = setInterval(() => {
          this.$refs.info.innerText += this.info[index]
          index++
          if (index > this.info.length - 1) {
            index = 0
            this.$refs.info.innerText = ''
          }
        }, 250)
        axios({
          method: 'get',
          // 这里是后端接口地址 区分开发环境和生产环境
          url: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080/api/admin/chatGPT' : 'http://fanshu.xyz:8080/api/admin/chatGPT',
          params: {
            query: value
          }
        }).then(res => {
          clearInterval(interval)
          this.disabled = false
          // 将数据展示
          this.$refs.info.innerText = res.data.data
        })
        this.$refs.input.value = ''
      } else {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
.text {
  padding: 20px;
}
.main {
  width: 100%;
  height: 120px;
}
.container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
