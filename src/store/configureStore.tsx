import { applyMiddleware, compose, createStore } from 'redux'
// import thunkMiddleware from 'redux-thunk'
import thunkMiddleware from 'redux-thunk'

// import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './enhancers/monitorReducer'

export default function   configureStore(preloadedState: any):any {
  const middlewares = [loggerMiddleware] 
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = compose(...enhancers) 
  const store: any = createStore(rootReducer as any, preloadedState, composedEnhancers as any)

  return store
}