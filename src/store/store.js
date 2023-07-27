import { compose, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import { rootReducer } from './root-reducer';

// create root-reducer first

const middleWares = [logger]

const composedEnhancers = compose(applyMiddleware(...middleWares)); // must do to create what the store wants
// there are diff types of enhancers, middleware is one of them, middlewares enhance our store
// catch actions before the reducers and log them
// therefore is a "middle" step

// build out store object
export const store = createStore(rootReducer, undefined, composedEnhancers); // a store just needs the root reducer to be created, where all actions are passed

