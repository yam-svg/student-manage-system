<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
// 引入中国地图json
import chinaJson from '@/assets/china.json'
import studentApi from '@/api/student'

export default {
  name: 'MapCharts',
  data() {
    return {
      myCharts: null,
      // x轴数据
      provinceData: []
    }
  },
  computed: {
    // 获取最多人数的省份
    maxProvince() {
      let max = 0
      this.provinceData.forEach((item) => {
        if (item.value > max) {
          max = item.value
        }
      })
      return max
    }
  },
  watch: {
    // 监听provinceData变化
    provinceData() {
      // 更新图表数据
      this.myCharts.setOption({
        series: [
          {
            data: this.provinceData
          }
        ]
      })
    },
    // 监听maxProvince变化
    maxProvince() {
      // 更新图表数据
      this.myCharts.setOption({
        visualMap: {
          max: this.maxProvince
        }
      })
    }
  },
  mounted() {
    // 获取学生省份数据
    this.getStudentProvince()
    // 初始化charts实例
    this.myCharts = echarts.init(this.$refs.charts)
    // 使用中国地图
    echarts.registerMap('china', chinaJson)
    // 加载动画
    this.myCharts.showLoading()
    // 渲染图表
    this.renderCharts()
    // 隐藏加载动画
    this.myCharts.hideLoading()
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      this.myCharts.resize()
    })
    // 监听地图点击事件
    this.myCharts.on('click', (params) => {
      this.$router.push({
        name: 'StudentList',
        query: {
          name: params.name,
          type: 3
        }
      })
    })
  },
  methods: {
    // 渲染图表
    renderCharts() {
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '各省市学生人数分布'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} {c}人'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: this.maxProvince,
          text: ['多', '少'],
          realtime: true,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '各省市学生人数分布',
            type: 'map',
            map: 'china',
            // 地图放大
            zoom: 1.1,
            label: {
              show: true
            },
            data: this.provinceData
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myCharts.setOption(option)
    },
    // 获取学生省份数据
    getStudentProvince() {
      studentApi.getProvince().then(res => {
        this.provinceData = res.data
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
