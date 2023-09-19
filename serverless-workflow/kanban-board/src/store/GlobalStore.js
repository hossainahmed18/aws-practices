import { createContext, useReducer } from 'react';
import { kanbanReducer } from './reducers/KanbanReducer';

export const TaskState = {
  Blacklog: 0,
  InProgress: 1,
  InReview: 2,
  Ready: 3,
  Done: 4
};
export const Theme = {
  darkBackGround: '#2E2D2D',
  ligtBackGround: '#F9F1F0'
}
export const KanbanContext = createContext([]);
export const TodoContext = createContext();
export const KanbanProvider = ({ children }) => {
  const [tasks, dispatch] = useReducer(kanbanReducer, []);
  return (
    <KanbanContext.Provider value={{ tasks, dispatch }}>{children}</KanbanContext.Provider>
  );
}