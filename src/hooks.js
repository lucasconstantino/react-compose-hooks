import React from 'react'
import { applyHooks } from './utils'

const hooks = map => Component => props => (
  <Component {...applyHooks(typeof map === 'function' ? map(props) : map, props)} />
)

export { hooks }
