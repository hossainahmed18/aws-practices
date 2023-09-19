import { useContext } from 'react';
import { TodoContext, TodoState } from '../../store/GlobalStore';
import { ListItem, StatusText } from './StyledTodoList';

const TodoList = () => {
    const { todoItems, dispatch } = useContext(TodoContext);
    return (
        <div>
            <ul>
                {
                    todoItems.map(todoItem => {
                        return (
                            <ListItem key={todoItem.key}>
                                <StatusText status={todoItem.status}>{todoItem.name}</StatusText>
                                <button onClick={() => dispatch({ type: 'removeItem', payload: todoItem.key })}>✘</button>
                                {
                                    todoItem.status !== TodoState.completed && (<button onClick={() => dispatch({ type: 'completeItem', payload: todoItem.key })}>✔</button>)
                                }
                            </ListItem>
                        )
                    })
                }
            </ul>
        </div>
    );
}
export default TodoList;