import React from 'react';
import {ReactComponent as DashboardIcon} from '../icons/dashboard.svg';
import {ReactComponent as DocumentIcon} from '../icons/document.svg';
import {ReactComponent as GNAiIcon} from '../icons/gnai.svg';
import {ReactComponent as MenuIcon} from '../icons/menu.svg';
import {ReactComponent as Logo} from '../logo.svg';
import { NavLink, useLocation } from 'react-router-dom';
import {ReactComponent as LogOut} from '../icons/logout.svg';
import { setLoggedIn } from '../pages/Protected';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../store/state/MenuState';
import { RootState } from '../store/store';




const Sidebar = () => {
  const location = useLocation();
  const active = useSelector((state: RootState) => state.menu.isActive);
  const dispatch = useDispatch();

  return (
    <div className={`flex-col p-3 fixed inline-flex ph-2 z-10 bg-white ${!active ? 'w-20' : ''}`} style={{  height: '100%',boxShadow: "4px 4px 40px 0px #0000000F",  transition: "width 2s",}}>
      <a  className="flex space-x-5 text-center justify-center items-center" style={{height:40, marginTop:"10px", marginBottom:"9px"}}>
        <MenuIcon onClick={()=>{
          dispatch(toggleMenu());
        }} className='ml'/>
        {active && <Logo height={40} href="/dashboard" />}
      </a>
      <hr className="my-2 border-t border-gray-300" style={{color:"#E4E7ED"}} />
      <nav className="flex flex-col mb-auto">
        <SideBarItems Icon={DashboardIcon} text="Dashboard" href="/dashboard" isMenuActive={active}   />
          <SideBarItems Icon={DocumentIcon} text="GNAi Doc" isMenuActive={active} href="/document"  />
          <SideBarItems Icon={GNAiIcon} text="GNAi" isMenuActive={active} href="/gnai"  />
          
          <SignOut />
      </nav>
      {/* <hr className="my-2 border-t border-gray-300" /> */}
      
      <div className="relative">
        <div className='beta '>
  
       <span className='font-bold text-slate-700'>Beta Version</span><br></br>
        {
        active &&
        <span
          onClick={
            () => {
              // mailto:info@gnaenergy
            }
          }
          className='text-slate-700' >Contact: info@gna.energy</span>}
        </div>
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md hidden">
          <NavLink  to="#"  className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">New project...</NavLink>
          <NavLink to="#" className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Settings</NavLink>
          <NavLink to="#" className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-200">Profile</NavLink>
          <div className="border-t border-gray-300"></div>
          
        </div>
      </div>
    </div>
  );



  function SideBarItems({Icon, text, href, isMenuActive }: {Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> , text: string, href: string, isMenuActive?: boolean}) {
    let isActive = location.pathname.includes(href);
    return (
      <> 
      <NavLink to={href} className={`flex mt-2 h-12 ${isActive ? "bg-primary" : ''} ${isMenuActive ? '' : 'justify-center'}  items-center rounded-lg`}>
        <Icon className={`${isActive ? "icon whiteIcon":"icon blackIcon icon-bold"} ${isMenuActive ? "mr-2 ml-2": ""}`} width="30" x="0" y="20"   stroke="#000000" stroke-widths={20} />
      {isMenuActive ? isActive ? <strong className="text-white">{text}</strong> : text : null}
      </NavLink>
      </>
  
    );
}
function SignOut(): JSX.Element {
  const active = useSelector((state: RootState) => state.menu.isActive);
  return (
    <> 
    <button 
    onClick={
      () => {
        setLoggedIn(false);

        window.location.href = "/login";
                }
    }
    className={`flex mt-2 h-12 bg-gray-200 items-center justify-center rounded-lg`}>
      <LogOut className={` "icon blackIcon icon-bold"`} width="30" x="0" y="20"   stroke="#000000" stroke-widths={20} />
 {active && "Sign Out"}
    </button>
    </>

  );

};
}

export default Sidebar;