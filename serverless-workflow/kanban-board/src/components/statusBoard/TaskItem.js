import { useDrag } from "react-dnd";
import { StyledItem } from './StyledStatusBoard';

const TaskItem = (props) => {
    const [, drag] = useDrag(() => ({
        type: "kanban-task",
        item: { key: props.task.key },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [props.task]);
    return (
        <div ref={drag}><StyledItem>{props.task.name}</StyledItem></div>
    );
}
export default TaskItem;