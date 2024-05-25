import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';


const SubMenu = () => (
  <div className="submenu">
    <NavLink to="/vehicles/historyDetails/vehicleMaintenance" className="active-link">Vehicle Maintenance</NavLink>
    <NavLink to="/vehicles/historyDetails/fuelUsage" className="active-link">Fuel Usage</NavLink>
  </div>
);


const SideBar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);


    return (
      <aside className='header'>
        <div className='navBar'>
          <NavLink to='/vehicles/vehicleDetails' className="active-link">Vehicle Details</NavLink>
            
          <NavLink to='/vehicles/vehicleSecurity' className="active-link">Security Details</NavLink>
            
          <NavLink to='/vehicles/followupDetails' className="active-link">FollowUp Details</NavLink>
          
          <div className="navLinkWithSubMenu" onMouseEnter={() => setIsSubMenuOpen(true)} onMouseLeave={() => setIsSubMenuOpen(false)}>
            <NavLink className="active-link">History Details</NavLink>
            {isSubMenuOpen && <SubMenu />}
          </div>  
        </div>
      </aside>
    );
};
export default SideBar;