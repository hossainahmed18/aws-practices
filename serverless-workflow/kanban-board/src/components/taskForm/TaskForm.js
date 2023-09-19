import { useState, useEffect, useRef, useContext } from 'react';
import { KanbanContext } from '../../store/GlobalStore';
import { InputDiv, StyledInput } from './StyledTaskForm';

const TaskForm = () => {
    const { dispatch } = useContext(KanbanContext);

    const [focused, setFocused] = useState(false);
    const [textInput, setTextInput] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        focused ? inputRef.current.focus() : inputRef.current.blur();
    }, [focused]);

    const keyPressHandler = (event) => {
        if (event.key === "Enter") {
            if (textInput.length > 0) {
                dispatch({ type: 'addItem', payload: textInput });
                clearInputField();
            }
        } else if (event.key === "Escape") {
            clearInputField();
        }
    };
    const clearInputField = () => {
        inputRef.current.blur();
        setTextInput('');
        setFocused(false);
    }

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value);
    }
    return (
        <div>
            <InputDiv>
                <StyledInput
                    focused={focused}
                    onFocus={() => setFocused(true)}
                    type='text'
                    placeholder='Put A Name of To do Item'
                    ref={inputRef}
                    onKeyDown={keyPressHandler}
                    value={textInput}
                    onChange={handleTextInputChange}
                />
            </InputDiv>
        </div>
    );
}
export default TaskForm;