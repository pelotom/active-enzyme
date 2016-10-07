import React, { Component } from 'react'

import render from './active-enzyme'

it('greets in multiple languages', () => {
  const name = 'John'

  const { greeting, switchLanguage } = render(<Greeting name={name} />).classes

  expect(greeting.text()).toBe(`Hello, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Bonjour, ${name}!`)

  switchLanguage.simulate('click')
  expect(greeting.text()).toBe(`Hello, ${name}!`)
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
