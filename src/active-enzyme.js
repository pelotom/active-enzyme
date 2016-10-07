import { shallow } from 'enzyme'

function render(...args) {
  const wrapper = shallow(...args)
  return activate(() => wrapper)
}

function activate(findMyself) {
  return new Proxy(findMyself(), {
    get(target, key) {
      const find = (...findArgs) => activate(() => findMyself().find(...findArgs))
      switch (key) {
        case 'find':
          return find
        case 'classes':
          return new Proxy({}, {
            get(target, key) {
              return find(`.${key}`)
            }
          })
        default:
          return findMyself()[key]
      }
    }
  })
}

export default render
