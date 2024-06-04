import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


function FuelRecords() {
   
    const Navigate = useNavigate(); 
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [vehicleno, setVehicle] = useState([]);
    const [fuel, setFuel] = useState([]);
    const rowLimit = fuel.length; 
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
    
        if (!fuel || fuel.length === 0) {
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

    const handleVehicleChange = (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
    };

    useEffect(() => {
        // Axios request to fetch data
        axios.post('http://localhost:8081/vehicles/vehicleDetails/dropdown')
        .then((response) => {
            if (response.data.success) {
                setVehicle(response.data.vehicleno);
            }
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });

        axios.post('http://localhost:8081/records/fuelRecords', { vehicleno: selectedVehicle , startDate: startDate, endDate: endDate})
        .then(res => {
            if (res.data.success) {
                console.log("Successfully", res.data.fuel);
                setFuel(res.data.fuel);
            } else {
                console.error("Failed to fetch vehicle data:", res.data.error);
            }
        })
        .catch(err => {
            console.log(err);
        });
}, [selectedVehicle, startDate, endDate]);

   
    return(
        <form className='fuel-form'>
            <div className='fuel-vehicle-form'>
                <h2>Fuel Records</h2>
                <div className="journey-dropdown">
                <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number: </label>
                        <select value={selectedVehicle} onChange={handleVehicleChange}>
                        <option value="">Choose Your Vehicle</option>
                        {vehicleno.length > 0 &&(
                            vehicleno.map((number, index) => (
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
                                <th>No</th>
                                <th>Vehicle Number</th>
                                <th>Date</th>
                                <th>Fuel Type</th>
                                <th>Fuel Pumped</th>
                                <th>Fuel Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                        {fuel.slice(0, rowLimit).map((fuelDetails, index) => (
                        <tr key={fuelDetails.id ? fuelDetails.id : index}>
                            <td>{index + 1}</td>
                            <td>{fuelDetails.vehicleno}</td>
                            <td>{fuelDetails.date}</td>
                            <td>{fuelDetails.fuelType}</td>
                            <td>{fuelDetails.fuelPumped}</td>
                            <td>{fuelDetails.cost}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="button-back" onClick={() => {Navigate("/records/historyRecords", { state: { username } }) }}>BACK</button>

                <button className="button-print" onClick={(event) => handlePrint(event)}>PRINT</button>
            </div>
        </form>
    )

}
export default FuelRecords;