<template>
  <div ref="charts" class="charts"/>
</template>

<script>
import * as echarts from 'echarts'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {
      mycharts: null
    }
  },
  computed: {
    ...mapGetters('classL', ['classCount']),
    ...mapState('classL', ['classList']),
    classNameList() {
      return this.classList.map(item => item.name)
    }
  },
  watch: {
    // 监听classCount的变化，当classCount发生变化的时候，重新渲染图表
    classCount() {
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
    // 图表的点击事件
    this.mycharts.on('click', params => {
      this.$router.push({
        name: 'StudentList',
        query: {
          name: params.name,
          type: 1
        }
      })
    })
  },
  methods: {
    initEcharts() {
      // 初始化charts实例
      this.mycharts.setOption({
        // x轴
        xAxis: {
          show: false, // 隐藏x轴
          type: 'category',
          data: this.classNameList
        },
        // y轴
        yAxis: {
          show: false
        },
        // 系列
        series: [
          {
            type: 'bar', // 柱状图
            data: this.classCount,
            label: {
              show: true, // 显示柱状图的文字
              position: 'inside' // 文字显示在柱状图的里面
            },
            // 随机颜色
            itemStyle: {
              normal: {
                color: function(params) {
                  return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
                }
              }
            }
          }
        ],
        // 布局调试
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        // 鼠标悬浮提示
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        }
      })
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
