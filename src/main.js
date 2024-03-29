import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import VueZoomer from 'vue-zoomer'
import router from './router'
Vue.use(VueZoomer)
Vue.config.productionTip = false

new Vue({
  store,  
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')


