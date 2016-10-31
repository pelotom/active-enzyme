import React, { Component } from 'react'

import * as activeEnzyme from './active-enzyme'

const classNames = {
  greeting: 'bb67d6ba 33e4 4d4d 863b 50cc3b2d529f',
  switchLanguage: 'b8100020 f9ba 4ae6 8f88 31f33297c109',
  salutation: 'cf9ec3f0 51af 4709 ab94 5effd4b709b8',
}

it('works', () => {
  ['shallow', 'mount'].forEach(methodName => {
    const render = activeEnzyme.makeRenderer(Greeting, { method: activeEnzyme[methodName], classNames })

    const name = 'John'

    const {
      greeting,
      switchLanguage
    } = render({ name }).classes

    expect(greeting.text()).toBe(`Hello, ${name}!`)
    expect(greeting.classes.salutation.text()).toBe('Hello')

    switchLanguage.simulate('click')
    expect(greeting.text()).toBe(`Bonjour, ${name}!`)

    switchLanguage.simulate('click')
    expect(greeting.text()).toBe(`Hello, ${name}!`)
  })
})

// Test component

class Greeting extends Component {

  state = {
    language: 'English'
  }

  render() {
    const salutation = this.state.language === 'English' ? 'Hello' : 'Bonjour'
    const otherLanguage = this.state.language === 'English' ? 'French' : 'English'

    return (
      <div>
        <h1 className={classNames.greeting}>
          <span className={classNames.salutation}>{salutation}</span>, {this.props.name}!
        </h1>
        <button
          className={classNames.switchLanguage}
          type="button"
          onClick={() => this.setState({ language: otherLanguage })}
        >
          Greet me in {otherLanguage}
        </button>
      </div>
    )
  }
}
