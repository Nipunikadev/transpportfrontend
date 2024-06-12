import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import VehicleMaintenance from '../Vehicles/VehicleMaintenance';
import FollowUpDetails from '../Vehicles/FollowUpDetails';
import FuelUsage from '../Vehicles/FuelUsage';
import OriginalDocumentsRecords from '../Vehicles/OriginalDocumentsRecords';
import VehicleSecurity from '../Vehicles/VehicleSecurity';

function AdminHome() {

    const Navigate = useNavigate(); 
    const [auth, setAuth] = useState (false)
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [message, setMessage]  = useState('')

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.post('http://localhost:8081/admin/home')
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                } else {
                    setAuth(false);
                    setMessage(res.data.Message);
                }
                setAuthChecked(true); // Mark auth check as complete
            })
            .catch(err => {
                console.log(err);
                setAuth(false);
                setMessage('Error during authentication');
                setAuthChecked(true); // Mark auth check as complete
            });
    }, []);

    useEffect(() => {
        if (authChecked && (!auth || !username)) {
            Navigate('/admin'); // Redirect if auth check is complete and not authenticated or username is missing
        }
    }, [auth, authChecked, username, Navigate]);


    const handleLogout = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        axios.post('http://localhost:8081/logout')
            .then(res => {
                if (res.data.Status === "Success") {
                    Navigate('/admin');
                } else {
                    alert("Error during logout");
                }
            })
            .catch(err => console.log(err));
    };
    

    return(
        <div>
        <form className='admin-form'>
            <div className="form-admin">
            <div className="logo"></div>
            {
             auth?(
             <div className='admin-welcome'>
             <h2> Welcome,{username}</h2>
             <button type="button" className='register' onClick={() => {Navigate('/admin/home/register', { state: { username } }) }}>Register</button>
             <button type="button" className='vehicleHome' onClick={() => {Navigate('/vehicles/vehicleDetails', { state: { username } }) }}>Vehicles Management</button>
             <button type="button" className='history' onClick={() => {Navigate('/records/historyRecords', { state: { username } }) }}>History Records</button>
            <button type="button" className="button-logout" onClick={handleLogout}>Logout</button>  
            </div>  
              ) : (
            <div>
                <h2>{message}</h2>
                <h3>Login Now</h3>
                <Link to="/admin" className="button-submit">Login</Link>
            </div> 
            )        
            }
            </div>
        </form>

        <Routes>
            <Route path="/vehicles/vehicleSecurity" element={<VehicleSecurity username={username} />} />
            <Route path="/vehicles/vehicleSecurity/originalDocumentsRecords" element={<OriginalDocumentsRecords username={username} />} />
            <Route path="/vehicles/followupDetails" element={<FollowUpDetails username={username} />} />
            <Route path="/vehicles/historyDetails/fuelUsage" element={<FuelUsage username={username} />} />
            <Route path="/vehicles/historyDetails/vehicleMaintenance" element={<VehicleMaintenance username={username} />} />
        </Routes>

        </div>
    )
}

export default AdminHome;