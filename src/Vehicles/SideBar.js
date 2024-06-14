import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';

const SubMenu = ({ username }) => (
  <div className="submenu">
    <NavLink to="/vehicles/historyDetails/vehicleMaintenance" state={{ username }} className="active-link">Vehicle Maintenance</NavLink>
    <NavLink to="/vehicles/historyDetails/fuelUsage" state={{ username }} className="active-link">Fuel Usage</NavLink>
  </div>
);


const SideBar = ({ username }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);


    return (
      <aside className='header'>
        <div className='navBar'>
          <NavLink to='/vehicles/vehicleDetails' state={{ username }} className="active-link">Vehicle Details</NavLink>
            
          <NavLink to='/vehicles/vehicleSecurity' state={{ username }} className="active-link">Security Details</NavLink>
            
          <NavLink to='/vehicles/followupDetails' state={{ username }} className="active-link">FollowUp Details</NavLink>
          
          <div className="navLinkWithSubMenu" onMouseEnter={() => setIsSubMenuOpen(true)} onMouseLeave={() => setIsSubMenuOpen(false)}>
            <span className="active-link">History Details</span>
            {isSubMenuOpen && <SubMenu  username={username}/>}
          </div>  
        </div>
      </aside>
    );
};
export default SideBar;