const applyHooks = (map, props) =>
  Object.keys(map).reduce(
    (carry, key) => ({
      ...carry,
      [key]: typeof map[key] === 'function' ? map[key](carry) : map[key],
    }),
    props
  )

export { applyHooks }
