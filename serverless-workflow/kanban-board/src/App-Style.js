import styled from "@emotion/styled";
import { Theme } from "./store/GlobalStore";

const RootDiv = styled("div")`
   background-color: ${props => props.theme === "dark" ? Theme.darkBackGround : Theme.ligtBackGround};
   color: 'black';
   width: 100vw;
    min-width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    height: 100vh
`;
export { RootDiv };