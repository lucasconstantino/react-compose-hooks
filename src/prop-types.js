import { checkPropTypes } from 'prop-types'

/**
 * Custom PropType validator for an array with predefined shape by index.
 *
 * @param {[Function]} validators PropType validation for each index of the array.
 * @return {Function} validator.
 */
const arrayShape = validators => {
  const checkType = (isRequired, props, propName, componentName, loc) => {
    if (
      !Array.isArray(validators) ||
      validators.some(validator => typeof validator !== 'function')
    ) {
      return new Error(
        `Property ${loc} \`${propName}\` of component \`${componentName}\` has invalid PropType notation inside of arrayShape.`
      )
    }

    const value = props[propName]

    // eslint-disable-next-line eqeqeq
    if (value == null) {
      if (isRequired) {
        const missingType = value === null ? 'null' : 'undefined'

        return new Error(
          `The ${loc} \`${propName}\` is marked as required in \`${componentName}\`, but its value is \`${missingType}\`.`
        )
      } else {
        return null
      }
    }

    if (!Array.isArray(value)) {
      return new Error(
        `Invalid ${loc} \`${propName}\` of type \`${typeof value}\` supplied to \`${componentName}\`, expected array.`
      )
    }

    for (let i = 0; i < validators.length; i++) {
      const key = `${propName}[${i}]`
      checkPropTypes({ [key]: validators[i] }, { [key]: value[i] }, 'prop', componentName)
    }
  }

  const chainedCheckType = checkType.bind(null, false)
  chainedCheckType.isRequired = checkType.bind(null, true)

  return chainedCheckType
}

export { arrayShape }
