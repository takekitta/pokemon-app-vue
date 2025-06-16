import { createApp } from 'vue'
import 'vue-toastification/dist/index.css'
import ToastPlugin from 'vue-toastification'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.use(ToastPlugin, {
  timeout: 3000,
  position: 'top-center',
})

app.mount('#app')
