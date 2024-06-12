import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';


function Attendance() {

    const Navigate = useNavigate(); 
    const location = useLocation();
    const { username } = location.state || { username: undefined };

    const [selectedDate, setSelectedDate] = useState(moment());

    const [attendancemode, setAttendancemode] = useState('In');
    const [checkInLocation, setCheckInLocation] = useState('');
    const [checkOutLocation, setCheckOutLocation] = useState('');

    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/driver');
        }
    }, [username, Navigate]);

    const getLocation = useCallback(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
    
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        const locationName = data.display_name;
                        console.log("Location name:", locationName);
    
                        if (attendancemode === 'In') {
                            setCheckInLocation(locationName);
                        } else if (attendancemode === 'Out') {
                            setCheckOutLocation(locationName);
                        }
                    } catch (error) {
                        console.error("Error getting location name:", error);
                        alert("Failed to convert coordinates to location. Please enter manually.");
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert("User denied the request for Geolocation. Please enter location manually.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert("Location information is unavailable. Please enter location manually.");
                            break;
                        case error.TIMEOUT:
                            alert("The request to get user location timed out. Please enter location manually.");
                            break;
                        case error.UNKNOWN_ERROR:
                            alert("An unknown error occurred. Please enter location manually.");
                            break;
                        default:
                            alert("Unable to retrieve location. Please enter manually.");
                    }
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }, [attendancemode]);

    useEffect(() => {
        if (attendancemode === 'In' || attendancemode === 'Out') {
            getLocation();
        }
    }, [getLocation, attendancemode]);

    const onSelect = ({ target: { value } }) => {
        setAttendancemode(value);
    };

    const isChecked = (value) => value === attendancemode;

      
    const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDate = selectedDate.format("YYYY-MM-DD HH:mm:ss");
    const attendanceData = {
        drivername: username,
        attendancemode,
        checkInDateTime: attendancemode === 'In' ? formattedDate : null,
        checkOutDateTime: attendancemode === 'Out' ? formattedDate : null,
        checkInLocation: attendancemode === 'In' ? checkInLocation : null,
        checkOutLocation: attendancemode === 'Out' ? checkOutLocation : null,
      };

        axios.post('http://localhost:8081/driver/dashboard/attendance', attendanceData)
        .then(response => {
            console.log("Logged in Successfully", response.data);
            alert("Attendance recorded successfully!");
        })
        .catch(err => {
            console.log("Error adding Attendance Details", err);
            alert("Failed to record attendance.");
        });
    
        // // Fetch request to fetch data (optional, as you can choose either Axios or Fetch)
        // fetch('http://localhost:8081/driver/dashboard/journey/dropdown', {
        //     method: 'POST',
        //     credentials: 'include',
        // })
        //     .then((response) => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         if (data.loginStatus2) {
        //             setLocation(data.location1);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching data:', error);
        //     });

        // if (selectedOption === 'End') {
        //     axios.get(`http://localhost:8081/driver/dashboard/latest-start-trip/${username}`)
        //     .then(response => {
        //         const data = response.data.LatestStartDetails; 
        //         if (data) {
        //             setStartTripDetails(data);
        //             // If you want to extract specific fields and set them, you can do so here
        //             setSelectedLocation(data.location); // Adjust field names as needed
        //         }
        //     })
        //     .catch(err => {
        //         console.log("Error fetching start trip details", err);
        //     });
        // }

    };
    
    return(
        <form className='attendance-form' onSubmit={handleSubmit}>
            <div className="attendance-inner">
            {
            username?
            <div className='attendance-driver'>
            <h2> Trip Details</h2>
            <div className="welcome-attendance">
                <label htmlFor="username">Driver Name</label>
                <input type="text" id="username" name="username" value={username} readOnly/>
            </div>
            <div className="welcome-attendance">
                <label><span className="chekmark">Attendance Mode</span>
                    <div className='attendance-radio'>
                    <input id="checkIn" name="selectedOption" value="In" type="radio" checked={isChecked("In")} onChange={onSelect} className="hidden-radio"/>
                    <label htmlFor="checkIn">Check In: </label>

                    <input id="checkOut" name="selectedOption" value="Out" type="radio" checked={isChecked("Out")} onChange={onSelect} className="hidden-radio"/>
                    <label htmlFor="checkOut">Check Out: </label>
                    </div>
                </label>
            </div>
            {attendancemode === 'In' && (
                <div>
                    <div className="welcome-attendance">
                        <label htmlFor="checkInDatetime">Check In Date and Time</label>
                        <DateTimePicker id="checkInDatetime" inputProps={{ style: { width: 330 } }} value={selectedDate} dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)} />
                    </div>
                    <div className="welcome-attendance">
                        <label htmlFor="checkInLocation">Check In Location</label>
                        <input type="text" id="checkInLocation" name="checkInLocation" value={checkInLocation} onChange={(e) => setCheckInLocation(e.target.value)} />
                    </div>
                </div>
            )}
            {attendancemode === 'Out' && (
                <div>
                    <div className="welcome-attendance">
                        <label htmlFor="checkOutDatetime">Check Out Date and Time</label>
                        <DateTimePicker id="checkOutDatetime" inputProps={{ style: { width: 330 } }} value={selectedDate} dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)} />
                    </div>
                    <div className="welcome-attendance">
                        <label htmlFor="checkOutLocation">Check Out Location</label>
                        <input type="text" id="checkOutLocation" name="checkOutLocation" value={checkOutLocation} onChange={(e) => setCheckOutLocation(e.target.value)} />
                    </div>
                </div>
            )}

        <button type="sumbit" className='button-submit'>
          {attendancemode === 'In' ? 'Check In' : 'Check Out'}
        </button>
             
            <button type="button" className="button-back" onClick={() => {Navigate('/driver/dashboard', { state: { username } })}}>BACK</button>   
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

export default Attendance;