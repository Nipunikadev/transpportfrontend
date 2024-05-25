import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const Navigate = useNavigate(); 
    const [auth, setAuth] = useState (false)
    const [username, setName] = useState('')
    const [message, setMessage]  = useState('')

    axios.defaults.withCredentials = true;
    useEffect(() => {

        axios.post('http://localhost:8081/driver/dashboard')
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
                setName(res.data.username);
            }else{
                setAuth(false);
                setMessage(res.data.Message);
            }
        })
        .then(err => console.log(err))
    }, [])

    return(
        <form className='driver-welcome'>
            <div className="form-inner">
            <div className="logo"></div>
            {
             auth?
             <div className='welcome'>
             <h2> Welcome,{username}</h2>
             <button className='attendance' onClick={() => {Navigate('/driver/dashboard/attendance', { state: { username } })}}>Attendance</button>
             <button className='journey' onClick={() => {Navigate('/driver/dashboard/journey', { state: { username } })}}>Journey Module</button>
             <button className='userhistory' onClick={() => {Navigate('/driver/dashboard/history', { state: { username } })}}>View My History</button>
            <button className="button-logout" onClick={() => {Navigate('/driver')}}>Logout</button>  
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