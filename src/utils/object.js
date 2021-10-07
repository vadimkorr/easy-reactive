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

export const getObject = (oldData, newData) => {
  const newDeps = {}

  Object.entries(oldData).forEach(([key, value]) => {
    // console.log('oldData', key, value)
    newDeps[key] = newData[key]
  })
  // console.log('isDiff', oldData, newDeps)

  return newDeps
}
