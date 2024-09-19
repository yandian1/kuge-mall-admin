import { App } from "vue"
import antd from 'ant-design-vue'

export function ant(app: App) {
  app.use(antd)
}