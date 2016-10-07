import { createElement } from 'react'

import {
  shallow as enzymeShallow,
  mount as enzymeMount,
  render as enzymeRender,
} from 'enzyme'

export function shallow(...args) {
  const wrapper = enzymeShallow(...args)
  return activate(() => wrapper)
}

export function mount(...args) {
  const wrapper = enzymeMount(...args)
  return activate(() => wrapper)
}

export function render(...args) {
  const wrapper = enzymeRender(...args)
  return activate(() => wrapper)
}

export function makeAnalyzer(component, styles, opts = {}) {
    const transform = (transform => props => removeUndefined(transform(props)))(opts.transform || (props => props))

    const render = opts.type || shallow

    return (props = {}) => render(createElement(component, transform(props))).lookup(styles)
}

function activate(findMyself) {
  return new Proxy(findMyself(), {
    get(target, key) {
      const find = (...findArgs) => activate(() => findMyself().find(...findArgs))
      switch (key) {
        case 'find':
          return find
        case 'lookup':
          return classMap => new Proxy({}, {
            get(target, name) {
              if (classMap)
                name = classMap[name].split(' ')[0]
              return find(`.${name}`)
            }
          })
        default:
          return findMyself()[key]
      }
    }
  })
}

function removeUndefined(obj) {
    const result = { ...obj }
    for (const key in result) {
        if (result[key] === undefined)
            delete result[key]
    }
    return result
}
