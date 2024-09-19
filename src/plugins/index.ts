import { App } from 'vue'
import { ant } from './ant'
import { pinia } from './pinia'
import { globComp } from './globComp'

export default function plugins(app: App) {
  ant(app)
  pinia(app)
  globComp(app)
  return app
}
