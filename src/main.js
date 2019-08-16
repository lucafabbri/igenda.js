import Vue from 'vue'
import Igenda from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Igenda),
}).$mount('#app')
