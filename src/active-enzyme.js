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

export function makeRenderer(component, {
  method = shallow,
  transform = props => props,
  enzymeOptions
} = {}) {
  const doTransform = props => removeUndefined(transform(props))
  return (props = {}) => method(createElement(component, doTransform(props)), enzymeOptions)
}

function activate(findMyself) {
  const find = (...findArgs) => activate(() => findMyself().find(...findArgs))
  const classes = new Proxy({}, {
    get(target, name) {
      return find(`.${name}`)
    }
  })
  const overrides = { find, classes }
  return new Proxy(findMyself(), {
    get(target, key) {
      return overrides[key] || findMyself()[key]
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
