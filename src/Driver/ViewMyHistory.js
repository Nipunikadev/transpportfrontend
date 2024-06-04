import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';


function ViewMyHistory(){

    const Navigate = useNavigate(); 
    const [trips, setTrips] = useState([]);
    const rowLimit = trips.id;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const location = useLocation();
    const { username } = location.state || { username: undefined };


    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/driver');
        }
    }, [username, Navigate]);
    
    const handlePrint = (event) => {
        event.preventDefault(); // Prevents the default behavior of the click event
    
        if (!trips || trips.length === 0) {
            console.warn("No data available to print");
            return;
        }
    
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('</head><body>');
        
        // Copy the table content to the new window
        printWindow.document.write(document.querySelector('.table-container').innerHTML);
        
        printWindow.document.write('</body></html>');
        
        // Trigger the print functionality in the new window
        printWindow.print();
        printWindow.close();
    };


    useEffect(() => {
        // Only proceed if username is defined
        if (username) {
            // Axios POST request with startDate and endDate in the request body
            axios.post(`http://localhost:8081/driver/dashboard/viewMyHistory`,{drivername: username , startDate: startDate, endDate: endDate})
            .then(res => {
                if (res.data.success) {
                    console.log("Successfully fetched trips", res.data.trips);
                    setTrips(res.data.trips);
                } else {
                    console.error("Failed to fetch trip data:", res.data.error);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [username, startDate, endDate]); // Depend on startDate and endDate as well


    return(
        <form className='trips-form'>
            <div className='tripsRecord-form'>
            <div className="date-range">
                    <label htmlFor="startDate">From: </label>
                    <input type="date" id="startDate" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    <label htmlFor="endDate">To: </label>
                    <input type="date" id="endDate" name="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>Start Trip</th>
                                <th>End Trip</th>
                                <th>Vehicle Number</th>
                                <th>Start Date Time</th>
                                <th>End Date Time</th>
                                <th>Location</th>
                                <th>Start Meter</th>
                                <th>End Meter</th>
                                <th>Trip Duration (km)</th>
                            </tr>
                        </thead>
                        <tbody>
                        {trips.slice(0, rowLimit).map((trips, index) => (
                        <tr key={trips.id ? trips.id : index}>
                            <td>{index + 1}</td>
                            <td>{trips.start}</td>
                            <td>{trips.end}</td>
                            <td>{trips.vehicleno}</td>
                            <td>{trips.startDateTime}</td>
                            <td>{trips.endDateTime}</td>
                            <td>{trips.location}</td>
                            <td>{trips.startmeter}</td>
                            <td>{trips.endmeter}</td>
                            <td>{trips.endmeter - trips.startmeter}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="button-back" onClick={() => {Navigate('/driver/dashboard', { state: { username } })}}>BACK</button>  

                <button className="button-print" onClick={(event) => handlePrint(event)}>PRINT</button>
            </div>
        </form>
    );
}

export default ViewMyHistory;