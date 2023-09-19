import styled from "@emotion/styled";


const InputDiv = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 50px;
  margin-bottom: 2%;
  
`;

const StyledInput = styled("input")`
  margin-bottom: 5%;
  width: ${props => props.focused ? `300px` : '200px'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  outline: 2px blue solid;
  height: 50px;
  margin-bottom: 2%;
  background-color : #d1d1d1;
  &:hover {
   width: 300px;
  }
`;
export { InputDiv, StyledInput };