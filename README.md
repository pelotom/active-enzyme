# active-enzyme [![Build Status](https://travis-ci.org/pelotom/active-enzyme.svg?branch=master)](https://travis-ci.org/pelotom/active-enzyme)
Boilerplate-free Enzyme testing.

### Installation
```
$ npm install --save-dev active-enzyme
```

[Enzyme](https://github.com/airbnb/enzyme) is a great tool for performing tests on React components using shallow rendering. This little library augments it with some niceties that allow you to easily lookup an element by `className` and save the resulting `ShallowWrapper` to a variable which is *active*--that is, it doesn't need to be requeried again after things change.

Say we want to test this component:

```javascript
import React, { Component } from 'react'

class Greeting extends Component {

  state = {
    language: 'English'
  }

  render() {
    const salutation = this.state.language === 'English' ? 'Hello' : 'Bonjour'
    const otherLanguage = this.state.language === 'English' ? 'French' : 'English'

    return (
      <div>
        <h1 className="greeting">{salutation}, {this.props.name}!</h1>
        <button
          className="switchLanguage"
          type="button"
          onClick={() => this.setState({ language: otherLanguage })}
        >
          Greet me in {otherLanguage}
        </button>
      </div>
    )
  }
}
```

It just greets a name of your choosing in English or French, and has a button that allows you to switch the language.

We might test it using Enzyme like so:

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

This works fine, but there's quite a bit of repetition of the `wrapper.find(...)` calls. We'd like to be able to extract some variables:

```javascript
import React from 'react'

import { shallow } from 'enzyme'

import Greeting from './Greeting'

it('greets in multiple languages', () => {
  const name = 'John'

  const wrapper = shallow(<Greeting name={name} />)
  const greeting = wrapper.find('.greeting')
  const switchLanguage = wrapper.find('.switchLanguage')

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```

Unfortunately this doesn't work, because the `ShallowWrapper` returned by a `find(...)` call is immutable. It won't be modified when we simulate a click, so the greeting text will apparently never switch to French. Instead, we have to re-query from the root wrapper to obtain a new wrapper every time a change occurs. Usually immutability is a wonderful thing, but here it's a bit of a pain! What we really want is active wrappers.

That's where this library comes in:

```javascript
import React from 'react'

import { shallow } from 'active-enzyme'

import Greeting from './Greeting'

it('greets in multiple languages', () => {
  const name = 'John'

  const wrapper = shallow(<Greeting name={name} />)
  const greeting = wrapper.find('.greeting')
  const switchLanguage = wrapper.find('.switchLanguage')

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```

Now this test works fine! Additionally, since class-based lookup is such a frequent thing in these tests and because object destructuring is fun and profitable, `active-enzyme` provides a special `classes` field which allows us to magically access wrappers by `className`. That means that instead of

```javascript
const wrapper = shallow(<Greeting name={name} />)
const greeting = wrapper.find('.greeting')
const switchLanguage = wrapper.find('.switchLanguage')
```

you can write

```javascript
const wrapper = shallow(<Greeting name={name} />)
const { greeting, switchLanguage } = wrapper.classes
```

or simply

```javascript
const { greeting, switchLanguage } = shallow(<Greeting name={name} />).classes
```

The final, result is a very clean and readable testcase:

```javascript
import React, { Component } from 'react'

import { shallow } from './active-enzyme'

it('greets in multiple languages', () => {
  const name = 'John'

  const { greeting, switchLanguage } = shallow(<Greeting name={name} />).classes

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
})
```
