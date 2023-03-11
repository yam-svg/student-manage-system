<template>
  <div ref="charts" class="charts"/>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BarChart',
  props: {
    provinceList: {
      type: Array,
      default: () => []
    },
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mycharts: null,
      xAxisData: [],
      seriesData: []
    }
  },
  watch: {
    provinceList() {
      this.$nextTick(() => {
        this.initEcharts()
      })
    },
    address() {
      this.$nextTick(() => {
        this.getTopFour()
      })
    },
    xAxisData() {
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
    // 获取前四个省份的数据
    this.getTopFour()
  },
  methods: {
    // 初始化图表
    initEcharts() {
      // 初始化charts实例
      this.mycharts.setOption({
        // x轴
        xAxis: {
          type: 'category',
          data: this.xAxisData
        },
        // y轴
        yAxis: {
          show: true
        },
        // 系列
        series: [
          {
            type: 'bar', // 柱状图
            data: this.seriesData,
            label: {
              show: true, // 显示柱状图的文字
              position: 'inside' // 文字显示在柱状图的里面
            },
            // 随机颜色
            itemStyle: {
              color: function() {
                return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
              }
            }
          }
        ],
        // 布局调试
        grid: {
          left: 30,
          top: 10,
          right: 0,
          bottom: 40
        },
        // 鼠标悬浮提示
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        }
      })
    },
    // 获取前四个省份的数据
    getTopFour() {
      // 按照省份的数量进行排序
      const sortList = this.provinceList.sort((a, b) => {
        return b.value - a.value
      })
      const topFour = sortList.slice(0, 4)
      // 获取x轴的数据
      this.xAxisData = topFour.map(item => {
        return item.name
      })
      // 获取series的数据
      this.seriesData = topFour.map(item => {
        return item.value
      })
      // 在最后加上自身的省份
      this.addSelfData()
    },
    // 在最后加上自身的省份
    addSelfData() {
      let address = this.address
      // 省份格式
      if (address === '天津') {
        address = '天津市'
      }
      if (address === '重庆') {
        address = '重庆市'
      }
      if (address === '北京') {
        address = '北京市'
      }
      if (address === '上海') {
        address = '上海市'
      }
      const selfData = this.provinceList.find(item => {
        return item.name === address
      })
      // 判断数据中是否有自身的省份
      const isExist = this.xAxisData.find(item => {
        return item === selfData.name
      })
      if (isExist?.length > 0) {
        console.log(1)
        // 修改省份名称
        this.xAxisData[this.xAxisData.indexOf(isExist)] = '你: ' + selfData.name
        // 修改省份数量
        this.seriesData.splice(this.xAxisData.indexOf(isExist), 1, selfData.value - 1)
      } else {
        this.xAxisData.push('你: ' + selfData.name)
        this.seriesData.push(selfData.value - 1)
      }
    },
    // 传递图表图像给父组件
    getChartImg() {
      const imgUrl = this.mycharts.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      })
      // 执行自定义方法，获取图表图像
      this.$emit('getChart', 1, imgUrl)
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
