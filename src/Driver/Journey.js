import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import DateTimePicker from 'react-datetime';
import moment from 'moment-timezone';
import 'react-datetime/css/react-datetime.css';


function Journey() {

    const [ trips, setTrips] = useState({drivername: "", tripmode: "", vehicleno: "", datetime: "", location: "",  meter:""});

    const Navigate = useNavigate(); 
    const [vehicleno, setVehicle] = useState([])
    const [location1, setLocation] = useState([])
    const location = useLocation();
    const { username } = location.state || { username: undefined };

    const [selectedDate, setSelectedDate] = useState(moment());

    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [otherVehicle, setOtherVehicle] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [otherLocation, setOtherLocation] = useState('');

    const [selectedOption, setSelectedOption] = useState('Start'); 
    // const [startVehicleNumber, setStartVehicleNumber] = useState('');
    // const [startLocation, setStartLocation] = useState('');

    const [tripStatus, setTripStatus] = useState(false);
    const [startTripDetails, setStartTripDetails] = useState({
        vehicleno: '',
        location: '',
      });

      useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/driver');
        }
    }, [username, Navigate]);
    
    const handleVehicleChange = (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        // Clear the text field value if a different option is selected
        if (value !== 'other') {
          setOtherVehicle('');
        }
    };

    const handleLocationChange = (event) => {
        const value = event.target.value;
        setSelectedLocation(value);
        // Clear the text field value if a different option is selected
        if (value !== 'other') {
          setOtherLocation('');
        }
    };


    useEffect(() => {
        // Axios request to fetch data
        axios.post('http://localhost:8081/driver/dashboard/journey')
        .then(response => {
            console.log("DropDown Added Successfully", response);
            setTripStatus(response.data.tripStatus);
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });
    
        // Fetch request to fetch data (optional, as you can choose either Axios or Fetch)
        fetch('http://localhost:8081/driver/dashboard/journey/dropdown', {
            method: 'POST',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.loginStatus2) {
                    setVehicle(data.vehicleno);
                    setLocation(data.location1);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

            axios.get(`http://localhost:8081/driver/dashboard/latest-start-trip/${username}`)
            .then(response => {
                const data = response.data.LatestStartDetails; 
                if (data) {
                    setStartTripDetails(data);
                    // If you want to extract specific fields and set them, you can do so here
                    setSelectedVehicle(data.vehicleno); // Make sure this aligns with the response structure
                    setSelectedLocation(data.location); // Adjust field names as needed
                    setTripStatus(true);
                } else {
                    setTripStatus(false);
                }
            })
            .catch(err => {
                console.log("Error fetching start trip details", err);
            });

    }, [selectedVehicle, username]);

    const onSelect = ({target: {value} }) => {
        setSelectedOption(value);
    }

    const isChecked = (value) => value === selectedOption;

    const submitHandler = (e) => {
        e.preventDefault();

        let isValid = true;


        if (selectedOption === 'Start') {
            if (tripStatus) {
                alert('You must end your current trip before starting a new one.');
                isValid = false;
            } else if (!selectedDate.isValid() || selectedDate.isBefore(moment())) {
                alert('Please select a valid future date and time for the Start Trip.');
                isValid = false;
            } else if (!selectedVehicle) {
                alert('Please select a valid Vehicle Number.');
                isValid = false;
            } else if (!selectedLocation) {
                alert('Please select a valid Location.');
                isValid = false;
            }
        } else { // For 'End', you might have different validations
            if (tripStatus) {
                alert('You must end your current trip before starting a new one.');
                isValid = false;
            }else if (!selectedVehicle && !selectedLocation) {
                alert('You have to start a new trip.');
                isValid = false;
            }else if (!selectedDate ) {
                alert('Please select a valid date and time for the End Trip.');
                isValid = false;
            }else if (!trips.meter ) {
                alert('Please enter a valid meter value for the End Trip.');
                isValid = false;
            }
        }
        if(isValid){   
            const formattedDate = moment(selectedDate).tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');        
        
            const TripData = {
                drivername: username,
                tripmode: selectedOption,
                vehicleno: selectedVehicle === 'other' ? otherVehicle : selectedVehicle,
                datetime: formattedDate,
                location: selectedLocation === 'other' ? otherLocation : selectedLocation,
                meter: trips.meter,
            };
            
            console.log("Values:", TripData);
            axios.post('http://localhost:8081/driver/dashboard/journey', TripData)
            .then(response => {
                if (response.data.success) {
                    alert(`Trip ${selectedOption.toLowerCase()}ed successfully`);
                    setTripStatus(selectedOption === 'Start');
                    reset(); // Reset form fields (you need to define this function)
                } else {
                    alert(response.data.message);
                }
            })
            .catch(err => {
                console.error("Error adding trip details:", err);
                alert("Error adding trip details: " + err.message);
            });
        }
    };


    const handleInput = (event) => {
        setTrips({...trips, [event.target.name]:event.target.value});
    }
    

    const reset =  () => {
        setSelectedDate(moment(new Date())); 
        setSelectedVehicle('');
        setSelectedLocation('');
        setOtherVehicle(''); 
        setOtherLocation('');
        setStartTripDetails({
            vehicleno: '',
            location: '',
        });
        setTrips({tripmode: "", vehicleno: "", datetime: "", location: "",  meter:""});
        setSelectedOption('Start');
        
    }

    
    return(
        <form className='journey-form' onSubmit={submitHandler}>
            <div className="journey-inner">
            {
            username?
            <div className='jouney-driver'>
            <h2> Trip Details</h2>
            <div className="welcome-journey">
                <label htmlFor="username" name="username" >Driver Name</label>
                <input type="text" name="username" value={username} readOnly/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="tripmode"><span className="chekmark">Trip Mode</span>
                    <div className='journey-radio'>
                    <input id="startTrip" name="selectedOption" value="Start" type="radio" checked={isChecked("Start")} onChange={onSelect} className="hidden-radio"/>
                    <label htmlFor="startTrip">Start Trip: </label>

                    <input id="endTrip" name="selectedOption" value="End" type="radio" checked={isChecked("End")} onChange={onSelect} className="hidden-radio"/>
                    <label htmlFor="endTrip">End Trip: </label>
                    </div>
                </label>
            </div>
            {
            selectedOption === 'Start' && (
            <div>
                <div className="journey-dropdown">
                <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number</label>
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
                <div className="welcome-journey">
                    <label htmlFor="datetime">Trip Start Date and Time</label>
                    <DateTimePicker inputProps={{ style: { width: 330 }}} value={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)}/>
                </div>
                <div className="journey-dropdown">
                <label htmlFor="location" name="location" >Location</label>
                    <select value={selectedLocation} onChange={handleLocationChange}>
                    <option value="">Choose Your Location</option>
                    {location1.length > 0 ? (
                        location1.map(number => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))
                    ) : (
                    <option value="" disabled>
                        No Locations Available
                    </option>
                    )}
                    <option value="other">Other</option>
                    </select>
                    {selectedLocation === 'other' && (
                    <input type="text" value={otherLocation} onChange={(event) => setOtherLocation(event.target.value)} placeholder="Enter other location"/>
                    )}
                </div>
                <div className="welcome-journey">
                    <label htmlFor="meter" name="meter" >Meter Reading</label>
                    <input type="text" name="meter" value={trips.meter} onChange={handleInput} />
                </div>
            </div>
            )}
            {
            selectedOption === 'End' && ( 
            <div>
                <div className="welcome-journey">
                    <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number</label>
                    <input type="text" name="vehicleno" value={startTripDetails.vehicleno} readOnly/>
                </div>
                <div className="welcome-journey">
                    <label htmlFor="datetime">Trip End Date and Time</label>
                    <DateTimePicker inputProps={{ style: { width: 330 }}} selected={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)}/>
                </div>
                <div className="welcome-journey">
                    <label htmlFor="location" name="location" >Location</label>
                    <input type="text" name="location" value={startTripDetails.location} readOnly/>
                </div>
                <div className="welcome-journey">
                    <label htmlFor="meter" name="meter" >Meter Rading</label>
                    <input type="text" name="meter" value={trips.meter} onChange={handleInput}/>
                </div>
            </div>
            )
            }

            <button type="submit" className="button-submit">SUBMIT</button>

            <button className="button-reset" onClick={reset}>RESET</button>
             
            <button className="button-back" onClick={() => {Navigate('/driver/dashboard', { state: { username } })}}>BACK</button>  
            </div>  
            :
            <div>
                <h2>Login Now</h2>
                <Link to="/driver" className="button-submit">Login</Link>
            </div>         
            }
            </div>
        </form>


    )
}

export default Journey;