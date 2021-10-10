import { subscription } from './utils/subscription'
import { createTargetWatcher } from './utils/watcher'

import { cloneObject } from './utils/object'

export function simplyReactive(entities, options) {
  const data = entities.data
  const watch = entities.watch
  const methods = entities.methods
  const onChange = options.onChange

  const { subscribe, notify, subscribers } = subscription()
  const { targetWatcher, getTarget } = createTargetWatcher()

  let _data
  const _methods = {}
  const getContext = () => ({
    data: _data,
    methods: _methods,
  })

  let collectingDeps = false
  let callingMethod = false
  const methodWithFlags = (fn) => (...args) => {
    callingMethod = true
    const result = fn(...args)
    callingMethod = false
    return result
  }
  const watchWithFlags = (fn) => (...args) => {
    collectingDeps = true
    const result = fn(...args)
    collectingDeps = false
    return result
  }

  // init methods before data, as methods may be used in data
  Object.entries(methods).forEach(([methodName, methodItem]) => {
    _methods[methodName] = methodWithFlags((...args) =>
      methodItem(getContext(), ...args)
    )
    Object.defineProperty(_methods[methodName], 'name', { value: methodName })
  })

  _data = new Proxy(cloneObject(data), {
    get(target, prop) {
      if (collectingDeps && !callingMethod) {
        subscribe(getTarget(), { prop, value: target[prop] })
      }
      return Reflect.get(...arguments)
    },
    set(target, prop, value) {
      // if value is the same, do nothing
      if (target[prop] === value) {
        return true
      }

      Reflect.set(...arguments)

      if (!collectingDeps) {
        onChange && onChange(prop, value)
        notify(_data)
      }

      return true
    },
  })

  watchWithFlags(() =>
    Object.entries(watch).forEach(([watchName, watchItem]) => {
      targetWatcher(watchName, () => {
        watchItem(getContext())
      })
    })
  )()

  return [
    _data,
    _methods,
    {
      _getSubscribers() {
        return subscribers
      },
    },
  ]
}
