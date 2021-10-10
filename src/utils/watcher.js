export const createTargetWatcher = () => {
  let target = null

  return {
    async targetWatcher(watcherName, fn) {
      target = {
        watcherName,
        fn,
      }
      await target.fn()
      target = null
    },
    getTarget() {
      return target
    },
  }
}
