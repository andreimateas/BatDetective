import {Link, useLocation} from "react-router-dom";
import React from "react";
import "./MenuSideBar.css"
import { IoIosHome, IoIosStats } from "react-icons/io";
import { RiMapPinAddFill } from "react-icons/ri";
import { TbMapPins } from "react-icons/tb";
import {getUserRole} from "../API/Authentication";

const MenuSideBar = () =>{
    const location = useLocation();
    const currentPath = location.pathname;
    const userRole = getUserRole();

    const links = [
        {
            name: "Acasa",
            navigateTo: "/home",
            icon: <IoIosHome />
        },
        {
            name: "Adauga locatie",
            navigateTo: "/map",
            icon: <RiMapPinAddFill />
        },
        {
            name: "Locatiile mele",
            navigateTo: "/myLocations",
            icon: <TbMapPins />
        },
        (userRole === "ADMIN" ?
            {
                name: "Rapoarte",
                navigateTo: "/reports",
                icon: <IoIosStats />
            }
         : {})
    ];

    return (
        <div className="sidebar">
            <img src={"urbanBatDetective.png"} className="titleImage" alt="Bat detective"/>
            <hr/>
            <ul>
                {links.map((link, index) => {
                    if(!link.name){
                        return ;
                    }
                    const isCurrent = currentPath === link.navigateTo;
                    return(
                        <li key={index} className={`menu-item ${isCurrent ? 'current' : ''}`}>
                            <span className="menu-icon">{link.icon}</span>
                            <Link key={index} to={link.navigateTo}>{link.name}</Link>
                        </li>
                    )})}
            </ul>
        </div>
    );
};
export default MenuSideBar;