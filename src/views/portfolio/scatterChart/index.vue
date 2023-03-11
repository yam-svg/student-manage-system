<template>
  <div ref="charts" class="charts"/>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ScatterChart',
  props: {
    scoreList: {
      type: Array,
      default: () => {
      }
    }
  },
  data() {
    return {
      mycharts: null,
      xAxisData: [],
      average: 0
    }
  },
  watch: {
    scoreList() {
      this.getData()
      this.initEcharts()
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
    initEcharts() {
      // 标线
      const markLineOpt = {
        tooltip: {
          formatter: '平均分：' + this.average
        },
        lineStyle: {
          type: 'solid'
        },
        data: [
          [
            // 通过coord指定标线起点的位置
            {
              coord: [0, this.average],
              symbol: 'none'
            },
            // 通过coord指定标线终点的位置
            {
              coord: [11, this.average],
              symbol: 'none'
            }
          ]
        ]
      }
      // 绘制图表
      this.mycharts.setOption({
        title: {
          show: true,
          text: '成绩散点图',
          textStyle: {
            color: 'gray',
            fontSize: 14
          },
          left: 'center'
        },
        tooltip: {
          // 这个{a}表示series中的name {b}表示series中的data中的name {c}表示series中的data中的value
          formatter: (params) => {
            return `${params.data.name}：${params.data.value[1]}`
          }
        },
        xAxis: [
          { gridIndex: 0, min: 0, max: 11 }
        ],
        yAxis: [
          { gridIndex: 0, min: 0, max: 100 }
        ],
        series: [
          {
            name: '成绩',
            type: 'scatter',
            symbolSize: 10,
            data: this.xAxisData,
            markLine: markLineOpt
          }
        ]
      })
    },
    // 获取数据
    getData() {
      const xAxisData = this.scoreList.map((item, index) => {
        return {
          name: item.name,
          value: [index + 1, item.score]
        }
      })
      // 除去平均分和总分
      xAxisData.pop()
      xAxisData.pop()
      this.xAxisData = xAxisData
      this.average = this.scoreList[this.scoreList.length - 2].score
    },
    // 传递图表图像给父组件
    getChartImg() {
      const imgUrl = this.mycharts.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      // 执行自定义方法，获取图表图像
      this.$emit('getChart', 3, imgUrl)
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
