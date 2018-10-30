import React from 'react'
import { applyHooks } from './utils'

const hooks = map => Component => props => <Component {...applyHooks(map, props)} />

export { hooks }
