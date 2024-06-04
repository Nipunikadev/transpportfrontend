import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


function AttendanceRecords() {

    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [selectedDriver, setSelectedDriver] = useState('');
    const [drivername, setDriverName] = useState([])
    const Navigate = useNavigate(); 
    const [attendance, setAttendance] = useState([]);
    const rowLimit = attendance.id;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/admin');
        }
    }, [username, Navigate]);

    const handlePrint = (event) => {
        event.preventDefault(); // Prevents the default behavior of the click event
    
        if (!attendance || attendance.length === 0) {
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

    const handleDriverChange = (event) => {
        const value = event.target.value;
        setSelectedDriver(value);
    };

    useEffect(() => {
        // Axios request to fetch data
        axios.post('http://localhost:8081/admin/home/register/driver/updateDriver/dropdown')
        .then((response) => {
            if (response.data.success) {
                setDriverName(response.data.drivers);
            }
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });

        axios.post('http://localhost:8081/records/attendanceRecords', {drivername: selectedDriver , checkInDateTime: startDate, checkOutDateTime: endDate})
        .then(res => {
            if (res.data.success) {
                console.log("Sucessfully", res.data.attendance);
                setAttendance(res.data.attendance);
              } else {
                console.error("Failed to fetch Attendance data:", res.data.error);
              }
        })
        .catch(err => {
            console.log(err);
        });             
    }, [selectedDriver, startDate, endDate]);

   
    return(
        <form className='attendanceHistory-form'>
            <div className='attendanceRecord-form'>
            <h2>Drivers Attendance Records</h2>
                <div className="journey-dropdown">
                    <label htmlFor="drivername" name="drivername" >Driver Name: </label>
                        <select value={selectedDriver} onChange={handleDriverChange}>
                        <option value="">Choose Driver Name</option>
                        {drivername.length > 0 &&(
                            drivername.map((number, index) => (
                                <option key={index} value={number}>
                                    {number}
                                </option>
                            ))
                        )}
                        </select>
                </div>
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
                                <th>Driver Name</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Check In Date Time</th>
                                <th>Check Out Date Time</th>
                                <th>Check In Location</th>
                                <th>Check Out Location</th>
                            </tr>
                        </thead>
                        <tbody>
                        {attendance.slice(0, rowLimit).map((attendance, index) => (
                        <tr key={attendance.id ? attendance.id : index}>
                            <td>{index + 1}</td>
                            <td>{attendance.drivername}</td>
                            <td>{attendance.checkIn}</td>
                            <td>{attendance.checkOut}</td>
                            <td>{attendance.checkInDateTime}</td>
                            <td>{attendance.checkOutDateTime}</td>
                            <td>{attendance.checkInLocation}</td>
                            <td>{attendance.checkOutLocation}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="button-back" onClick={() => {Navigate('/records/historyRecords', { state: { username } })}}>BACK</button>  

                <button className="button-print" onClick={(event) => handlePrint(event)}>PRINT</button>

            </div>
        </form>
    )

}
export default AttendanceRecords;