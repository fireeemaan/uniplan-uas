import React from "react";
import className from "classnames";
import { Link } from "react-router-dom";

const MenuCard = ({ children, icon, href, ...rest }) => {
  const classes = className(
    rest.className,
    "flex flex-col items-center justify-center w-full h-full px-5 text-center py-14 rounded-xl bg-white shadow-md gap-2 hover:bg-black/5 transition duration-200 ease-in-out cursor-pointer"
  );
  return (
    <Link className={classes} to={href}>
      <div className="icon">{icon}</div>
      <div className="text-xl text">{children}</div>
    </Link>
  );
};

export default MenuCard;
