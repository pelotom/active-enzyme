# active-enzyme [![Build Status](https://travis-ci.org/pelotom/active-enzyme.svg?branch=master)](https://travis-ci.org/pelotom/active-enzyme)
Boilerplate-free Enzyme testing.

### Installation
```
$ npm install --save-dev active-enzyme
```

[Enzyme](https://github.com/airbnb/enzyme) is a great tool for performing tests on React components, especially using shallow rendering. This little library augments it with some niceties that allow you to easily lookup an element by `className` and save the resulting `ShallowWrapper` to a variable which is *active*--that is, it doesn't need to be requeried again after things change.

In a nutshell, a test such as this:

```javascript
import React from 'react'
import { shallow } from 'enzyme'
import Greeting from './Greeting'

it('greets in multiple languages', () => {
  const name = 'John'

  const wrapper = shallow(<Greeting name={name} />)

  expect(wrapper.find('.greeting').text()).toBe(`Hello, ${name}!`)

  wrapper.find('.switchLanguage').simulate('click')
  expect(wrapper.find('.greeting').text()).toBe(`Bonjour, ${name}!`)

  wrapper.find('.switchLanguage').simulate('click')
  expect(wrapper.find('.greeting').text()).toBe(`Hello, ${name}!`)
})
```

can instead be written like this:

```javascript
import React from 'react'
import { shallow } from 'active-enzyme'
import Greeting from './Greeting'

it('greets in multiple languages', () => {
  const name = 'John'

  const {
    greeting,
    switchLanguage
  } = shallow(<Greeting name={name} />).lookup()

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```

The two main features at work here are:

1. Enzyme wrapper objects acquire a special `lookup()` method which allows you to query based on a class names. This is nice because it allows you to use ES2015 destructuring syntax as above to select all the rendered elements you care about for a given test.
1. The first feature wouldn't be very useful with regular Enzyme if your test triggers re-renders of the element tree (as is happening here implicitly as a result of the `'click'` events), because the `greeting` and `switchLanguage` wrappers are normally immutable. This library instead returns *active* wrappers, which change in response to the element tree being re-rendered.

You may provide a custom mapping object to the `lookup()` method which shows which properties should be mapped to which `className`s:

```javascript
const {
  foo
} = shallow(<Greeting name={name} />).lookup({
  foo: 'greeting'
})
```

this would be equivalent to

```javascript
const foo = shallow(<Greeting name={name} />).find('.greeting')
```

This might not seem all that useful at first blush, but it is intended to support [CSS Modules](https://github.com/css-modules/css-modules), where `className`s get munged so as to be globally unique. Going back to our `Greeting` component test example, if we were using CSS Modules it would look something like this:

```javascript
import React from 'react'
import { shallow } from 'active-enzyme'
import Greeting from './Greeting'
import styles from './Greeting.css'

it('greets in multiple languages', () => {
  const name = 'John'

  const {
    greeting,
    switchLanguage
  } = shallow(<Greeting name={name} />).lookup(styles)

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```

Finally, since the most common usage pattern is that you have a bunch of tests all testing the same component, possibly with associated CSS Modules, there is a `makeAnalyzer()` utility which allows the individual tests to simply vary the props they're going to pass to it when rendering:

```javascript
import React from 'react'
import { shallow } from 'active-enzyme'
import Greeting from './Greeting'
import styles from './Greeting.css'

const analyze = makeAnalyzer(Greeting, styles)

it('greets in multiple languages', () => {
  const name = 'John'

  const { greeting, switchLanguage } = analyze({ name })

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```
