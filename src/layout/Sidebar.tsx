import React from 'react';
import {ReactComponent as DashboardIcon} from '../icons/dashboard.svg';
import {ReactComponent as DocumentIcon} from '../icons/document.svg';
import {ReactComponent as GNAiIcon} from '../icons/gnai.svg';
import {ReactComponent as MenuIcon} from '../icons/menu.svg';
import {ReactComponent as Logo} from '../logo.svg';
import { NavLink, useLocation } from 'react-router-dom';
import {ReactComponent as LogOut} from '../icons/logout.svg';
import { setLoggedIn } from '../pages/Protected';




const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="flex-col p-3 fixed inline-flex ph-2 z-10 bg-white" style={{ width: '200px', height: '100%' }}>
      <a href="/dashboard" className="flex space-x-5 text-center items-center">
        <MenuIcon className='ml-3'/>
        <Logo />
      </a>
      <hr className="my-2 border-t border-gray-300" />
      <nav className="flex flex-col mb-auto">
        <SideBarItems Icon={DashboardIcon} text="Dashboard" href="/dashboard"  />
          {/* <SideBarItems Icon={DocumentIcon} text="Document" href="/document"  /> */}
          <SideBarItems Icon={GNAiIcon} text="GNAi" href="/gnai"  />
          
          <SignOut />
      </nav>
      {/* <hr className="my-2 border-t border-gray-300" /> */}
      
      <div className="relative">
        <div className='beta text-sm '>
          <span className='font-bold text-slate-700'>Beta Version</span><br></br>
          <span
          onClick={
            () => {
              // mailto:info@gnaenergy
            }
          }
          className='text-sm text-slate-700' >Contact: info@gna.energy</span>
        </div>
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md hidden">
          <NavLink to="#"  className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">New project...</NavLink>
          <NavLink to="#" className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Settings</NavLink>
          <NavLink to="#" className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Profile</NavLink>
          <div className="border-t border-gray-300"></div>
          
        </div>
      </div>
    </div>
  );



  function SideBarItems({Icon, text, href, }: {Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> , text: string, href: string}) {
    let isActive = location.pathname.includes(href);
    return (
      <> 
      <NavLink to={href} className={`flex mt-2 h-12 ${isActive ? "bg-primary" : ''} pl-2 pr-2 items-center rounded-lg`}>
        <Icon className={`mr-3 ${isActive ? "icon whiteIcon":"icon blackIcon icon-bold"}`} width="30" x="0" y="20"   stroke="#000000" stroke-widths={20} />
      {isActive ? <strong className="text-white">{text}</strong> : text}
      </NavLink>
      </>
  
    );


}
function SignOut(): JSX.Element {
  return (
    <> 
    <button 
    onClick={
      () => {
        setLoggedIn(false);

        window.location.href = "/login";
                }
    }
    className={`flex mt-2 h-12 bg-gray-200  pl-2 pr-2 items-center rounded-lg`}>
      <LogOut className={`mr-3 "icon blackIcon icon-bold"`} width="30" x="0" y="20"   stroke="#000000" stroke-widths={20} />
    {"Sign Out"}
    </button>
    </>

  );

};
}

export default Sidebar;