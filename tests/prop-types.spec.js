/* eslint-disable import/no-unresolved */
import { number, string } from 'prop-types'
import { arrayShape } from 'react-compose-hooks'
import 'jest-dom/extend-expect'

let checkPropTypes

function resetWarningCache() {
  jest.resetModules()
  checkPropTypes = require('prop-types').checkPropTypes
}

describe('prop-types', () => {
  console.error = jest.fn()

  beforeEach(resetWarningCache)
  afterEach(jest.clearAllMocks)

  describe('arrayShape', () => {
    describe('success', () => {
      it('should not warn when properties match', () => {
        const propTypes = { key: arrayShape([number, string]) }
        const props = { key: [1, 'string'] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).not.toHaveBeenCalled()
      })

      it('should not warn when property missing, but not required', () => {
        const propTypes = { key: arrayShape([number, string]) }
        const props = {}

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).not.toHaveBeenCalled()
      })

      it('should not warn when items are missing, but not required', () => {
        const propTypes = { key: arrayShape([number, string]) }
        const props = { key: [] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).not.toHaveBeenCalled()
      })

      it('should not warn when last item is missing, but not required', () => {
        const propTypes = { key: arrayShape([number.isRequired, string]) }
        const props = { key: [1] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).not.toHaveBeenCalled()
      })
    })

    describe('failures', () => {
      it('should warn when validators are not type checkers', () => {
        const propTypes = { key: arrayShape(['number', 'string']) }
        const props = { key: [1, 'string'] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).toHaveBeenCalledWith(
          'Warning: Failed prop type: Property prop `key` of component `Component` has invalid PropType notation inside of arrayShape.'
        )
      })

      it('should warn when validators are not array', () => {
        const propTypes = { key: arrayShape(number, string) }
        const props = { key: [1, 'string'] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).toHaveBeenCalledWith(
          'Warning: Failed prop type: Property prop `key` of component `Component` has invalid PropType notation inside of arrayShape.'
        )
      })

      it('should warn when required', () => {
        const propTypes = { key: arrayShape([number, string]).isRequired }
        const props = {}

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).toHaveBeenCalledWith(
          'Warning: Failed prop type: The prop `key` is marked as required in `Component`, but its value is `undefined`.'
        )
      })

      it('should warn when missing item is required', () => {
        const propTypes = { key: arrayShape([number.isRequired, string]).isRequired }
        const props = { key: [] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).toHaveBeenCalledWith(
          'Warning: Failed prop type: The prop `key[0]` is marked as required in `Component`, but its value is `undefined`.'
        )
      })

      it('should warn when items do not match validators', () => {
        const propTypes = { key: arrayShape([number, string]) }
        const props = { key: ['string', 1] }

        checkPropTypes(propTypes, props, 'prop', 'Component')

        expect(console.error).toHaveBeenCalledWith(
          'Warning: Failed prop type: Invalid prop `key[1]` of type `number` supplied to `Component`, expected `string`.'
        )
      })
    })
  })
})
