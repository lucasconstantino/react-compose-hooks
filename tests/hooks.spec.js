/* eslint-disable import/no-unresolved */
import React, { useState } from 'react'
import { func, number } from 'prop-types'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { hooks, arrayShape } from 'react-compose-hooks'
import 'jest-dom/extend-expect'

afterEach(cleanup)
afterEach(jest.clearAllMocks)

describe('hooks', () => {
  let context = {}

  const Counter = jest.fn(({ counter: [count, setCount] }) => (
    <div>
      Count {count}
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  ))

  Counter.propTypes = {
    counter: arrayShape(number.isRequired, func.isRequired).isRequired,
  }

  const EnhancedCounter = hooks({
    counter: () => useState(0),
  })(Counter)

  it('should inject hooked properties', () => {
    render(<EnhancedCounter />)

    expect(Counter).toHaveBeenCalledTimes(1)
    expect(Counter).toHaveBeenCalledWith(
      expect.objectContaining({
        counter: expect.arrayContaining([0, expect.any(Function)]),
      }),
      context
    )
  })

  it('should update component when hooks fired', () => {
    const { getByText } = render(<EnhancedCounter />)

    expect(Counter).toHaveBeenCalledTimes(1)

    fireEvent.click(getByText('Increase'))
    expect(Counter).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenLastCalledWith(
      expect.objectContaining({
        counter: expect.arrayContaining([1, expect.any(Function)]),
      }),
      context
    )
  })
})
