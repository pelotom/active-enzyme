import React, { Component } from 'react'

import * as activeEnzyme from './active-enzyme'

describe('shallow wrapper', () => {
  it('is active', () => {
    ['shallow', 'mount'].forEach(methodName => {
      const render = activeEnzyme.makeRenderer(Greeting, { method: activeEnzyme[methodName] })

      const name = 'John'

      const {
        greeting,
        switchLanguage
      } = render({ name }).classes

      expect(greeting.text()).toBe(`Hello, ${name}!`)

      switchLanguage.simulate('click')
      expect(greeting.text()).toBe(`Bonjour, ${name}!`)

      switchLanguage.simulate('click')
      expect(greeting.text()).toBe(`Hello, ${name}!`)
    })
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
