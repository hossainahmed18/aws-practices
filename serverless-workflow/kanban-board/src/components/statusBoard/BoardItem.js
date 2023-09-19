import { useContext } from 'react';
import { KanbanContext, TaskState } from '../../store/GlobalStore';
import { StatusBlock, StyledItemDiv, StatusName } from './StyledStatusBoard';
import { useDrop } from "react-dnd";
import TaskItem from './TaskItem';

const BoardItem = (props) => {
    const { tasks, dispatch } = useContext(KanbanContext);

    const [, drop] = useDrop(() => ({
        accept: "kanban-task",
        drop: (item) => addTaskToBoard(item.key),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [tasks, props.board])

    const addTaskToBoard = (key) => {
        dispatch({ type: 'changeStatus', payload: { key: key, status: TaskState[props.board] } });
    }

    return (

        <StatusBlock ref={drop}>
            <StatusName>{props.board}</StatusName>
            {
                tasks.filter(todo => todo.status === TaskState[props.board])?.map((todoItem) => {
                    return (
                        <StyledItemDiv key={todoItem.key} >
                            <TaskItem task={todoItem} />
                        </StyledItemDiv>
                    )
                })
            }

        </StatusBlock>
    );
}
export default BoardItem;