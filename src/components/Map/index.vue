<template>
  <div class="map-main" @click.self="showClose">
    <span>{{ address }}</span>
    <div id="map-container" />
  </div>
</template>

<script>
import BMapGL from 'BMapGL'

export default {
  name: 'Map',
  props: {
    address: {
      type: String,
      default: '北京'
    }
  },
  watch: {
    address() {
      this.initMap()
    }
  },
  methods: {
    // 初始化地图
    initMap() {
      // 创建Map实例
      const map = new BMapGL.Map('map-container')
      // 初始化地图,设置中心点坐标和地图级别 地图级别：3-19 地图级别越大，地图显示越详细
      map.centerAndZoom(this.address, 19)
      // 开启鼠标滚轮缩放
      map.enableScrollWheelZoom(true)
    },
    // 关闭地图
    showClose() {
      this.$emit('closeMap')
    }
  }
}
</script>

<style scoped>

.map-main {
  position: absolute;
  width: 100%;
  height: 100vh;
  /*背景透明*/
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.map-main span {
  display: block;
  margin: 0 auto;
  font-weight: bold;
  color: #67c23a;
  text-align: center;
}
#map-container {
  overflow: hidden;
  width: 70%;
  height: 75%;
  margin: 40px auto;
  opacity: 1;
  z-index: 999;
}
</style>
