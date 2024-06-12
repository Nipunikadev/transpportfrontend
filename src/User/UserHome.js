import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';


function UserHome() {

    const [ trips, setTrips] = useState({username: "", tripmode:"" , dateTime: "", location: "", reason: ""});

    const Navigate = useNavigate(); 
    const [auth, setAuth] = useState (false)
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [message, setMessage]  = useState('')

    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedOption, setSelectedOption] = useState('Start');

    const [tripStatus, setTripStatus] = useState(false);
    const [startTripDetails, setStartTripDetails] = useState({
        location: '',
        reason: '',
    });

    useEffect(() => {

        axios.post('http://localhost:8081/user/home')
        .then(res =>{
            if(res.data.Status === "Success"){
                setAuth(true);
            }else{
                setAuth(false);
                setMessage(res.data.Message);
            }
            setAuthChecked(true); // Mark auth check as complete
        })
        .catch(err => {
            console.log(err);
            setAuth(false);
            setMessage('Error during authentication');
            setAuthChecked(true); // Mark auth check as complete
        });

            axios.get(`http://localhost:8081/user/home/latest-start-trip/${username}`)
            .then(response => {
                if (response.data.LatestStartDetails) {
                    setStartTripDetails(response.data.LatestStartDetails);
                    setTripStatus(true);
                } else {
                    setTripStatus(false);
                }
            })
            .catch(err => {
                console.log("Error fetching start trip details", err);
            });
    }, [username])

    useEffect(() => {
        if (authChecked && (!auth || !username)) {
            Navigate('/user'); // Redirect if auth check is complete and not authenticated or username is missing
        }
    }, [auth, authChecked, username, Navigate]);

    const handleLogout = (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        axios.post('http://localhost:8081/logout')
            .then(res => {
                if (res.data.Status === "Success") {
                    Navigate('/user');
                } else {
                    alert("Error during logout");
                }
            })
            .catch(err => console.log(err));
    };


    const onSelect = ({ target: { value } }) => {
        setSelectedOption(value);
    }

    const isChecked = (value) => value === selectedOption;

    // const handleLogout = () => {
    //         axios.get('http://localhost:8081/logout')
    //         .then(res => {
    //             if(res.data.Status === "Success"){
    //                 Navigate('/')
    //             }else{
    //                 alert("Error");
    //             }
    //         })
    //         .catch(err => console.log(err));         
    // }
    
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
            } else if (!trips.location) {
                alert('Please enter Location.');
                isValid = false;
            } else if (!trips.reason) {
                alert('Please enter Reason.');
                isValid = false;
            }
        } else { 
            if (!selectedDate.isValid() ) {
                alert('Please select a valid date and time for the End Trip.');
                isValid = false;
            }
        }
        if(isValid){
        const formattedDate = selectedDate.tz('Asia/Colombo').format('YYYY-MM-DD HH:mm:ss');          
    
        const tripData = {
            username: username,
            tripmode: selectedOption,
            dateTime: formattedDate,
            location: trips.location,
            reason: trips.reason,
        };
        console.log("Values:", tripData);

        axios.post('http://localhost:8081/user/home/trips', tripData)
            .then(response => {
                if (response.data.loginStatus2) {
                        alert(`Trip ${selectedOption.toLowerCase()}ed successfully`);
                        setTripStatus(selectedOption === 'Start');
                        reset();
                    } else {
                        alert(response.data.message);
                    }
                })
            .catch(err => {
                alert("Error Add Trip Details", err.message);
            });
        }
    };


    const handleInput = (event) => {
        setTrips({...trips, [event.target.name]:event.target.value});
    }

    const reset =  (e) => {
        setSelectedDate(moment(new Date()));
        setTrips({ username: "", tripmode: "", dateTime: "", location: "", reason: "" });
        setSelectedOption('Start');
    }


    return(
        <form className='welcomeUser-form' onSubmit={submitHandler}>
            <div className="form-inner">
            {
             auth?
             <div className='welcome'>
             <h2> Welcome,{username}</h2>  

             <h3>Add Your Trip</h3>

             <div className="welcome-journey">
                <label htmlFor="username">User Name</label>
                <input type="text" id="username" name="username" value={username} readOnly/>
            </div>
            <div className="welcome-journey">
                <label><span className="chekmark">Trip Mode</span></label>
                <div className='journey-radio'>
                    <input id="startTrip" name="selectedOption" value="Start" type="radio" checked={isChecked("Start")} onChange={onSelect} className="hidden-radio" />
                    <label htmlFor="startTrip">Start Trip: </label>

                    <input id="endTrip" name="selectedOption" value="End" type="radio" checked={isChecked("End")} onChange={onSelect} className="hidden-radio" />
                    <label htmlFor="endTrip">End Trip: </label>
                </div>
            </div>
            {
            selectedOption === 'Start' && (
            <div>
            <div className="welcome-journey">
                    <label htmlFor="datetime">Trip Date and Time</label>
                    <DateTimePicker id="datetime" inputProps={{ style: { width: 330 }}} value={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)} required/>
                </div>
            <div className="welcome-journey">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" value={trips.location} onChange={handleInput} required/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="reason">Reason</label>
                <input type="text" id="reason" name="reason" value={trips.reason} onChange={handleInput} required/>
            </div>
            </div>
             )}
             {
             selectedOption === 'End' && (
                <div>
                <div className="welcome-journey">
                <label htmlFor="enddatetime">Trip End Date and Time</label>
                <DateTimePicker id="enddatetime" inputProps={{ style: { width: 330 }}} value={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)}/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="endlocation">Location</label>
                <input type="text" id="endlocation" name="location" value={startTripDetails.location} readOnly/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="endreason">Reason</label>
                <input type="text" id="endreason" name="reason" value={startTripDetails.reason} readOnly/>
            </div>
        </div>
        )
        }

            <button type="submit" className="button-submit">
            {selectedOption === 'Start' ? 'Start' : 'End'}
            </button>

            <button type="button" className="button-reset" onClick={reset}>RESET</button>
             
            <button type="button" className="button-logout" onClick={handleLogout}>LOGOUT</button> 

            </div>  
            :
            <div>
                <h2>{message}</h2>
                <h2>Login Now</h2>
                <Link to="/user" className="button-submit">Login</Link>
            </div>         
            }
            </div>
        </form>


    )
}

export default UserHome;