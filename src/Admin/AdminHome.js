import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function AdminHome() {

    const Navigate = useNavigate(); 
    const [auth, setAuth] = useState (false)
    const [username, setName] = useState('')
    const [message, setMessage]  = useState('')

    axios.defaults.withCredentials = true;
    useEffect(() => {

        axios.post('http://localhost:8081/admin/home')
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
    // const handleLogout = () => {
    //         axios.get('http://localhost:8081/logout')
    //         .then(res => {
    //             if(res.data.Status === "Success"){
    //                 Navigate('/')
    //             }else{
    //                 alert("Error");
    //             }
    //         })
    //         .catch(err => console.log(err));         
    // }
    

    return(
        <form className='admin-form'>
            <div className="form-admin">
            <div className="logo"></div>
            {
             auth?
             <div className='admin-welcome'>
             <h2> Welcome,{username}</h2>
             <button className='register' onClick={() => {Navigate('/admin/home/register')}}>Register</button>
             <button className='vehicleHome' onClick={() => {Navigate('/vehicles/vehicleDetails')}}>Vehicles Management</button>
             <button className='history' onClick={() => {Navigate('/records/historyRecords')}}>History Records</button>
            <button className="button-logout" onClick={() => {Navigate('/admin')}}>Logout</button>  
            </div>  
            :
            <div>
                <h2>{message}</h2>
                <h3>Login Now</h3>
                <Link to="/admin" className="button-submit">Login</Link>
            </div>         
            }
            </div>
        </form>


    )
}

export default AdminHome;