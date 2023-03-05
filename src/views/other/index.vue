<template>
  <div class="other">
    <div v-if="status === 'sph'" style="display: flex;flex-wrap:wrap;padding: 50px;line-height: 1.5em">
      <ul>
        <li>购物商城技术栈: vue2 + vue-router + vuex + axios + es6</li>
        <li>项目介绍：此项目为在线电商 (SPA)，电商包括首页, 搜索列表, 商品详情, 购物车, 订单, 支付, 用户登陆/注册等多个子模块，使用Vue全家桶+ES6+Axios等前端最新最热的技术，采用组件化模式开发。
        </li>
        <li>拆分组件，将完整的HTML页面按功能拆分为组件，便于实现组件化开发，提高代码的复用率和可读性
        </li>
        <li>使用二次封装的Axios请求后台接口，使用Vuex存储数据，实现部分数据多组件间共享
        </li>
        <li>为提高网站性能，使用图片懒加载实现商品搜索界面的展示，同时也使用了路由懒加载，第三方库按需引入，在商品分类使用防抖减少网络请求，提高网站的性能
        </li>
        <li>使用全局路由守卫，限制用户的路由跳转，防止用户在地址栏中输入敏感的地址而不经验证跳转</li>
        <li>完善了商品的支付功能和订单管理，使用QRcode生产支付二维码，实现商品订单的支付功能
        </li>
      </ul>
    </div>
    <div v-if="status === 'sphBack'" style="display: flex;justify-content: center;align-items: center;padding: 50px;line-height: 1.5em">
      <ul>
        <li>商城后台管理系统技术栈: vue2 + vue-router + vuex + axios + element-ui + echarts + es6</li>
        <li> 项目介绍：本项目为物商城后台管理系统，主要有商品管理，品牌管理，权限管理模块。
        </li>
        <li>使用Vue2+Element+Echarts完成后台页面搭建、数据可视化和业务逻辑</li>
        <li> 封装全局组件，使同一个组件可在不同的页面下展示，降低代码的冗余，提高代码的复用
        </li>
        <li>
          为了实现系统的安全保障，完善了权限管理模块，配置常量路由和异步路由，使用Vue-Router实现各模块组件中不同内容的展示和不同用户的权限管理
        </li>
      </ul>
    </div>
    <div v-if="status === 'tank'" style="display: flex;justify-content: center;align-items: center;padding: 50px;line-height: 1.5em">
      <ul>
        <li>坦克大战技术栈: Vanilla + TypeScript + Canvas</li>
        <li>单人游戏，可实现移动、发射子弹、胜利/失败的判定，存在些许bug</li>
      </ul>
    </div>
    <div v-if="status === 'guigu'" style="display: flex;justify-content: center;align-items: center;padding: 50px;line-height: 1.5em">
    </div>

    <div style="display: flex;align-items: center;justify-content: center">
      <a ref="aLink" href="" target="_blank">点击前往</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Other',
  data() {
    return {
      status: ''
    }
  },
  mounted() {
    this.status = this.$route.path.split('/')[2]
    if (this.status === 'sph') {
      this.$refs.aLink.href = 'http://fanshu.xyz:8088'
    } else if (this.status === 'tank') {
      this.$refs.aLink.href = 'http://fanshu.xyz:8081'
    } else if (this.status === 'sphBack') {
      this.$refs.aLink.href = 'http://fanshu.xyz:8082'
    } else if (this.status === 'guigu') {
      this.$refs.aLink.href = 'http://fanshu.xyz:8012'
    } else if (this.status === 'gitee') {
      this.$refs.aLink.href = 'https://gitee.com/bigfanshu'
      this.$refs.aLink.click()
    }
  }
}
</script>

<style scoped>

</style>
