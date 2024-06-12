import React, {useState} from "react";
import axios from 'axios';
import UserLoginValidations from "./UserLoginValidations"
import { useNavigate } from "react-router-dom";

const PasswordChangePopup = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

        // Perform validation
        let validationErrors = {};
        const { username, currentPassword, newPassword, confirmPassword } = formData;


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

        onSubmit(formData);
        onClose();
    };
    
  
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-inner">
                <h2>Change Password</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange} autoComplete="off"
                    />
                    {errors.username && <span className="text-danger">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="currentPassword">Current Password:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentpassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                    />
                     {errors.currentPassword && <span className="text-danger">{errors.currentPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                    {errors.newPassword && <span className="text-danger">{errors.newPassword}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                </div>
                <button className="button-submit" >Submit</button>
                <button type="button" className="button-cancel" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
  };

function UserLogin(){

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
        const validationErrors = UserLoginValidations(details);
        console.log('Validation Errors:', validationErrors);
        setErrors(validationErrors);
        if(!validationErrors.username && !validationErrors.password){
            try{
                const response = await axios.post('http://localhost:8081/user', details);
                console.log('Response:', response.data);
                if(response.data.loginStatus === true){
                    console.log('Login Success');
                    Navigate('/user/home', { state: { username: details.username } });
                }
                else{
                    alert(response.data.loginStatus);
                }
            }
            catch(err) {
                console.log('Error:', err);
            } 
        }  
    }

    const handleInput = (event) => {
        console.log('handleInput called')
        setDetails(details => ({...details, [event.target.name] : event.target.value}));
    }

    const handlePasswordChangeSubmit = async ({ username, currentPassword, newPassword, confirmPassword }) => {

        try {
            const response = await axios.post('http://localhost:8081/user/reset-password', { username, currentPassword, newPassword, confirmPassword });
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
                    <input type="text" id="username" name="username" onChange={handleInput} value={details.username} autoComplete="off"/>
                    {error.username && <span className="text-danger">{error.username}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" id="password" name="password" onChange={handleInput} value={details.password}/>
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

export default UserLogin;