<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BarChart',
  props: {
    studentInfo: {
      type: Object,
      default: () => {
      }
    },
    total: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      mycharts: null
    }
  },
  computed: { // 随机颜色
    randomColor() {
      const color1 = Math.floor(Math.random() * 123456789).toString(16).slice(0, 6)
      const color2 = Math.floor(Math.random() * 987654321).toString(16).slice(0, 6)
      return ['#' + color1, '#' + color2]
    }
  },
  watch: {
    studentInfo() {
      this.$nextTick(() => {
        this.initEcharts()
      })
    }
  },
  mounted() {
    // 初始化图表
    this.mycharts = echarts.init(this.$refs.charts)
    // 初次渲染图表
    this.initEcharts()
    // 当浏览器发生resize事件的时候，让其触发echarts的resize事件，重绘canvas
    window.addEventListener('resize', () => {
      this.mycharts.resize()
    })
  },
  methods: {
    // 初始化图表
    initEcharts() {
      // 初始化charts实例
      this.mycharts.setOption({
        // 标题
        title: {
          show: true,
          text: '成绩排名',
          left: 'center',
          textStyle: {
            color: 'gray',
            fontSize: 14
          }
        },
        // x轴
        xAxis: {
          show: false, // 隐藏x轴
          // 最大值与最小值
          max: this.total,
          min: 0
        },
        // y轴
        yAxis: {
          show: false,
          type: 'category' // 均分  在y轴横向显示,
        },
        // 系列
        series: [
          {
            type: 'bar', // 柱状图
            data: [this.studentInfo.rank],
            color: this.randomColor,
            // 柱状图宽度
            barWidth: 25,
            // 背景及颜色
            showBackground: true,
            backgroundStyle: {
              // 随机颜色
              color: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},0.2)`
            },
            // 文本
            label: {
              show: true,
              formatter: this.studentInfo.rank + ' / ' + this.total, // 文本内容 默认是数字
              position: 'top'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          // 显示格式
          formatter: '{c}'
        },
        // 布局调试
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }
      })
    },
    // 传递图表图像给父组件
    getChartImg() {
      const imgUrl = this.mycharts.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      // 执行自定义方法，获取图表图像
      this.$emit('getChart', 4, imgUrl)
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
