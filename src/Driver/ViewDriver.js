import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function ViewDriver(){

    const Navigate = useNavigate(); 
    const [driver, setDriver] = useState([]);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    
    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
    useEffect(() => {
        axios.post('http://localhost:8081/admin/home/register/driver/viewDriver', {})
        .then(res => {
            if (res.data.success) {
                console.log("Sucessfully", res.data.driver);
                setDriver(res.data.driver);
              } else {
                console.error("Failed to fetch Driver data:", res.data.error);
              }
        })
        .catch(err => {
            console.log(err);
        });                
    }, []);

    
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const deletedriver = (deleteDriver) => {
          axios.post('http://localhost:8081/admin/home/register/driver/deleteDriver', deleteDriver)
          .then((res) => {
            console.log('Server response:', res.data);
            if (res.data.success) {
                console.log("Sucessfully Deleted", res.data.driver);
                setDriver(res.data.driver);
              } else {
                console.error("Failed to delete Driver data:", res.data.error);
              }
          })
          .catch((error) => {
            console.log(error);
          })
      };
    
      const handleDeleteClick = (id) => {
        const deleteDriver = { id };
        console.log('Deleting Driver:', deleteDriver);
        const isConfirmed = window.confirm('Are you sure you want to delete this Driver?');
      
        if (isConfirmed) {
          deletedriver(deleteDriver);
        }
      };

  
    return(
        <div>
        <form className='admin-form' onSubmit={handleSubmit}>
            <div className='form-adminView'>
            <h2>Driver Details</h2>
            <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>NIC</th>
                        <th>Contact</th>
                        <th>Driving License</th>
                        <th>User Name</th>
                    </tr>
                </thead>
                <tbody>
                {driver.map((driver, index) => (
                  <tr key={driver.id}>
                    <td>{index + 1}</td>
                    <td>{driver.firstname}</td>
                    <td>{driver.lastname}</td>
                    <td>{driver.nic}</td>
                    <td>{driver.contact}</td>
                    <td>{driver.drivingLicense}</td>
                    <td>{driver.username}</td>
                    <td>
                    <button type="button" className="button-delete" onClick={() => handleDeleteClick(driver.id, username)}>DELETE</button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>

            <button type="button" className="button-back" onClick={() => {Navigate('/admin/home/register', { state: { username } })}}>BACK</button>  

            <button type="button" className="button-logout" onClick={() => {Navigate('/admin')}}>LOGOUT</button>
            </div>
            
        </form>
        </div>

    )
}
export default ViewDriver;