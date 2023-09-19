import { useState } from 'react';
import { RootDiv } from './App-Style';
import TaskForm from './components/taskForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import StatusBoard from './components/statusBoard/StatusBoard';
import { KanbanProvider } from './store/GlobalStore';

export const App = () => {
  const [theme, setTheme] = useState("light");
  const getAlternativeTheme = () => {
    return theme === "dark" ? "light" : "dark";
  }
  return (
    <KanbanProvider>
      <button onClick={() => setTheme(getAlternativeTheme())}>{getAlternativeTheme()}</button>
      <RootDiv theme={theme}>
        <TaskForm />
        <DndProvider backend={HTML5Backend}>
          <StatusBoard />
        </DndProvider>
      </RootDiv>
    </KanbanProvider>
  );
}
export default App;