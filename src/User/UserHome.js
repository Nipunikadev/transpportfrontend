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
        })
        .then(err => console.log(err))

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
                <label htmlFor="username" name="username" >User Name</label>
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
            <div className="welcome-journey">
                    <label htmlFor="datetime">Trip Date and Time</label>
                    <DateTimePicker inputProps={{ style: { width: 330 }}} selected={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)} required/>
                </div>
            <div className="welcome-journey">
                <label htmlFor="location" name="location" >Location</label>
                <input type="text" name="location" value={trips.location} onChange={handleInput} required/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="reason" name="reason" >Reason</label>
                <input type="text" name="reason" value={trips.reason} onChange={handleInput} required/>
            </div>
            </div>
             )}
             {
             selectedOption === 'End' && (
                <div>
                <div className="welcome-journey">
                <label htmlFor="datetime">Trip End Date and Time</label>
                <DateTimePicker inputProps={{ style: { width: 330 }}} selected={selectedDate}  dateFormat="DD-MM-YYYY" timeFormat="hh:mm:ss A" onChange={val => setSelectedDate(val)}/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="location" name="location" >Location</label>
                <input type="text" name="location" value={startTripDetails.location} readOnly/>
            </div>
            <div className="welcome-journey">
                <label htmlFor="reason" name="reason" >Reason</label>
                <input type="text" name="reason" value={startTripDetails.reason} readOnly/>
            </div>
        </div>
        )
        }

            <button type="submit" className="button-submit">
            {selectedOption === 'Start' ? 'Start' : 'End'}
            </button>

            <button className="button-reset" onClick={reset}>RESET</button>
             
            <button className="button-back" onClick={() => {Navigate('/user')}}>BACK</button> 

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