<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Index',
  props: {
    scoreList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myEcharts: null,
      // 90分以上的科目数
      goodSubject: 0,
      // 60-90分的科目数
      middleSubject: 0,
      // 不及格的科目数
      badSubject: 0,
      // 饼图数据
      pieData: []
    }
  },
  watch: {
    scoreList() {
      this.$nextTick(() => {
        // 清空科目数
        this.goodSubject = 0
        this.middleSubject = 0
        this.badSubject = 0
        this.countSubject()
      })
    },
    pieData() {
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
    // 计算科目数
    this.countSubject()
  },
  methods: {
    // 渲染图表
    renderCharts() {
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.myEcharts.setOption(option)
    },
    // 计算科目数
    countSubject() {
      this.scoreList.forEach(item => {
        if (item.name !== '总分' && item.name !== '平均分') {
          if (item.score >= 90) {
            this.goodSubject++
          } else if (item.score >= 60) {
            this.middleSubject++
          } else {
            this.badSubject++
          }
        }
      })
      this.pieData = [
        { value: this.goodSubject, name: '优秀科目' },
        { value: this.middleSubject, name: '中等科目' },
        { value: this.badSubject, name: '不及格科目' }
      ]
    },
    // 传递图表图像给父组件
    getChartImg() {
      const imgUrl = this.myEcharts.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      // 执行自定义方法，获取图表图像
      this.$emit('getChart', 2, imgUrl)
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
