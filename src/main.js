import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
// eslint-disable-next-line no-unused-vars
Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
