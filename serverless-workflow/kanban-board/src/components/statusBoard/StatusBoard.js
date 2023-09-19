import { TaskState } from '../../store/GlobalStore';
import BoardItem from './BoardItem';
import { SyledBoard } from './StyledStatusBoard';

const StatusBoard = () => {
    return (
        <SyledBoard>
            {
                Object.keys(TaskState).map((board) => {
                    return (
                        <BoardItem board={board} key={board} />
                    )
                })
            }
        </SyledBoard>

    );
}
export default StatusBoard;