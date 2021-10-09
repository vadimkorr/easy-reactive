import { subscription } from './utils/subscription'
import { createTargetWatcher } from './utils/watcher'

import { cloneObject } from './utils/object'

export function simplyReactive(entities, options) {
  const data = entities.data
  const watch = entities.watch
  const methods = entities.methods
  const onChange = options.onChange

  const { subscribe, notify, subscribers } = subscription()
  const { targetWatcher, getTarget, clear } = createTargetWatcher()

  let _data
  const _methods = {}
  const getContext = () => ({
    data: _data,
    methods: _methods,
  })

  let level = 0

  // init methods before data, as methods may be used in data
  Object.entries(methods).forEach(([methodName, methodItem]) => {
    _methods[methodName] = (...args) => {
      level++
      const res = methodItem(getContext(), ...args)

      level--
      return res
    }
  })

  _data = new Proxy(cloneObject(data), {
    get(target, prop) {
      // const w = getTarget()
      // if (w && w.watcherName === 'setInitialPageIndex') {
      //   debugger
      // }

      if (level === 1) {
        subscribe(getTarget(), { prop, value: target[prop] })
      }
      return Reflect.get(...arguments)
    },
    set(target, prop, value) {
      level++

      // const _value = data[prop].pipe ? data[prop].pipe(data[prop].value) : value
      // Reflect.set(target, prop, _value, receiver)
      // if value is the same, do nothing
      if (target[prop] === value) {
        level--
        return true
      }
      Reflect.set(...arguments)

      onChange && onChange(prop, value)
      notify(_data)

      level--
      return true
    },
  })

  Object.entries(watch).forEach(([watchName, watchItem]) => {
    level++
    // if (watchName === 'setInitialPageIndex') {
    //   debugger
    // }
    targetWatcher(watchName, () => watchItem(getContext()))
    level--
  })

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
