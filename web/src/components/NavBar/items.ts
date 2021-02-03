import { GiMiner } from "react-icons/gi";
import { AiFillSetting, AiFillDashboard, AiOutlineShoppingCart } from "react-icons/ai";
import { NavBarItemProps } from "./NavBarItem";

const items: NavBarItemProps[] = [
  {
    name: "Dashboard",
    Icon: AiFillDashboard,
    path: "/",
  },
  {
    name: "Mine",
    Icon: GiMiner,
    path: "/mine",
  },
  {
    name: "Shop",
    Icon: AiOutlineShoppingCart,
    path: "/shop",
  },
  {
    name: "Settings",
    Icon: AiFillSetting,
    path: "/settings",
  },
];

export default items;
