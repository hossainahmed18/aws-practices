import { createStore } from 'redux'
import UserActivityReducer from './UserActivityReducer';

const store = createStore(UserActivityReducer)
export default store