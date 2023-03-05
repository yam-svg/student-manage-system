<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Index',
  props: {
    genderRatio: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myEcharts: null
    }
  },
  computed: {
    // 随机颜色
    randomColor() {
      const color1 = Math.floor(Math.random() * 123456789).toString(16).slice(0, 6)
      const color2 = Math.floor(Math.random() * 987654321).toString(16).slice(0, 6)
      return ['#' + color1, '#' + color2]
    }
  },
  watch: {
    genderRatio() {
      this.renderCharts()
    }
  },
  mounted() {
    // 初始化charts实例
    this.myEcharts = echarts.init(this.$refs.charts)
    this.renderCharts()
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.myEcharts.resize()
    })
    // 点击事件
    this.myEcharts.on('click', params => {
      this.$router.push({
        name: 'StudentList',
        query: {
          name: params.name,
          type: 2
        }
      })
    })
  },
  methods: {
    // 渲染图表
    renderCharts() {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '90%'],
            // 颜色随机
            color: this.randomColor,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.genderRatio
          }
        ]
      }
      this.myEcharts.setOption(option)
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
