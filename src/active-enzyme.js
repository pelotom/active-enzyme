import { createElement } from 'react'

import {
  shallow as enzymeShallow,
  mount as enzymeMount,
  render as enzymeRender,
} from 'enzyme'

export function shallow(elem, opts, classNames) {
  const wrapper = enzymeShallow(elem, opts)
  return activate(() => wrapper, classNames)
}

export function mount(elem, opts, classNames) {
  const wrapper = enzymeMount(elem, opts)
  return activate(() => wrapper, classNames)
}

export function render(elem, opts, classNames) {
  const wrapper = enzymeRender(elem, opts)
  return activate(() => wrapper, classNames)
}

export function makeShallowRenderer(component, opts) {
  return makeRenderer(component, { method: shallow, ...opts })
}

export function makeFullRenderer(component, opts) {
  return makeRenderer(component, { method: mount, ...opts })
}

export function makeStaticRenderer(component, opts) {
  return makeRenderer(component, { method: render, ...opts })
}

export function makeRenderer(component, {
  method,
  defaultProps = {},
  transform = props => props,
  classNames,
  enzymeOptions,
} = {}) {
  const doTransform = props => removeUndefined(transform(props))
  return (props = {}) => {
    props = { ...defaultProps, ...props }
    return method(createElement(component, doTransform(props)), enzymeOptions, classNames)
  }
}

function activate(findMyself, classNames) {
  const find = (...findArgs) => activate(() => findMyself().find(...findArgs), classNames)
  const classes = new Proxy({}, {
    get(target, name) {
      if (classNames)
        name = classNames[name]
      const selector = name.split(' ').map(part => '.' + part).join('')
      return find(selector)
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
