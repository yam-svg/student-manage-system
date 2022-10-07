export default {
  username: 'a',
  // 使用自定义指令让input获取焦点
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      }
    }
  }
}
