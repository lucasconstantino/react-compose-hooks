/* eslint-disable import/no-unresolved, no-shadow */
import React, { useState } from 'react'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { Hooks } from 'react-compose-hooks'
import 'jest-dom/extend-expect'

describe('Hooks', () => {
  afterEach(cleanup)
  afterEach(jest.clearAllMocks)

  const HookedComponent = () => (
    <Hooks counter={useState(0)}>
      {({ counter: [count, setCount] }) => (
        <div>
          Count {count}
          <button onClick={() => setCount(count + 1)}>Increase</button>
        </div>
      )}
    </Hooks>
  )

  it('should inject hooked properties', () => {
    const { container } = render(<HookedComponent />)
    expect(container).toHaveTextContent('Count 0')
  })

  it('should update component when hooks fired', () => {
    const { container, getByText } = render(<HookedComponent />)
    expect(container).toHaveTextContent('Count 0')

    fireEvent.click(getByText('Increase'))
    expect(container).toHaveTextContent('Count 1')
  })
})
