import { getObject, objectsAreSame } from './object'

export const subscription = () => {
  const subscribers = {}

  const memoDependency = (target, dep) => {
    const { watcherName, fn } = target
    const { key, value } = dep

    if (!subscribers[watcherName]) {
      subscribers[watcherName] = {
        deps: {},
        fn,
      }
    }
    subscribers[watcherName].deps[key] = value
  }

  return {
    subscribe: (target, dep) => {
      if (target) {
        memoDependency(target, dep)
      }
    },
    notify: (data) => {
      Object.entries(subscribers).forEach(([watcherName, { deps }]) => {
        const newDeps = getObject(deps, data)
        if (!objectsAreSame(deps, newDeps)) {
          subscribers[watcherName].deps = newDeps
          subscribers[watcherName].fn()
        }
      })
    },
  }
}
