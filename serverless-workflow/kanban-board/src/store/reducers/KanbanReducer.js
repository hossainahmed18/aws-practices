import { TaskState } from "../GlobalStore";
export const kanbanReducer = (tasks, action) => {
    switch (action.type) {
        case 'addItem':
            return [{ name: action.payload, status: TaskState.Blacklog, key: Math.random() }, ...tasks];
        case 'changeStatus':
            return tasks.map(todo => todo.key === action.payload.key ? { ...todo, status: action.payload.status } : todo);
        case 'removeItem':
            return tasks.filter(todo => todo.key !== action.payload);
        default:
            return tasks;
    }
}