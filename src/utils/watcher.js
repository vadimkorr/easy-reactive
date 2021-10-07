export const watcher = () => {
  let target = null

  return {
    watch: (watcherName, fn) => {
      target = {
        watcherName,
        fn,
      }
      target.fn()
      target = null
    },
    getTarget: () => {
      return target
    },
  }
}
