const applyHooks = (map, props) =>
  Object.keys(map).reduce(
    (carry, key) => ({
      ...carry,
      [key]: map[key](carry),
    }),
    props
  )

export { applyHooks }
