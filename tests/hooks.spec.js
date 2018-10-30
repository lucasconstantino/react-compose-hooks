/* eslint-disable import/no-unresolved, no-shadow */
import React, { useState } from 'react'
import { func, number, string } from 'prop-types'
import { render, fireEvent, cleanup } from 'react-testing-library'
import { hooks, arrayShape } from 'react-compose-hooks'
import 'jest-dom/extend-expect'

const withValue = value => expect.arrayContaining([value, expect.any(Function)])
const withValues = values =>
  expect.objectContaining(
    Object.keys(values).reduce(
      (carry, key) => ({
        ...carry,
        [key]: withValue(values[key]),
      }),
      {}
    )
  )

describe('hooks', () => {
  afterEach(cleanup)
  afterEach(jest.clearAllMocks)

  let context = {}
  const counter = jest.fn(() => useState(0))

  const Counter = jest.fn(({ counter: [count, setCount] }) => (
    <div>
      Count {count}
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  ))

  Counter.propTypes = {
    counter: arrayShape([number.isRequired, func.isRequired]).isRequired,
  }

  const EnhancedCounter = hooks({ counter })(Counter)

  it('should inject hooked properties', () => {
    render(<EnhancedCounter />)

    expect(Counter).toHaveBeenCalledTimes(1)
    expect(Counter).toHaveBeenCalledWith(withValues({ counter: 0 }), context)
  })

  it('should update component when hooks fired', () => {
    const { getByText } = render(<EnhancedCounter />)

    expect(Counter).toHaveBeenCalledTimes(1)
    fireEvent.click(getByText('Increase'))
    expect(Counter).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenLastCalledWith(withValues({ counter: 1 }), context)
  })

  it('should call hook builder with any provided prop', () => {
    render(<EnhancedCounter prop="value" />)
    expect(counter).toHaveBeenCalledWith({ prop: 'value' })
  })

  it('should rebuild hook builder when hooks fired', () => {
    const { getByText } = render(<EnhancedCounter />)
    expect(counter).toHaveBeenCalledTimes(1)
    fireEvent.click(getByText('Increase'))
    expect(counter).toHaveBeenCalledTimes(2)
  })

  describe('multiple hooks', () => {
    const texter = jest.fn(() => useState(''))

    const Component = jest.fn(({ counter: [count, setCount], texter: [text, setText] }) => (
      <div>
        Count {count}
        <button onClick={() => setCount(count + 1)}>Increase</button>
        <input
          type="text"
          placeholder="Type here"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
    ))

    Component.propTypes = {
      counter: arrayShape([number.isRequired, func.isRequired]).isRequired,
      texter: arrayShape([string.isRequired, func.isRequired]).isRequired,
    }

    const EnhancedComponent = hooks({ counter, texter })(Component)

    it('should inject multiple hooked properties', () => {
      render(<EnhancedComponent />)
      expect(Component).toHaveBeenCalledTimes(1)
      expect(Component).toHaveBeenCalledWith(withValues({ counter: 0, texter: '' }), context)
    })

    it('should update component when hooks fired', () => {
      const { getByPlaceholderText, getByText } = render(<EnhancedComponent />)

      expect(Component).toHaveBeenCalledTimes(1)
      expect(Component).toHaveBeenLastCalledWith(withValues({ counter: 0, texter: '' }), context)

      fireEvent.change(getByPlaceholderText('Type here'), { target: { value: 'content' } })
      expect(Component).toHaveBeenCalledTimes(2)
      expect(Component).toHaveBeenLastCalledWith(
        withValues({ counter: 0, texter: 'content' }),
        context
      )

      fireEvent.click(getByText('Increase'))
      expect(Component).toHaveBeenCalledTimes(3)
      expect(Component).toHaveBeenLastCalledWith(
        withValues({ counter: 1, texter: 'content' }),
        context
      )
    })

    it('should call hook builder with any previous hook value', () => {
      render(<EnhancedComponent />)
      expect(texter).toHaveBeenCalledWith({ counter: withValue(0) })
    })

    it('should rebuild hook builder when hooks fired', () => {
      const { getByText } = render(<EnhancedComponent />)
      expect(counter).toHaveBeenCalledTimes(1)
      expect(texter).toHaveBeenCalledTimes(1)
      fireEvent.click(getByText('Increase'))
      expect(counter).toHaveBeenCalledTimes(2)
      expect(texter).toHaveBeenCalledTimes(2)
    })
  })

  describe('factory syntax', () => {
    const factory = jest.fn(() => ({ counter }))
    const EnhancedCounter = hooks(factory)(Counter)

    it('should inject hooked properties', () => {
      render(<EnhancedCounter />)

      expect(Counter).toHaveBeenCalledTimes(1)
      expect(Counter).toHaveBeenCalledWith(withValues({ counter: 0 }), context)
    })

    it('should update component when hooks fired', () => {
      const { getByText } = render(<EnhancedCounter />)

      expect(Counter).toHaveBeenCalledTimes(1)
      fireEvent.click(getByText('Increase'))
      expect(Counter).toHaveBeenCalledTimes(2)

      expect(Counter).toHaveBeenLastCalledWith(withValues({ counter: 1 }), context)
    })

    it('should call hook builder with any provided prop', () => {
      render(<EnhancedCounter prop="value" />)
      expect(counter).toHaveBeenCalledWith({ prop: 'value' })
    })

    it('should call hooks factory with any provided prop', () => {
      render(<EnhancedCounter prop="value" />)
      expect(factory).toHaveBeenCalledWith({ prop: 'value' })
    })

    it('should rebuild hook builder when hooks fired', () => {
      const { getByText } = render(<EnhancedCounter />)
      expect(counter).toHaveBeenCalledTimes(1)
      fireEvent.click(getByText('Increase'))
      expect(counter).toHaveBeenCalledTimes(2)
    })

    it('should rebuild hooks factory when hooks fired', () => {
      const { getByText } = render(<EnhancedCounter />)
      expect(factory).toHaveBeenCalledTimes(1)
      fireEvent.click(getByText('Increase'))
      expect(factory).toHaveBeenCalledTimes(2)
    })

    describe('factory with resolved hooked values', () => {
      const factory = jest.fn(() => ({ counter: useState(0) }))
      const EnhancedCounter = hooks(factory)(Counter)

      it('should inject hooked properties', () => {
        render(<EnhancedCounter />)

        expect(Counter).toHaveBeenCalledTimes(1)
        expect(Counter).toHaveBeenCalledWith(withValues({ counter: 0 }), context)
      })

      it('should update component when hooks fired', () => {
        const { getByText } = render(<EnhancedCounter />)

        expect(Counter).toHaveBeenCalledTimes(1)
        fireEvent.click(getByText('Increase'))
        expect(Counter).toHaveBeenCalledTimes(2)

        expect(Counter).toHaveBeenLastCalledWith(withValues({ counter: 1 }), context)
      })
    })
  })
})
