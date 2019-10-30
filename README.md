# React Compose Hooks

[![Build Status](https://travis-ci.org/lucasconstantino/react-compose-hooks.svg?branch=master)](https://travis-ci.org/lucasconstantino/react-compose-hooks)
[![coverage](https://img.shields.io/codecov/c/github/lucasconstantino/react-compose-hooks.svg?style=flat-square)](https://codecov.io/github/lucasconstantino/react-compose-hooks)
[![npm version](https://img.shields.io/npm/v/react-compose-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-compose-hooks)
[![sponsored by Taller](https://raw.githubusercontent.com/TallerWebSolutions/tallerwebsolutions.github.io/master/sponsored-by-taller.png)](https://taller.net.br/en/)

## Motivation

React hooks are [here](https://reactjs.org/docs/hooks-intro.html). And [here](https://github.com/reactjs/rfcs/pull/68). Like it or not, they are everywhere. Besides the overall excitement of the community with the soon-to-be released new feature, there are also a lot of considerations with this new pattern:

1. **Side-effect:** no one really like them, and within the React ecosystem we've been trying to get rid of them - or at least encapsulate them for good. Hooks seems to go in the other direction, when it encourages people to call a function and expect a dynamic return inside a previously purely functional component. Which leads to...
2. **Not functional:** I might be completely wrong with this one, but it seems we've just buried some concepts of functional programming when embracing hooks. No more pure functions, which should _always return the same result when called with the same arguments_. Which also leeds to...
3. **Testability issues:** APIs are certainly to come, but so far we are all sure that using hooks will not encourage testable code at all.

Having all that said, we have to point the obvious answer to all these problems, which is: we already had these problems with classes. This is true, but now we are making the distinction between logic and presentational components much more subtle. Experienced developers are sure going to keep things separetely enough, but what about newcommers? They were once tempted to use classes everywhere, and the introduction of purely functional components was a good way to teach them to split logic from presentation. The difference between smart/dumb (container/component, whatever) is now way more difficult to grasp.

> The fourth point on the above list would be "I hate returns", but I thought it would not sound really professional :joy:

## Solution

I don't have a final solution. All I know is I've loved the developing experience gains first brought by [recompose](https://github.com/acdlite/recompose), then improved with the [render prop](https://reactjs.org/docs/render-props.html) concept, highly [adopted](https://github.com/pedronauck/react-adopt) by [powerplug](https://github.com/renatorib/react-powerplug) and major players such as [Apollo](https://github.com/apollographql/react-apollo).

This library contains experiments on what could be a step back towards the mentioned solutions, but still embracing the simplicity hooks provide.

## Installation

`yarn add react-compose-hooks`

## Usage

### As function composition (aka recompose method):

The library provide a `hooks` higher-order component, which can be used as follows:

```js
import { useState } from 'react'
import { hooks } from 'react-compose-hooks'

const Counter = ({ counter: [count, setCount] }) => (
  <div>
    Count {count}
    <button onClick={() => setCount(count + 1)}>Increase</button>
  </div>
)

export default hooks({ counter: () => useState(0) })(Counter)
```

#### `hooks`

```
hooks(
  hookCreators: {
    [hookedPropName: string]: (props: Object) => any
  } |
  hooksCreator: (props: Object) => {
    [hookedPropName: string]: any
  }
): HigherOrderComponent
```

Takes an object map of hook creators or a hooks creator:

The first option expects that each property in the provided object will be a function, which will be called with `props` and any previously resolved hooked props and should return a hooked value (such as the result of calling `useState`).

The second option expects a function which will be called with the passed props and should return a map of hooked values (such as the result of calling `useState`).

If you need to access the value of one hook to build the next, use the first form - which is as flexible as can be, but can become somewhat more verbose in some scenarios.
