import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import SideBar from "./SideBar";
import { useNavigate, useLocation } from "react-router-dom";


function VehicleMaintenance() {

    const Navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [selectedDate, setSelectedDate] = useState(null);
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [otherVehicle, setOtherVehicle] = useState('');
    const [vehicleMaintenance, setVehicleMaintenance] = useState('');
    const [otherVehicleMaintenance, setOtherVehicleMaintenance] = useState('');
    const [vehicleno, setVehicle] = useState([])
    const [serviceMilage, setServiceMilage] = useState('');
    const [reason, setReason] = useState('');
    const [maintenanceBill, setMaintenanceBill] = useState([]);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
  // Function to handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleImageChange({ target: { files } }, 'maintenanceBill');
  };

  // Function to handle file drag over
  const handleDragOver = (e) => {
      e.preventDefault();
      setDragging(true);
  };

  // Function to handle file drag leave
  const handleDragLeave = () => {
      setDragging(false);
  };

    const handleVehicleChange = (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        // Clear the text field value if a different option is selected
        if (value !== 'other') {
          setOtherVehicle('');
        }
    };

    const handleVehicleMaintenance = (event) => {
      const value = event.target.value;
      setVehicleMaintenance(value);
      // Clear the text field value if a different option is selected
      if (value !== 'other') {
        setOtherVehicleMaintenance('');
      }else if(value !== 'Repair'){
        setReason('');
      }else{
        setServiceMilage('');
      }
  };

const handleImageChange = (e) => {
  setMaintenanceBill(Array.from(e.target.files)); // This allows storing multiple files
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
    }, []);

    const submitHandler = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('vehicleno', selectedVehicle);
      formData.append('date', formattedDate);
      formData.append('maintenanceType', vehicleMaintenance);
      formData.append('serviceMilage', serviceMilage);
      formData.append('reason', reason);
      maintenanceBill.forEach(file => formData.append('maintenanceBill', file));
  
      axios.post('http://localhost:8081/vehicles/historyDetails/vehicleMaintenance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
          .then(response => {
              if (response.data.loginStatus) {
                console.log("Form submitted successfully");
                  alert('Vehicle Maintenance Details Added Successfully');
                  reset();
              } else {
                  alert('Failed to add the vehicle:', response.data.error);
              }
          })
          .catch(err => {
              console.error('Error Add Vehicle Maintenance Details:', err.message);
          });
    };
  
  
      const reset =  () => {
        setSelectedDate(null);
        setSelectedVehicle('')
        setVehicleMaintenance('')
        setServiceMilage('');
        setReason('');
        setOtherVehicleMaintenance('');
        setMaintenanceBill([]);
      }
  
      const today = new Date();
      
    return(
      <div>
        <SideBar username={username} />
        <form className='security-form' onSubmit={submitHandler}>
          <div className='security-vehicle-form'>
            <h2>Vehicle Maintenance</h2>
            <div className="journey-dropdown">
                <label htmlFor="vehicleno">Vehicle Number: </label>
                  <select id="vehicleno" value={selectedVehicle} onChange={handleVehicleChange}>
                    <option value="">Choose Your Vehicle</option>
                    {vehicleno.length > 0 ? (
                        vehicleno.map((number, index) => (
                            <option key={index} value={number}>
                                {number}
                            </option>
                        ))
                    ) : (
                    <option value="" disabled>
                        No Vehicle Numbers Available
                    </option>
                    )}
                    <option value="other">Other</option>
                  </select>
                  {selectedVehicle === 'other' && (
                    <input id="vehicleno" name="vehicleno" type="text" value={otherVehicle} onChange={(event) => setOtherVehicle(event.target.value)} placeholder="Enter other vehicle number" />
                  )}
            </div>
            <div className={`form-section ${!selectedVehicle ? 'blur' : ''}`}>
            <div className="label">
              <label htmlFor="date">Repaire or Service Date:
                <DatePicker id="date" selected={selectedDate}  onChange={date => setSelectedDate(date)} formatDate="MM/dd/yyyy"  showYearDropdown scrollableMonthYearDropdown className="date" maxDate={today}/>
              </label>
            </div>
            <div className="journey-dropdown">
              <label htmlFor="maintenance">Maintenance Type</label>
              <select id="maintenance" value={vehicleMaintenance} onChange={handleVehicleMaintenance}>
                <option value="">Select Maintenance Type</option>
                <option value="Service">Service</option>
                <option value="Repair">Repair</option>
                <option value="other">Other</option>
              </select>
              {vehicleMaintenance === 'Service' && (
                <input id="service" name="maintenance" type="text" value={serviceMilage} onChange={(event) => setServiceMilage(event.target.value)} placeholder="Enter Vehicle Milage for Service" />
              )}
              {vehicleMaintenance === 'Repair' && (
                <input id="repair" type="text" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Enter the reason for Repair" />
              )}
              {vehicleMaintenance === 'other' && (
                <input id="other" type="text" value={otherVehicleMaintenance} onChange={(event) => setOtherVehicleMaintenance(event.target.value)} placeholder="Enter other Maintenace Type" />
              )}
            </div>
            <div className="label">
              <label htmlFor="file">Bills for Maintenance:
              <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                <input id="file" className="file" type="file" onChange={(e) => handleImageChange(e, 'maintenanceBill')} multiple />
                <p onClick={() => document.querySelector('.file').click()}>Drop files here or click to upload</p>
                {/* Display file names */}
                {maintenanceBill.length > 0 && (
                  <ul>
                    {maintenanceBill.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              </label>
            </div>
            </div>
            
            <button className="button-submit" type="submit">Add Vehicle Maintenance Details</button>
            <button type="button" className="button-reset" onClick={reset}>RESET</button>
            <button type="button" className="button-back" onClick={() => {Navigate('/admin/home', { state: { username } })}}>BACK</button>
          </div>
        </form>
      </div>
    )

}
export default VehicleMaintenance;