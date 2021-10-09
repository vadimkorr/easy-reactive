export const objectsAreSame = (x, y) => {
  // return false
  let _objectsAreSame = true
  for (let propertyName in x) {
    if (Number.isNaN(x[propertyName]) || Number.isNaN(y[propertyName])) {
      continue
    }
    if (x[propertyName] !== y[propertyName]) {
      _objectsAreSame = false
      break
    }
  }

  return _objectsAreSame
}

export function getObject(oldData, allNewData) {
  const newDeps = {}

  Object.entries(oldData).forEach(([key, value]) => {
    // console.log('oldData', key, value)
    newDeps[key] = allNewData[key]
  })
  // console.log('isDiff', oldData, newDeps)

  return newDeps
}

export function cloneObject(obj) {
  const clone = {}
  for (let i in obj) {
    if (typeof obj[i] == 'object' && obj[i] != null) {
      clone[i] = cloneObject(obj[i])
    } else {
      clone[i] = obj[i]
    }
  }
  return clone
}
