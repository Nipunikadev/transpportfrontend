import React, {useState} from "react";
import RegisterValidations from "./RegisterValidations";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css'


function Register(){

    const [drivingLicense, setDrivingLicense] = useState(null);
    const [ admins, setAdmins] = useState({firstname: "", lastname: "",  nic: "", contact: "",  email:"", username: "", password: "", confirmpassword: ""});
    const [ users, setUsers] = useState({firstname: "", lastname: "", contact: "",  email:"", username: "", password: "", confirmpassword: ""});
    const [ drivers, setDrivers] = useState({ firstname: "", lastname: "",  nic: "", contact: "", drivingLicense:drivingLicense, username: "", password: "", confirmpassword: ""});
    const [error, setError] = useState('');

    const [errors, setErrors] = useState({})
    const Navigate = useNavigate(); 
    const location = useLocation();
    const { username } = location.state || { username: undefined };

    const [selectedOption, setSelectedOption] = useState("Admin")  

    const onSelect = ({target: {value} }) => {
        setSelectedOption(value);
    }
    
    // function onValueChange(event){
    //     setSelectedOption(event.target.value)
    //     const { name } = event.target.value
    //     console.log('clicked', name)
    // }

    const isChecked = (value) => value === selectedOption;
    
    const submitHandler = e => {
        e.preventDefault();
        const validationErrors = RegisterValidations(admins,users, drivers);
        console.log(selectedOption);
        if(selectedOption === 'Admin'){
            setErrors(validationErrors);
            if(!validationErrors.email && !validationErrors.username && !validationErrors.password && !validationErrors.confirmpassword){
                const adminData = { ...admins};
                console.log("Values:", adminData);
                axios.post('http://localhost:8081/admin/home/register', adminData)
                .then(response => {
                    console.log("Admin Registered Successfully", response);
                })
                .catch(err => {
                    console.error("Error Registering Admin", err);
                    setError('Failed to Registering Admin. Please try again.');
                });
            }
        }else if(selectedOption === 'User'){
            setErrors(validationErrors);
            if(!validationErrors.email && !validationErrors.username && !validationErrors.password && !validationErrors.confirmpassword){
                const userData = { ...users};
                console.log("Values:", userData);
                axios.post('http://localhost:8081/admin/home/register', userData)
                .then(response => {
                    console.log("User Registered Successfully", response);
                })
                .catch(err => {
                    console.error("Error Registering User", err);
                    setError('Failed to Registering User. Please try again.');
                });
            }
        }else if(selectedOption === 'Driver') {
            setErrors(validationErrors);
            if( !validationErrors.username && !validationErrors.password && !validationErrors.confirmpassword){
            const driverData = new FormData(); // Use FormData for file upload
            driverData.append('firstname', drivers.firstname);
            driverData.append('lastname', drivers.lastname);
            driverData.append('nic', drivers.nic);
            driverData.append('contact', drivers.contact);
            driverData.append('drivingLicense', drivingLicense); // Append the file
            driverData.append('username', drivers.username);
            driverData.append('password', drivers.password);
            driverData.append('confirmpassword', drivers.confirmpassword);

            axios.post('http://localhost:8081/admin/home/register/driver', driverData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for files
                }
            })
            .then(response => {
                console.log("Driver Registered Successfully", response);
            })
            .catch(err => {
                console.error("Error Registering Driver", err);
                setError('Failed to Registering Driver. Please try again.');
            });
        }

        }
        // Handling for other roles...
    };

    const handleInput = (event) => {
        setAdmins({...admins, [event.target.name]:event.target.value});
    }

    const handleInput2 = (event) => {
        setUsers({...users, [event.target.name]:event.target.value});
    }

    const handleInput1= (event) => {
        setDrivers({...drivers, [event.target.name]:event.target.value});
    }

    const handleImageChange = (e) => {
        setDrivingLicense(e.target.files[0]);
    };

    const reset =  (e) => {
        setErrors("");
        e.preventDefault();
        if(selectedOption === 'Admin'){ 
            setAdmins({firstname: "", lastname: "",  nic: "", contact: "", email:"", username: "", password: "", confirmpassword: ""});
        }else if(selectedOption === 'User'){ 
            setUsers({firstname: "", lastname: "", contact: "", email:"", username: "", password: "", confirmpassword: ""});
        }else{
            setDrivers({ firstname: "", lastname: "",  nic: "", contact: "", drivingLicense:"",  username: "" , password: "", confirmpassword: ""});
        }
        setDrivingLicense(null);

    }

    return(
        <form className="registerForm" onSubmit={submitHandler}>
            <div className="form-register">
            <div className="registerImage"></div>
            <div className="form-radio">
                <input id="roleAdmin" name="selectedOption" value="Admin" type="radio" checked={isChecked("Admin")} onChange={onSelect} className="hidden-radio"/>
                <label htmlFor="roleAdmin">Admin: </label>

                <input id="roleUser" name="selectedOption" value="User" type="radio" checked={isChecked("User")} onChange={onSelect} className="hidden-radio"/>
                <label htmlFor="roleUser">User: </label>

                <input id="roleDriver" name="selectedOption" value="Driver" type="radio" checked={isChecked("Driver")} onChange={onSelect} className="hidden-radio"/>
                <label htmlFor="roleDriver">Driver: </label>
                </div>
                {
                selectedOption === 'Admin' && (
                <div className="fieldSet">
                    <h2>Admin Registration
                    </h2>
                    <fieldset ><h3>Admin Registration Details</h3>
                    <div className="form-group">
                        <label htmlFor="firstname" name="firstname" >First Name</label>
                        <input type="text" name="firstname" onChange={handleInput} value={admins.firstname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" name="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput} value={admins.lastname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nic">NIC</label>
                        <input type="text" name="nic"  onChange={handleInput} value={admins.nic} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput} value={admins.contact} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"  onChange={handleInput} value={admins.email}/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    </fieldset>
                    <br/>
                    <fieldset><h3>Create Admin Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput} value={admins.username}/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput} value={admins.password}/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput} value={admins.confirmpassword}/>
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                    </div>
                    </fieldset>
                </div>
                )}
                {
                selectedOption === 'User' && (
                <div className="fieldSet">
                    <h2>User Registration
                    </h2>
                    <fieldset ><h3>User Registration Details</h3>
                    <div className="form-group">
                        <label htmlFor="firstname" name="firstname" >First Name</label>
                        <input type="text" name="firstname" onChange={handleInput2} value={users.firstname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" name="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput2} value={users.lastname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput2} value={users.contact} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"  onChange={handleInput2} value={users.email}/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    </fieldset>
                    <br/>
                    <fieldset><h3>Create User Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput2} value={users.username}/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput2} value={users.password}/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput2} value={users.confirmpassword}/>
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                    </div>
                    </fieldset>
                </div>
                )}
                {
                selectedOption === 'Driver' && ( 
                <div className="fieldSet">
                    <h2>Driver Registration</h2>
                    <button className="button-update" onClick={() => {Navigate('/admin/home/register/driver/updateDriver')}}>Update Driver Details</button>
                    <br/>
                    <fieldset><h3>Driver Registration Details</h3>
                    <div className="form-group">
                        <label htmlFor="firstname" >First Name</label>
                        <input type="text" name="firstname" onChange={handleInput1} value={drivers.firstname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput1} value={drivers.lastname} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nic">NIC</label>
                        <input type="text" name="nic"  onChange={handleInput1} value={drivers.nic} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput1} value={drivers.contact} required="required"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Driving License Image:</label>
                        <input type="file" onChange={(e) => handleImageChange(e, 'drivingLicense')} />
                    </div>
                    </fieldset>
                    <fieldset><h3>Create Driver Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput1} value={drivers.username}/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput1} value={drivers.password}/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput1} value={drivers.confirmpassword}/>
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                    </div>
                    </fieldset>
                </div>
                )
                }
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="button-submit">REGISTER</button>

                <button className="button-reset" onClick={reset}>RESET</button>

                <button className="button-back" onClick={() => {Navigate('/admin/home', { state: { username } })}}>BACK</button>
            </div>
        </form>
    );
}

export default Register;