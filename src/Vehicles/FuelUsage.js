import React, {useState, useEffect} from "react";
import SideBar from "../Vehicles/SideBar";
import axios from "axios";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useNavigate, useLocation } from "react-router-dom";


function FuelUsage() {
   
    const Navigate = useNavigate();
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [otherVehicle, setOtherVehicle] = useState('');
    const [vehicleno, setVehicle] = useState([]);
    const [fuelDate, setFuelDate] = useState(null);
    const formattedFuelDate = fuelDate ? format(fuelDate, 'yyyy-MM-dd') : '';
    const [fuelType, setFuelType] = useState('');
    const [fuelPumped, setFuelPumped] = useState(0);
    const [cost, setCost] = useState(0);
    const location = useLocation();
    const { username } = location.state || { username: undefined };

    const handleVehicleChange = async (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        if (value) {
            try {
                const response = await axios.post('http://localhost:8081/vehicles/historyDetails/viewFuelType', { vehicleno: value });
                setFuelType(response.data.success && response.data.fuel ? response.data.fuel.fuelType : '');
            } catch (error) {
                console.error('Error fetching fuel type:', error);
                setFuelType('');
            }
        } else {
            setFuelType('');
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
          vehicleno: selectedVehicle,
          date: formattedFuelDate,
          fuelType: fuelType,
          fuelPumped: parseFloat(fuelPumped),
          cost: parseFloat(cost)
        };
    
        axios.post('http://localhost:8081/vehicles/historyDetails/fuelUsage', vehicleData)
        .then(response => {
            if (response.data.loginStatus) {
                alert('Fuel Details Added Successfully');
            } else {
                alert('Failed to add the Fuel:', response.data.error);
            }
        })
        .catch(err => {
            console.error('Error Add Fuel Details:', err.message);
        });
    };
  
    
    const reset =  (e) => {
        e.preventDefault();
        setFuelDate(null);
        setFuelPumped(0);
        setFuelType('');
        setCost(0);
        setSelectedVehicle('');   
        setOtherVehicle('');     
    }
    
    return(
    <div>
        <SideBar/>
        <form className='fuel-form' onSubmit={submitHandler}>
            <div className='fuel-vehicle-form'>
                <h2>Fuel Usage</h2>
                <div className="journey-dropdown">
                    <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number: </label>
                        <select value={selectedVehicle} onChange={handleVehicleChange}>
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
                        <input type="text" value={otherVehicle} onChange={(event) => setOtherVehicle(event.target.value)} placeholder="Enter other vehicle number" />
                        )}
                </div>
                <div className={`form-section ${!selectedVehicle ? 'blur' : ''}`}>
                <div className="label">
                    <label>
                        Date of Pumped Fuel:
                        <DatePicker selected={fuelDate}  onChange={date => setFuelDate(date)} formatDate="MM/DD/YYYY" filterDate={date => date.getDate() !== 5} showYearDropdown scrollableMonthYearDropdown className="date"/>
                    </label>
                </div>
                <div className="label">
                    <label>
                        Fuel Type:
                        <input type="text" value={fuelType} readOnly />
                    </label>
                </div>
                <div className="label">
                    <label>
                        No of Litters Fuel Pumped:
                        <input
                        type="text"
                        value={fuelPumped === '' ? '' : `${fuelPumped} liters`}
                        onChange={(e) => {
                            const userInput = e.target.value;
                            const numericValue = userInput.replace('liters', '').trim();
                            setFuelPumped(numericValue);
                        }}
                        required="required"/>
                    </label>
                </div>
                <div className="label">
                <label>Cost for Fuel Pumped (LKR):
                    <input type="text" value={cost} onChange={(e) => setCost(e.target.value)} required="required"/>
                 </label>
                </div>
                </div>
                <button className="button-submit" type="submit">Add Fuel Details</button>

                <button className="button-reset" onClick={reset}>RESET</button>

                <button className="back" onClick={() => {Navigate('/admin/home', { state: { username } })}}>BACK</button>
            </div>
        </form>
    </div>
    )

}
export default FuelUsage;