import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { RootDiv } from './App-Style';

export const App = () => {
  return (
    <RootDiv>
      <TodoForm />
      <TodoList />
    </RootDiv>
  );
}