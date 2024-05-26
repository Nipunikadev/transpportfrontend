import React, {useState} from "react";
import axios from 'axios';
import AdminLoginValidations from "./AdminLoginValidations"
import { useNavigate } from "react-router-dom";

const PasswordChangePopup = ({ onClose, onSubmit }) => {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
  
    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

        // Perform validation
        let validationErrors = {};

        if (!username) {
            validationErrors.username = "Username is required";
        }

        if (!currentPassword) {
            validationErrors.currentPassword = "Current Password is required";
        }

        if (!newPassword) {
            validationErrors.newPassword = "New Password is required";
        } else if (newPassword.length < 8) {
            validationErrors.newPassword = "New Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            validationErrors.confirmPassword = "Confirm Password is required";
        } else if (confirmPassword !== newPassword) {
            validationErrors.confirmPassword = "Passwords do not match";
        }

        // Perform any validation if needed
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ username, currentPassword, newPassword, confirmPassword }); 
            onClose();
        }
    };

    // const handleSubmit = () => {
    //     // Perform any validation if needed
    //     if (newPassword === confirmPassword) {
    //         onSubmit({ username, currentPassword, newPassword, confirmPassword });
    //         onClose();
    //     } else {
    //         // Handle password mismatch
    //         console.log("Password and confirmation password do not match");
    //         // Optionally, you can set an error state or show a message
    //     }
    // };
  
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-inner">
                <h2>Change Password</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} autoComplete="off"
                    />
                    {errors.username && <span className="text-danger">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                     {errors.currentPassword && <span className="text-danger">{errors.currentPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {errors.newPassword && <span className="text-danger">{errors.newPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                </div>
                <button className="button-submit" >Submit</button>
                <button className="button-cancel" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
  };
  
function AdminLogin(){

    const [ details, setDetails] = useState({
        username: '', 
        password: ''
    });
    
    const Navigate = useNavigate();

    const [error, setErrors] = useState({});
    const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

    axios.defaults.withCredentials = true;
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = AdminLoginValidations(details);
        console.log('Validation Errors:', validationErrors);
        setErrors(validationErrors);
        if(!validationErrors.username && !validationErrors.password){
            // try{
            //     //const response = await axios.post('https://hunastransportmanagement.000webhostapp.com/admin', details);
            //     const response = await axios.post('http://localhost:8081/admin', details);
            //     console.log('Response:', response.data);
            //     if(response.data.loginStatus === true){
            //         console.log('Login Success');
            //         Navigate('/admin/home');
            //     }
            //     else{
            //         // alert(response.data.loginStatus);
            //         console.log(response.data.loginStatus);
            //     }
            // }
            // catch(err) {
            //     console.log('**Error:', err);
            // } 

            try{
                const response = await axios.post('http://localhost:8081/admin', details);
                console.log('Response:', response.data);
                if(response.data.loginStatus === true){
                    console.log('Login Success');
                    Navigate('/admin/home', { state: { username: details.username } });
                }
                else{
                    alert(response.data.loginStatus);
                }
            }
            catch(err) {
                console.log('Error:', err);
            } 
            // axios.post('http://localhost:8081/admin', details)
            // //Navigate('/admin/home');
            // .then(res => {
            //     Navigate.push('/admin/home')
            // })
            // .catch(err => console.log(err));
            // .then(res => {
            //     if(res.data.Status === "Success"){
            //         Navigate('/admin/home');
            //     }else{
            //         alert(res.data.Message)
            //     }
            
            // })
            // .catch(err => console.log(err)); 
        } 
        
    }

    const handleInput = (event) => {
        console.log('handleInput called')
        setDetails(details => ({...details, [event.target.name] : event.target.value}));
    }

    const handlePasswordChangeSubmit = async ({ username, currentPassword, newPassword, confirmPassword }) => {

        try {
            const response = await axios.post('http://localhost:8081/admin/reset-password', { username, currentPassword, newPassword, confirmPassword });
            console.log(response.data);
            alert ('Password updated successfully')
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.log('No response was received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error: ' + error.message);
            }
        }
    }
    
    return(
        <div>
        <form onSubmit={handleSubmit}>
            <div className={`form-inner ${isChangePasswordOpen ? 'blur-background' : ''}`}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username"><strong>User Name</strong></label>
                    <input type="text" name="username" onChange={handleInput} value={details.username} autoComplete="off"/>
                    {error.username && <span className="text-danger">{error.username}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" name="password" onChange={handleInput} value={details.password}/>
                    {error.password && <span className="text-danger">{error.password}</span>}
                </div>

                <button type="submit" className="button-submit">LOGIN</button>

                <button type="button" className="button-password" onClick={() => setChangePasswordOpen(true)}>CHANGE PASSWORD</button>
            </div>
        </form>
        {isChangePasswordOpen && (
                <PasswordChangePopup
                    onClose={() => setChangePasswordOpen(false)}
                    onSubmit={handlePasswordChangeSubmit}
                />
            )}
        </div>
        
    );
}

export default AdminLogin;