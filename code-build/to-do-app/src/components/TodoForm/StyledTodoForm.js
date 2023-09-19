import styled from "@emotion/styled";

const StyledInput = styled("input")`
  margin-bottom: 5%;
  height: auto;
  width: ${props => props.focused ? `300px` : '200px'};
  &:hover {
   width: 300px;
  }
`;
export { StyledInput };