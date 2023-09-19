import { useState, useEffect, useRef, useContext } from 'react';
import { TodoContext } from '../../store/GlobalStore';
import { StyledInput } from './StyledTodoForm';

const TodoForm = () => {
    const { dispatch } = useContext(TodoContext);
    const [focused, setFocused] = useState(false);
    const [textInput, setTextInput] = useState("");
    const inputRef = useRef();

    useEffect(() => {
        focused ? inputRef.current.focus() : inputRef.current.blur();
    }, [focused]);

    const keyPressHandler = (event) => {
        if (event.key === "Enter") {
            dispatch({ type: 'addItem', payload: textInput });
            clearInputField();
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
        </div>
    );
}
export default TodoForm;