import React from 'react'

const hooks = map => Component => props => {
  const hooked = {}

  for (let key in map) {
    if (map.hasOwnProperty(key)) {
      hooked[key] = map[key]({ ...props, ...hooked })
    }
  }

  return <Component {...props} {...hooked} />
}

export { hooks }
