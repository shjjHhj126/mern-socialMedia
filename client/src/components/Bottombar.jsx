// for mobile use
import { Link, useLocation, NavLink } from "react-router-dom";
import { LeftbarLinks } from "../constant/index";

export default function Bottombar() {
  const location = useLocation();
  return (
    <section className="md:hidden z-50 w-full sticky bottom-0 rounded-t-[20px] bg-slate-100 px-2 py-2 ">
      <ul className="flex justify-around ">
        {LeftbarLinks.map((linkItem) => {
          const isActive = location.pathname === linkItem.route;
          return (
            <li
              key={linkItem.label}
              className={`rounded-lg base-medium hover:bg-orange-400 transition ${
                isActive && "bg-orange-400 hover:white "
              }`}>
              <Link
                className="flex flex-col items-center justify-center p-2 "
                to={linkItem.route}>
                {linkItem.icon}
                <span className="text-xs">{linkItem.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
