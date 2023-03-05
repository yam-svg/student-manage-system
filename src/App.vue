<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getIpInfo, saveLoginLog } from '@/api/user'
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      ip: {
        ip: '',
        city: ''
      }
    }
  },
  created() {
    getIpInfo().then(res => {
      const ip = res.data?.ip || '127.0.0.1'
      this.ip.ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
      axios.get('https://ipapi.co/' + this.ip.ip + '/json/').then(res => {
        this.ip.city = res.data.city || '未知'
        if (this.ip.city !== '未知') {
          saveLoginLog(this.ip).then(() => {
          })
        }
      })
    })
  }
}
</script>
