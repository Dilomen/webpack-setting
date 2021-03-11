// 可以直接通过在该根目录下使用以下指令直接启动
// serein run -e ./index.js
import Vue from 'vue'
import App from './App.vue'
new Vue({
  el: '#root',
  components: { App },
  template: '<App></App>'
})