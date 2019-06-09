import { createStore } from 'redux'

import reducerFunction from './reducer'

export default createStore(reducerFunction)