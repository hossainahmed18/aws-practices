import styled from "@emotion/styled";
import { TodoState } from '../../store/GlobalStore';

const StatusText = styled("h3")`
  text-decoration: ${props => props.status === TodoState.completed ? 'line-through' : 'none'};
`;

const ListItem = styled("li")`
  button{
      display: none!important;
  }
  &:hover {
      button {
         display: inline-block!important;
         margin-left: 30px;
      }
  }
`;
export { ListItem, StatusText };