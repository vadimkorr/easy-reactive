import { subscription } from './utils/subscription'
import { watcher } from './utils/watcher'

export const simplyReactive = (data, watchers, methods, onChange) => {
  const { subscribe, notify } = subscription()
  const { watch, getTarget } = watcher()

  const _data = new Proxy(data, {
    get(target, key) {
      subscribe(getTarget(), { key, value: target[key] })
      return Reflect.get(...arguments)
    },
    set(_, key, value) {
      Reflect.set(...arguments)
      onChange && onChange(key, value)
      notify(_data)
      return true
    },
  })

  Object.entries(watchers).forEach(([watcherName, _watcher]) => {
    watch(watcherName, () => _watcher(_data))
  })

  const _methods = {}
  Object.entries(methods).forEach(([methodName, method]) => {
    _methods[methodName] = (...args) => method(_data, _methods, ...args)
  })

  return [_data, _methods]
}
