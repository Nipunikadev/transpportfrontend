import React, {useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HistoryRecords (){

    const Navigate = useNavigate(); 

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
             <button className='vehicleRecords' onClick={() => {Navigate('/records/vehicleRecords')}}>Vehicle Records</button>
             <button className='tripRecords' onClick={() => {Navigate('/records/tripRecords')}}>Trips Records</button>
             <button className='attendanceRecords' onClick={() => {Navigate('/records/attendanceRecords')}}>Attendance Records</button>
             <button className='fuelRecords' onClick={() => {Navigate('/records/fuelRecords')}}>Fuel Records</button>
             <button className="button-back" onClick={() => {Navigate('/admin/home')}}>BACK</button>
            <button className="button-logout" onClick={() => {Navigate('/admin')}}>LOGOUT</button>  
            </div> 
            </div>
        </form>
    )
}

export default HistoryRecords;