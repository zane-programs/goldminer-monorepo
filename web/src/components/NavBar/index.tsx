import { memo, useState } from "react";
import styled from "styled-components";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import theme from "../../theme";
import NavBarItem from "./NavBarItem";
import NoUnderlineLink from "../NoUnderlineLink";
import items from "./items";

const Nav = styled.nav`
  height: ${theme.navBar.height};

  background-color: ${theme.mainColor};
  background: ${theme.mainColorGradient};

  position: fixed;
  top: 28px;
  user-select: none;

  flex-shrink: 0;

  .logoTextMouseOver::before {
    transform-origin: 0px 0px !important;
  }
`;

const LogoText = styled.div`
  font-weight: 600;
  font-family: sans-serif;
  font-size: 27px;
  font-family: "Montserrat", sans-serif;

  color: #fff;
  text-transform: uppercase;

  margin: 0;
  padding: 0;

  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);

  padding: 5px;

  transition: color 250ms cubic-bezier(0, 1, 1, 1);
  &:hover {
    color: ${theme.mainColor};
  }

  &::before {
    width: 100%;
    height: 100%;

    border-radius: 3px;

    content: "";
    background-color: #fff;
    display: block;

    position: absolute;
    top: 0;
    left: 0;

    z-index: -1;

    transform: scaleX(0);
    transition: transform 250ms cubic-bezier(0, 1, 1, 1);

    transform-origin: 100% 0px;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const NavBarItemContainer = styled.ul`
  list-style-type: none;

  height: 65px;
  margin: 0;
  padding: 0;

  position: absolute;
  top: 0;
  right: 0;
`;

function NavBar() {
  const { width } = useWindowDimensions();
  const [mouseOverLogo, setMouseOverLogo] = useState(false);

  return (
    <Nav style={{ width }}>
      <NoUnderlineLink to="/">
        <LogoText
          className={mouseOverLogo ? "logoTextMouseOver" : ""}
          onMouseOver={() => setMouseOverLogo(true)} // over when mouse over
          onMouseOut={() => setMouseOverLogo(false)} // not over on mouse out
        >
          Goldminer
        </LogoText>
      </NoUnderlineLink>
      <NavBarItemContainer>
        {items.map((itemProps) => (
          <NavBarItem key={itemProps.path} {...itemProps} />
        ))}
      </NavBarItemContainer>
    </Nav>
  );
}

export default memo(NavBar);
