import { App } from 'vue'

const components: Recordable = import.meta.glob('@/components/**/index.vue', {
  eager: true,
})

export function globComp(app: App) {
  for (let key in components) {
    const component = (components[key] as Recordable).default
    app.component(component.name, component)
  }
}