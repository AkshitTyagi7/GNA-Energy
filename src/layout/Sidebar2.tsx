import "./sidebar.css";
import { ReactComponent as Logo } from "../icons/Logo.svg";
import { NavLink, useLocation } from "react-router-dom";
import { ReactComponent as DashboardIcon } from "../icons/dashboard.svg";
import { ReactComponent as LogOutIcon } from "../icons/logout.svg";
import { ReactComponent as DocumentIcon } from "../icons/document.svg";
import { ReactComponent as GNAiIcon } from "../icons/gnai.svg";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as MenuItemIcon } from "../icons/menu-item.svg";
import { ReactComponent as ActiveMenuItemIcon } from "../icons/menu-item-active.svg";
import { RootState } from "../store/store";
import Sidebar from "./Sidebar";
import { Protected, ProtectedPage, setLoggedIn } from "../pages/Protected";
function SideBarItems({
  Icon,
  text,
  href,
  isMenuActive,
}: {
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  text: string;
  href: string;
  isMenuActive?: boolean;
}) {
  const location = useLocation();

  let isActive = location.pathname.includes(href);
  const dispatch = useDispatch();

  return (
    <>
      <NavLink
        to={href}
        className={`sidebar-item ${isActive ? "sidebar-item-active" : ""} ${
          isMenuActive ? "" : "justify-center"
        }  items-center rounded-lg`}
      >
        {/* <Icon className={`${isActive ? "icon whiteIcon":"icon blackIcon icon-bold"} ${isMenuActive ? "mr-2 ml-2": ""}`} width="30" x="0" y="20"   stroke="#000000" stroke-widths={20} /> */}
        {isActive ? (
          <MenuItemIcon fill="#F1935C" />
        ) : (
          <MenuItemIcon fill={"#9F9F9F"} />
        )}
        <p className="sidebar-text" style={{ textAlign: "center" }}>
          {text}
        </p>
      </NavLink>
    </>
  );
}

function LogOut() {
  return (
    <div
      className={`sidebar-item items-center rounded-lg`}
      onClick={() => {
        {
          setLoggedIn(false);

          window.location.href = "/login";
        }
      }}
    >
      <LogOutIcon />
      <p className="sidebar-text">Logout</p>
    </div>
  );
}

export function Sidebar2() {
  const active = useSelector((state: RootState) => state.menu.isActive);

  return (
    <div className="sidebar">
      <Logo />
      <hr
        className="my-2 border-t border-gray-300 w-full"
        style={{ color: "#E4E7ED", marginTop: "20px" }}
      />
      <div className="sidebar-items">
        <SideBarItems
          Icon={DashboardIcon}
          text="Dashboard"
          href="/dashboard"
          isMenuActive={active}
        />
        {/* <ProtectedPage pageId="cerc">
          <SideBarItems
            Icon={DashboardIcon}
            text="CERC Market Monitoring"
            href="/marketMonitoring"
            isMenuActive={active}
          />
        </ProtectedPage> */}
        <SideBarItems
          Icon={DocumentIcon}
          text="GNAi Doc"
          isMenuActive={active}
          href="/document"
        />
        <SideBarItems
          Icon={GNAiIcon}
          text="GNAi"
          isMenuActive={active}
          href="/gnai"
        />
        <LogOut />
      </div>
    </div>
  );
}

export default Sidebar2;
