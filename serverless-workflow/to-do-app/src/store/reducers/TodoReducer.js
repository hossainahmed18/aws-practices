import { TodoState } from "../GlobalStore";
const TodoReducer = (todoItems, action) => {
    switch (action.type) {
        case 'addItem':
            return [{ name: action.payload, status: TodoState.Intial, key: Math.random() }, ...todoItems];
        case 'completeItem':
            return todoItems.map(todo => todo.key === action.payload ? { ...todo, status: TodoState.completed } : todo);
        case 'removeItem':
            return todoItems.filter(todo => todo.key !== action.payload);
        default:
            return todoItems;
    }
}
export default TodoReducer;