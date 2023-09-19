import { createContext, useReducer } from 'react';
import TodoReducer from './reducers/TodoReducer';
export const TodoState = {
    Intial: 0,
    completed: 1
};
export const TodoContext = createContext();
export const TodoContextProvider = ({ children }) => {
    const [todoItems, dispatch] = useReducer(TodoReducer, []);
    return (
        <TodoContext.Provider value={{ todoItems, dispatch }}>{children}</TodoContext.Provider>
    );
}