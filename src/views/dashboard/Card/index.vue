<template>
  <div>
    <el-row :gutter="10">
      <!--1各班学生人数-->
      <el-col :span="8">
        <el-card class="box-card">
          <Detail title="各班级人数" :count="total">
            <template slot="carts">
              <barCharts/>
            </template>
            <template slot="footer">
              <span>{{ classPercent }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!--2男女比例-->
      <el-col :span="8">
        <el-card class="box-card">
          <Detail title="男女比例">
            <template slot="carts">
              <pieCharts :gender-ratio="genderRatio"/>
            </template>
            <template slot="footer">
              <span>{{ genderRatioString }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!--3系统登录次数-->
      <el-col :span="8">
        <el-card class="box-card login-info" @click.native="goLoginInfo">
          <Detail title="近七天系统登录次数" :count="sevenDaysLoginCount.toString()">
            <template slot="carts">
              <line-charts ref="lineCharts"/>
            </template>
            <template slot="footer">
              <span>今天 {{ today }} 的登录次数是 {{ todayLoginCount }}， 当前IP：{{ loginIp }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
    <!--地图展示-->
    <div class="map">
      <el-card class="box-card map-style-card">
        <map-charts class="map-style"/>
      </el-card>
    </div>
  </div>
</template>

<script>
import Detail from './Detail/index.vue'
import pieCharts from './pieCharts/index.vue'
import barCharts from './barCharts/index.vue'
import lineCharts from './lineCharts/index.vue'
import mapCharts from '@/views/dashboard/Card/mapCharts'
import studentApi from '@/api/student'
import { getIpInfo } from '@/api/user'
import dayjs from 'dayjs'
import { getSevenDaysLoginLog, saveLoginLog } from '@/api/user'
import axios from 'axios'

export default {
  name: 'Card',
  components: { Detail, pieCharts, barCharts, lineCharts, mapCharts },
  data() {
    return {
      genderRatio: [],
      // 今天登录次数
      todayLoginCount: 0,
      // 七天总登录次数
      sevenDaysLoginCount: 0,
      // 登录ip
      loginIp: ''
    }
  },
  computed: {
    // 计算今天日期
    today() {
      return dayjs().format('MM-DD')
    },
    // 从vuex中获取班级总人数
    total() {
      return this.$store.getters['classL/total'].toString()
    },
    // 获取班级人数的百分比
    classPercentList() {
      return this.$store.getters['classL/classPercent']
    },
    // 计算班级人数的百分比
    classPercent() {
      let res = ''
      this.classPercentList.forEach((item) => {
        const percent = Number(item.percent.toFixed(2))
        res += ' ' + item.name + '：' + Math.round(percent * 100) + '% '
      })
      return res
    },
    // 计算男女比例字符串
    genderRatioString() {
      let string = ''
      this.genderRatio.forEach((item) => {
        string += ' ' + item.name + '：' + item.value + '%， '
      })
      return string.slice(0, -2)
    }
  },
  beforeMount() {
    // 获取男女比例
    this.getGenderRatio()
    // 获取今天登录数据
    this.getLoginData()
  },
  methods: {
    // 获取男女比例
    getGenderRatio() {
      studentApi.getGenderRatio().then(res => {
        this.genderRatio = res.data
      })
    },
    // 获取近七天登录数据
    async getLoginData() {
      // 先存储客户端的ip和城市 防止第一次进入系统时没有登录记录
      const ipInfo = {
        ip: '',
        city: '***'
      }
      getIpInfo().then(res => {
        if (res.data.ip) {
          ipInfo.ip = (res.data.ip || '127.0.0.1').match(/\d+\.\d+\.\d+\.\d+/)[0]
          axios.get('https://ipapi.co/' + ipInfo.ip + '/json/').then(res => {
            ipInfo.city = res.data.city || '未知'
          }).finally(() => {
            // 存储登录记录
            saveLoginLog(ipInfo).then(async() => {
              await this.$refs.lineCharts?.getLoginData()
              // 获取近七天登录数据
              const res = await getSevenDaysLoginLog()
              if (res.code === 20000) {
                // 登录ip
                this.loginIp = res.ipInfo?.ip || ''
                // 正则匹配ip
                this.loginIp = this.loginIp.match(/\d+\.\d+\.\d+\.\d+/)[0] || ''
                this.todayLoginCount = res.data[1][6].value || 0
                // 计算七天总登录次数
                this.sevenDaysLoginCount = res.data[1].reduce((pre, cur) => {
                  return pre + cur.value
                }, 0)
              }
            })
          })
        }
      })
    },
    // 跳转到登录信息页面
    goLoginInfo() {
      this.$router.push('/system/ip')
    }
  }
}
</script>

<style scoped>
.login-info {
  cursor: pointer;
}

.map {
  width: 100%;
  height: 700px;
  padding-bottom: 20px;
  margin-top: 8px;
}

.map-style {
  width: 100%;
  height: 710px;
}

.map-style-card {
  width: 100%;
  height: 750px;
}
</style>
