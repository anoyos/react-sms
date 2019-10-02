import { combineReducers } from 'redux'
import auth from './auth.reducer'
import message from './message.reducer'

const rootReducers = combineReducers({
  auth: auth,
  message: message,
})

export default rootReducers
