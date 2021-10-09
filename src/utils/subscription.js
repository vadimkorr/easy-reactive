import { getObject, objectsAreSame } from './object'

export const subscription = () => {
  const subscribers = {}

  const memoDependency = (target, dep) => {
    const { watcherName, fn } = target
    const { prop, value } = dep

    if (!subscribers[watcherName]) {
      subscribers[watcherName] = {
        deps: {},
        fn,
      }
    }
    subscribers[watcherName].deps[prop] = value
  }

  return {
    subscribers,
    subscribe: (target, dep) => {
      if (target) {
        memoDependency(target, dep)
      }
    },
    notify: (data) => {
      Object.entries(subscribers).forEach(([watcherName, { deps }]) => {
        const newDeps = getObject(deps, data)
        // console.log('notify', watcherName)
        // console.log(deps)
        if (!objectsAreSame(deps, newDeps)) {
          subscribers[watcherName].deps = newDeps
          subscribers[watcherName].fn()
        }
      })
    },
  }
}
