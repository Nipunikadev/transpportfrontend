import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function VehicleRecords() {
    const Navigate = useNavigate();
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [vehicleno, setVehicle] = useState([])
    const [combinedData, setCombinedData] = useState({});
    const rowLimit = combinedData.vehicles ? combinedData.vehicles.length : 0;
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' uses the yyyy-mm-dd format
    };
    
    const handlePrint = (event) => {
        event.preventDefault(); // Prevents the default behavior of the click event
    
        if (!combinedData.vehicles || combinedData.vehicles.length === 0) {
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
        // Clear the text field value if a different option is selected
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
        axios.post('http://localhost:8081/records/vehicleRecords', { vehicleno: selectedVehicle})
        .then(res => {
            console.log("Vehicle Records Response:", res.data);
            if (res.data.success) {
                console.log("Successfully", res.data.vehicles);
                setCombinedData(res.data.vehicles);
            } else {
                console.error("Failed to fetch vehicle data:", res.data.error);
            }
        })
        .catch(err => {
            console.log(err);
        });
                   
    }, [selectedVehicle]);

   
    return(
        <form className='vehicles-form'>
            <div className='vehiclesRecord-form'>
            <h2>Vehicle Records</h2>
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
                <div className="table-container" >
                    <table className="table" border="1">
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>Vehicle Number</th>
                                <th>Vehicle Type</th>
                                <th>Ownership</th>
                                <th>Fuel Type</th>
                                <th>Leased Liability</th>
                                <th>Cylinder Capacity</th>
                                <th>Registration Date</th>
                                <th>Original Documents With</th>
                                <th>Tax No</th>
                                <th>No of Keys</th>
                                <th>Revenue License Start Date</th>
                                <th>Revenue License End Date</th>
                                <th>Insurance License Start Date</th>
                                <th>Insurance License End Date</th>
                                <th>Tax License Start Date</th>
                                <th>Tax License End Date</th>
                                <th>Maintenance Date</th>
                                <th>Maintenance Type</th>
                                <th>Service Milage</th>
                                <th>Reason for Service/Repair</th>
                                <th>Other Vehicle Maintenance</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                        {Array.from({ length: rowLimit }).map((_, id) => (
                            <tr key={id}>
                            <td>{id + 1}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.vehicleno}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.vehicletype}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.ownership}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.fuelType}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.leasedliability}</td>
                            <td>{combinedData.vehicles && combinedData.vehicles[id]?.cylinderCapacity}</td>
                            <td>{combinedData.security && formatDate(combinedData.security[id]?.registrationDate)}</td>
                            <td>{combinedData.security && combinedData.security[id]?.originalOwner}</td>
                            <td>{combinedData.security && combinedData.security[id]?.taxNo}</td>
                            <td>{combinedData.security && combinedData.security[id]?.key}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.revenueStartDate)}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.revenueEndDate)}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.insuranceStartDate)}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.insuranceEndDate)}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.taxStartDate)}</td>
                            <td>{combinedData.followup && formatDate(combinedData.followup[id]?.taxEndDate)}</td>
                            <td>{combinedData.maintenance && formatDate(combinedData.maintenance[id]?.date)}</td>
                            <td>{combinedData.maintenance && combinedData.maintenance[id]?.maintenanceType}</td>
                            <td>{combinedData.maintenance && combinedData.maintenance[id]?.serviceMilage}</td>
                            <td>{combinedData.maintenance && combinedData.maintenance[id]?.reason}</td>
                            <td>{combinedData.maintenance && combinedData.maintenance[id]?.otherVehicleMaintenance}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button className="button-back" onClick={() => {Navigate('/records/historyRecords')}}>BACK</button>  

                <button className="button-print" onClick={(event) => handlePrint(event)}>PRINT</button>

            </div>
        </form>
    )

}
export default VehicleRecords;