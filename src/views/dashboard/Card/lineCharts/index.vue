<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import { getSevenDaysLoginLog } from '@/api/user'

export default {
  name: 'LineCharts',
  data() {
    return {
      myCharts: null,
      // x轴数据 - 日期
      xAxis: [],
      // x轴数据 - 登录次数
      xAxisData: []
    }
  },
  watch: {
    // 监听xAxisData变化
    xAxisData() {
      this.renderCharts()
    }
  },
  mounted() {
    this.getLoginData()
    // 初始化charts实例
    this.myCharts = echarts.init(this.$refs.charts)
    this.renderCharts()
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.myCharts.resize()
    })
  },
  methods: {
    // 渲染图表
    renderCharts() {
      // 指定图表的配置项和数据
      const option = {
        xAxis: {
          show: false,
          // x轴数据为最近7天 格式为MM-DD
          data: this.xAxis
        },
        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            type: 'line',
            data: this.xAxisData,
            // 折线颜色每次都不一样
            itemStyle: {
              color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
                Math.random() * 255
              )},${Math.floor(Math.random() * 255)})`
            }
          }
        ],
        grid: {
          left: 0,
          right: 0,
          bottom: 3,
          top: 3
        },
        tooltip: {
          trigger: 'axis'
        }
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myCharts.setOption(option)
    },
    // 获取近七天登录数据
    async getLoginData() {
      const res = await getSevenDaysLoginLog()
      if (res.code === 20000) {
        // 获取日期
        this.xAxis = res.data[0]
        // 获取x轴数据
        this.xAxisData = res.data[1]
      }
    }
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
