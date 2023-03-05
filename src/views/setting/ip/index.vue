<template>
  <div style="padding: 20px">
    <el-table :data="ipList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80"/>
      <el-table-column prop="ip" label="IP"/>
      <el-table-column prop="city" label="地址"/>
      <el-table-column prop="data" label="时间"/>
    </el-table>
    <span style="font-size: 12px;color: gray">*登录记录会定时删除</span>
  </div>
</template>

<script>
import { getLoginLog } from '@/api/user'

export default {
  name: 'IP',
  data() {
    return {
      ipList: []
    }
  },
  mounted() {
    this.getIpList()
  },
  methods: {
    // 获取IP列表
    getIpList() {
      getLoginLog().then(res => {
        this.ipList = res.data
      })
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
</style>
