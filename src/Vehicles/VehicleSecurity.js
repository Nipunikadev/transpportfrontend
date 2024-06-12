import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import SideBar from "./SideBar";
import { useNavigate, useLocation } from "react-router-dom";


function VehicleSecurity() {

    const Navigate = useNavigate();  
    const location = useLocation();
    const { username } = location.state || { username: undefined }; 
    const [registrationDate, setRegistrationDate] = useState(null);
    const formattedDate = registrationDate ? format(registrationDate, 'yyyy-MM-dd') : '';
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [otherVehicle, setOtherVehicle] = useState('');
    const [vehicleno, setVehicle] = useState([])
    const [vehicleFollowUp, setVehicleFollowUp] = useState('');
    const [taxPayer, setTaxPayer] = useState('');

    const [ securities, setSecurities] = useState({vehicleno: "", registrationDate: formattedDate, originalOwner: "", taxNo: "", key: ""});

    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
    const handleVehicleChange = async(event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        // Clear the text field value if a different option is selected
        if (value && value !== 'other') {
          try {
              const response = await axios.post('http://localhost:8081/vehicles/vehicleDetails/viewTaxPayer', { vehicleno: value });
              if (response.data.success) {
                  setTaxPayer(response.data.vehicle.taxPayer ? "Yes" : "No");
              } else {
                  console.error('Failed to fetch taxpayer status:', response.data.error);
              }
          } catch (err) {
              console.error('Error while fetching taxpayer status:', err);
          }
        } else {
            setTaxPayer(''); // Clear taxpayer status if 'other' or no selection
        }
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

      if (!selectedVehicle || selectedVehicle === "") {
        alert("Please select a vehicle number.");
        return; // Stop the form submission
      }

      const vehicleData = {
        vehicleno: selectedVehicle, // Include selectedVehicle in the data
        registrationDate: formattedDate,
        originalOwner: securities.originalOwner,
        taxNo: securities.taxNo,
        key: securities.key
      };
  
      axios.post('http://localhost:8081/vehicles/vehicleSecurity', vehicleData)
          .then(response => {
              if (response.data.loginStatus) {
                  alert('Vehicle Security Details Added Successfully');
                  reset();
              } else {
                  alert('Failed to add the vehicle:', response.data.error);
              }
          })
          .catch(err => {
              console.error('Error Add Vehicle Security Details:', err.message);
          });
    };
  
      const handleInput = (name, value) => {

        if (name === "taxNo" && value !== "" && !/^\d+$/.test(value)) {
          return; // Prevent update if value is not numeric
        }
        
        setSecurities({ ...securities, [name]: value });

      }
  
      const reset =  (e) => {
        if (e) e.preventDefault();
        setRegistrationDate(null);
        setSelectedVehicle('')
        setOtherVehicle('');
        setSecurities({vehicleno: "",
            registrationDate: "",
            originalOwner: "",
            taxNo: "",
            key: "",});
      }

      const handleVehicleFollowup = (event) => {
        const value = event.target.value;
        setVehicleFollowUp(value); // Corrected function name for setting state
    
        if (value === 'Yes') {
          setSecurities(prevSecurities => ({ ...prevSecurities, key: 'Yes' }));
        } else if (value === 'No') {
            setSecurities(prevSecurities => ({ ...prevSecurities, key: 'No' }));
        } else {
            // If "Yes" is selected, clear or set a default value for 'key'
            // You can decide to leave it empty (as below) or set a default value
            setSecurities(prevSecurities => ({ ...prevSecurities, key: '' }));
        }
    };
  
    const today = new Date();
      
    return(
      <div>
          <SideBar username={username} />
        <form className='security-form' onSubmit={submitHandler}>
          <div className='security-vehicle-form'>
            <h2>Vehicle Security Details</h2>
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
                <input type="text" id="vehicleno" name="vehicleno" value={otherVehicle} onChange={(event) => setOtherVehicle(event.target.value)} placeholder="Enter other vehicle number" />
                )}
            </div>
            <div className={`form-section ${!selectedVehicle ? 'blur' : ''}`}>
            <div className="label">
              <label  htmlFor="registrationDate">
              Registration Date:
              <DatePicker id="registrationDate" name="registrationDate" selected={registrationDate}  onChange={date => setRegistrationDate(date)} formatDate="MM/dd/yyyy" showYearDropdown scrollableMonthYearDropdown className="date" maxDate={today} required/>
              </label>
            </div>
            <div className="label">
              <label  htmlFor="original">
                Original Certificate of Registration with:
                <input
                  type="text"
                  id="original"
                  name="original"
                  value={securities.originalOwner}
                  onChange={(e) => handleInput('originalOwner', e.target.value)} required/>
              </label>
              <button className="submit" type="button" onClick={() => {Navigate('/vehicles/vehicleSecurity/originalDocumentsRecords', { state: { username } })}}>Original Documents Issuing Record</button>
            </div>
            {taxPayer === 'Yes' && (
            <div className="label">
              <label  htmlFor="tax">
                No of Paid TAX Receipts:
                <input
                  type="text"
                  id="tax"
                  name="tax"
                  value={securities.taxNo}
                  onChange={(e) => handleInput('taxNo', e.target.value)} required/>
              </label>
            </div>
             )}
            <div className="key-dropdown">
              <label  htmlFor="key">
                Do you have duplicate keys?
                <select id="key" name="key" value={vehicleFollowUp} onChange={handleVehicleFollowup}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </label>
              {/* {vehicleFollowUp === 'Yes' && (
                <input
                  type="text"
                  value={securities.key}
                  onChange={(e) => handleInput('key', e.target.value)}
                  required
                />
              )} */}
            </div>
            </div>
            <button className="button-submit">Add Vehicle Security Details</button>

            <button type="button" className="button-reset" onClick={reset}>RESET</button>

            <button type="button" className="button-back" onClick={() => {Navigate('/admin/home', { state: { username } })}}>BACK</button>
        
          </div>
        </form>
      </div>
    )

}
export default VehicleSecurity;