import { memo } from "react";
import { IconType } from "react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "../../theme";

const ListItem = styled.li`
  height: ${theme.navBar.height};
  padding: 0px 15px 0px 15px;
  display: inline-block;
  cursor: pointer;

  transition: all 100ms ease-in-out;

  .itemIcon {
    color: #fff;

    font-size: 1.18em;
    margin-right: 0.25em;

    position: relative;
    transform: translateY(0.2em);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
`;

const NameContainer = styled.div`
  width: 100%;

  position: relative;
  top: 50%;
  transform: translateY(calc(-50% - 1px));

  font-size: 20px;
  font-family: "Rubik", sans-serif;

  color: #fff;
`;

function NavBarItem({ name, path, Icon }: NavBarItemProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <ListItem
      onClick={() => navigate(path)}
      className={pathname === path ? "activeItem" : ""}
    >
      <NameContainer className="navBarItemNameContainer">
        <Icon className="itemIcon" />
        {name}
      </NameContainer>
    </ListItem>
  );
}

export default memo(NavBarItem);

export interface NavBarItemProps {
  name: string;
  path: string;
  Icon: IconType;
}
