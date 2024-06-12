import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const Navigate = useNavigate(); 
    const [auth, setAuth] = useState (false)
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [message, setMessage]  = useState('')

    axios.defaults.withCredentials = true;
    useEffect(() => {

        axios.post('http://localhost:8081/driver/dashboard')
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
            }else{
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
    }, [])

    useEffect(() => {
        if (authChecked && (!auth || !username)) {
            Navigate('/driver'); // Redirect if auth check is complete and not authenticated or username is missing
        }
    }, [auth, authChecked, username, Navigate]);

    const handleLogout = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        axios.post('http://localhost:8081/logout')
            .then(res => {
                if (res.data.Status === "Success") {
                    Navigate('/driver');
                } else {
                    alert("Error during logout");
                }
            })
            .catch(err => console.log(err));
    };

    return(
        <form className='driver-welcome'>
            <div className="form-driver">
            <div className="logo"></div>
            {
             auth?
             <div className='welcome'>
             <h2> Welcome,{username}</h2>
             <button type="button" className='attendance' onClick={() => {Navigate('/driver/dashboard/attendance', { state: { username } })}}>Attendance</button>
             <button type="button" className='journey' onClick={() => {Navigate('/driver/dashboard/journey', { state: { username } })}}>Journey Module</button>
             <button type="button" className='userhistory' onClick={() => {Navigate('/driver/dashboard/history', { state: { username } })}}>View My History</button>
            <button type="button" className="button-logout" onClick={handleLogout}>Logout</button>  
            </div>  
            :
            <div>
                <h2>{message}</h2>
                <h2>Login Now</h2>
                <Link to="/driver" className="button-submit">Login</Link>
            </div>         
            }
            </div>
        </form>


    )
}

export default Dashboard;