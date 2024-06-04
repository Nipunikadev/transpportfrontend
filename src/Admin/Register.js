import React, {useState, useEffect} from "react";
import RegisterValidations from "./RegisterValidations";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css'


function Register(){

    const [drivingLicense, setDrivingLicense] = useState(null);
    const [ admins, setAdmins] = useState({firstname: "", lastname: "",  nic: "", contact: "",  email:"", username: "", password: "", confirmpassword: ""});
    const [ users, setUsers] = useState({firstname: "", lastname: "", contact: "",  email:"", username: "", password: "", confirmpassword: ""});
    const [ drivers, setDrivers] = useState({ firstname: "", lastname: "",  nic: "", contact: "", drivingLicense:drivingLicense, username: "", password: "", confirmpassword: ""});

    const [errors, setErrors] = useState({})
    const navigate = useNavigate(); 
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [dragging, setDragging] = useState(false);

    const [selectedOption, setSelectedOption] = useState("Admin") 
    
    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            navigate('/admin');
        }
    }, [username, navigate]);


    // Function to handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0]; // Only allow one file
        setDrivingLicense(file);
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

    const onSelect = ({target: {value} }) => {
        setSelectedOption(value);
    }

    const isChecked = (value) => value === selectedOption;
    
    const reset =  () => {
        setErrors("");
        if(selectedOption === 'Admin'){ 
            setAdmins({firstname: "", lastname: "",  nic: "", contact: "", email:"", username: "", password: "", confirmpassword: ""});
        }else if(selectedOption === 'User'){ 
            setUsers({firstname: "", lastname: "", contact: "", email:"", username: "", password: "", confirmpassword: ""});
        }else{
            setDrivers({ firstname: "", lastname: "",  nic: "", contact: "", drivingLicense:"",  username: "" , password: "", confirmpassword: ""});
        }
        setDrivingLicense(null);

    }

    const submitHandler = (event) => {
        event.preventDefault();
        const validationErrors = RegisterValidations(admins,users, drivers);
        console.log(selectedOption);
        setErrors(validationErrors);

        if(selectedOption === 'Admin' && Object.keys(validationErrors).length === 0){
                const adminData = { ...admins};
                console.log("Values:", adminData);
                axios.post('http://localhost:8081/admin/home/register', adminData)
                .then(response => {
                    console.log("Response:", response.data);
                    if (response.data.Message === "Username or Password already taken") {
                        alert("Username and Password already taken. Please choose a different username or password.");
                    } else if (response.data.Message === "Admin Registered Successfully") {
                        alert("Admin Registered Successfully");
                        reset();
                    } else {
                        alert("Error Registering Admin: " + response.data.Message);
                    }
                })
                .catch(err => {
                    console.log("Error Registering Admin", err);
                    alert("Error Registering Admin: " + err);
                });
        }else if(selectedOption === 'User' && Object.keys(validationErrors).length === 0){
                const userData = { ...users};
                console.log("Values:", userData);
                axios.post('http://localhost:8081/admin/home/register/user', userData)
                .then(response => {
                    console.log("Response:", response.data);
                if (response.data.Message === "Username or Password already taken") {
                    alert("Username and Password already taken. Please choose a different username or password.");
                } else if (response.data.Message === "User Registered Successfully") {
                    alert("User Registered Successfully");
                    reset();
                } else {
                    alert("Error Registering User: " + response.data.Message);
                }
                })
                .catch(err => {
                    console.log("Error Registering User", err);
                    alert("Error Registering User: " + err);
                });
        }else if(selectedOption === 'Driver'  && Object.keys(validationErrors).length === 0) {
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
                console.log("Response:", response.data);
                if (response.data.Message === "Username or Password already taken") {
                    alert("Username and Password already taken. Please choose a different username or password.");
                } else if (response.data.Message === "Driver Registered Successfully") {
                    alert("Driver Registered Successfully");
                    reset();
                } else {
                    alert("Error Registering Driver: " + response.data.Message);
                }
            })
            .catch(err => {
                console.log("Error Registering Driver", err);
                alert("Error Registering Driver: " + err);
            });
        }

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
        const file = e.target.files[0]; // Only allow one file
        setDrivingLicense(file);
    };

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
                        <input type="text" name="firstname" onChange={handleInput} value={admins.firstname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" name="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput} value={admins.lastname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nic">NIC</label>
                        <input type="text" name="nic"  onChange={handleInput} value={admins.nic} required="required" autoComplete="off"/>
                        {errors.nic && <span className="text-danger">{errors.nic}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput} value={admins.contact} required="required" autoComplete="off"/>
                        {errors.contact && <span className="text-danger">{errors.contact}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"  onChange={handleInput} value={admins.email} required="required" autoComplete="off"/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    </fieldset>
                    <br/>
                    <fieldset><h3>Create Admin Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput} value={admins.username} required="required" autoComplete="off"/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput} required="required" value={admins.password}/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput} required="required" value={admins.confirmpassword}/>
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
                        <input type="text" name="firstname" onChange={handleInput2} value={users.firstname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" name="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput2} value={users.lastname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput2} value={users.contact} required="required" autoComplete="off"/>
                        {errors.contact && <span className="text-danger">{errors.contact}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email"  onChange={handleInput2} value={users.email} required="required" autoComplete="off"/>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    </fieldset>
                    <br/>
                    <fieldset><h3>Create User Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput2} value={users.username} required="required" autoComplete="off"/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput2} value={users.password} required="required" autoComplete="off"/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput2} value={users.confirmpassword} required="required" autoComplete="off"/>
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                    </div>
                    </fieldset>
                </div>
                )}
                {
                selectedOption === 'Driver' && ( 
                <div className="fieldSet">
                    <h2>Driver Registration</h2>
                    <button className="button-update" onClick={() => {navigate('/admin/home/register/driver/updateDriver', { state: { username } })}}>Update Driver Details</button>
                    <br/>
                    <fieldset><h3>Driver Registration Details</h3>
                    <div className="form-group">
                        <label htmlFor="firstname" >First Name</label>
                        <input type="text" name="firstname" onChange={handleInput1} value={drivers.firstname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname" >Last Name</label>
                        <input type="text" name="lastname" onChange={handleInput1} value={drivers.lastname} required="required" autoComplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nic">NIC</label>
                        <input type="text" name="nic"  onChange={handleInput1} value={drivers.nic} required="required" autoComplete="off"/>
                        {errors.nic && <span className="text-danger">{errors.nic}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact">Mobile Number</label>
                        <input type="text" name="contact"  onChange={handleInput1} value={drivers.contact} required="required" autoComplete="off"/>
                        {errors.contact && <span className="text-danger">{errors.contact}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Driving License Image:</label>
                        <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
                            <input className="file" type="file" onChange={handleImageChange} />
                            <p onClick={() => document.querySelector('.file').click()}>Drop file here or click to upload</p>
                            {/* Display file name */}
                            {drivingLicense && (
                                <p>{drivingLicense.name}</p>
                            )}
                        </div>
                    </div>
                    </fieldset>
                    <fieldset><h3>Create Driver Account Details</h3>
                    <div className="form-group">
                        <label htmlFor="name" name="username" >User Name</label>
                        <input type="text" name="username" onChange={handleInput1} value={drivers.username} required="required" autoComplete="off"/>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"  onChange={handleInput1} value={drivers.password} required="required" autoComplete="off"/>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" name="confirmpassword"  onChange={handleInput1} value={drivers.confirmpassword} required="required" autoComplete="off"/>
                        {errors.confirmpassword && <span className="text-danger">{errors.confirmpassword}</span>}
                    </div>
                    </fieldset>
                </div>
                )
                }
                <button type="submit" className="button-submit">REGISTER</button>

                <button className="button-reset" onClick={reset}>RESET</button>

                <button className="button-back" onClick={() => {navigate('/admin/home', { state: { username } })}}>BACK</button>
            </div>
        </form>
    );
}

export default Register;