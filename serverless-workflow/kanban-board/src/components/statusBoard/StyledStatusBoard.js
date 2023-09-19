import styled from "@emotion/styled";

const SyledBoard = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: sans-serif;
  padding-right: 1%
`;

const StatusBlock = styled("div")`
  padding: 0.6rem;
  width: 30.5%;
  min-width: 14rem;
  min-height: 4.5rem;
  border-radius: 0.3rem;
  border: 2px solid black;
`;
const StyledItem = styled("span")`
  color: black!important;
`;

const StatusName = styled("h4")`
  color: #00FFFF!important;
`;

const StyledItemDiv = styled("div")`
  margin: 0.2rem 0rem 0.3rem 0rem;
  border: 0.1rem solid black;
  border-radius: 0.2rem;
  padding: 0.5rem 0.2rem 0.5rem 2rem;
  background-color: #d1d1d1 !important;
`;

const TaskButton = styled("button")`
  margin: 0.2rem 0rem 0.1rem 0rem;
  background-color: white;
  border-radius: 0.2rem;
  width: 100%;
  border: 0.25rem solid orange;
  padding: 0.5rem 2.7rem;
  border-radius: 0.3rem;
  font-size: 1rem;
`;

export { StatusName, SyledBoard, StatusBlock, StyledItem, StyledItemDiv, TaskButton };