import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export interface ReduxState {
  lastUpdate: number,
  light: boolean,
  count: number,
  template: object | null,
  baseTemplate: object | null,
  injectTemplate: object | null
}

export const exampleInitialState: ReduxState = {
  lastUpdate: 0,
  light: false,
  count: 0,
  template: null,
  baseTemplate: null,
  injectTemplate: null
}

export const actionTypes = {
  SET_TEMPLATE: 'SET_TEMPLATE',
  SET_BASE_TEMPLATE: 'SET_BASE_TEMPLATE',
  SET_INJECT_TEMPLATE: 'SET_INJECT_TEMPLATE',
  TICK: 'TICK',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET'
}

// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TEMPLATE:
      return Object.assign({}, state, {
        template: action.template
      })
    case actionTypes.SET_BASE_TEMPLATE:
      return Object.assign({}, state, {
        baseTemplate: action.template
      })
    case actionTypes.SET_INJECT_TEMPLATE:
      return Object.assign({}, state, {
        injectTemplate: action.template
      })
    case actionTypes.TICK:
      return Object.assign({}, state, {
        lastUpdate: action.ts,
        light: !!action.light
      })
    case actionTypes.INCREMENT:
      return Object.assign({}, state, {
        count: state.count + 1
      })
    case actionTypes.DECREMENT:
      return Object.assign({}, state, {
        count: state.count - 1
      })
    case actionTypes.RESET:
      return Object.assign({}, state, {
        count: exampleInitialState.count
      })
    default:
      return state
  }
}

// ACTIONS
export const setTemplate = (template: Object) => {
  return { type: actionTypes.SET_TEMPLATE, template: template }
}

export const setBaseTemplate = (template: Object) => {
  return { type: actionTypes.SET_BASE_TEMPLATE, template: template }
}

export const setInjectTemplate = (template: Object) => {
  return { type: actionTypes.SET_INJECT_TEMPLATE, template: template }
}

export const serverRenderClock = () => {
  return { type: actionTypes.TICK, light: false, ts: Date.now() }
}
export const startClock = () => {
  return { type: actionTypes.TICK, light: true, ts: Date.now() }
}

export const incrementCount = () => {
  return { type: actionTypes.INCREMENT }
}

export const decrementCount = () => {
  return { type: actionTypes.DECREMENT }
}

export const resetCount = () => {
  return { type: actionTypes.RESET }
}

export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware())
  )
}
