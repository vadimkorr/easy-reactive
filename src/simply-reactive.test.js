import { simplyReactive } from './simply-reactive'

const createGetDepsOf = (reactive) => (watchName) => {
  const dependencies = reactive._internal._getSubscribers()
  return Object.keys(dependencies[watchName].deps)
}

describe('simplyReactive', () => {
  it('can watch', () => {
    const reactive = simplyReactive({
      data: {
        a: 0,
        b: 0,
        sum: 0,
      },
      watch: {
        calcSum({ data }) {
          data.sum = data.a + data.b
        },
      },
    })
    const getDepsOf = createGetDepsOf(reactive)

    const [data] = reactive
    expect(data.sum).toEqual(0)

    data.a = 10
    data.b = 20
    expect(data.sum).toEqual(30)

    expect(getDepsOf('calcSum')).toEqual(['a', 'b'])
  })
})
