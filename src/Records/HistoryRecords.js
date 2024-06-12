import React, {useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function HistoryRecords (){

    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const Navigate = useNavigate(); 

    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/admin');
        }
    }, [username, Navigate]);

    axios.defaults.withCredentials = true;
    useEffect(() => {

        axios.post('http://localhost:8081/historyRecords')
        .then(res =>{
            console.log(res);
        })
        .then(err => console.log(err))
    }, [])

    return(
        <form className='historyRecord-form'>
            <div className="form-inner">
             <div className='historyRecord'>
             <h2> History Records</h2>
             <button type="button" className='vehicleRecords' onClick={() => {Navigate('/records/vehicleRecords', { state: { username } }) }}>Vehicle Records</button>
             <button type="button" className='tripRecords' onClick={() => {Navigate('/records/tripRecords', { state: { username } }) }}>Trips Records</button>
             <button type="button" className='attendanceRecords' onClick={() => {Navigate('/records/attendanceRecords', { state: { username } }) }}>Attendance Records</button>
             <button type="button" className='fuelRecords' onClick={() => {Navigate('/records/fuelRecords', { state: { username } }) }}>Fuel Records</button>
             <button type="button" className="button-back" onClick={() => {Navigate('/admin/home', { state: { username } }) }}>BACK</button>
            <button type="button" className="button-logout" onClick={() => {Navigate('/admin', { state: { username } }) }}>LOGOUT</button>  
            </div> 
            </div>
        </form>
    )
}

export default HistoryRecords;