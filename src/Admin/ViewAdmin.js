import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


function ViewAdmin(){

    const Navigate = useNavigate(); 
    const [admin, setAdmin] = useState([]);
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    
    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);
  
    useEffect(() => {
        axios.post('http://localhost:8081/admin/home/register/viewAdmin', {})
        .then(res => {
            if (res.data.success) {
                console.log("Sucessfully", res.data.admin);
                setAdmin(res.data.admin);
              } else {
                console.error("Failed to fetch Admin data:", res.data.error);
              }
        })
        .catch(err => {
            console.log(err);
        });                
    }, []);

    
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const deleteadmin = (deleteAdmin) => {
          axios.post('http://localhost:8081/admin/home/register/deleteAdmin', deleteAdmin)
          .then((res) => {
            console.log('Server response:', res.data);
            if (res.data.success) {
                console.log("Sucessfully Deleted", res.data.admin);
                setAdmin(res.data.admin);
              } else {
                console.error("Failed to delete Admin data:", res.data.error);
              }
          })
          .catch((error) => {
            console.log(error);
          })
      };
    
      const handleDeleteClick = (id) => {
        const deleteAdmin = { id };
        console.log('Deleting Admin:', deleteAdmin);
        const isConfirmed = window.confirm('Are you sure you want to delete this Admin?');
      
        if (isConfirmed) {
          deleteadmin(deleteAdmin);
        }
      };

  
    return(
        <div>
        <form className='admin-form' onSubmit={handleSubmit}>
            <div className='form-adminView'>
            <h2>Admin Details</h2>
            <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>NIC</th>
                        <th>Contact</th>
                        <th>Email Address</th>
                        <th>User Name</th>
                    </tr>
                </thead>
                <tbody>
                {admin.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{index + 1}</td>
                    <td>{admin.firstname}</td>
                    <td>{admin.lastname}</td>
                    <td>{admin.nic}</td>
                    <td>{admin.contact}</td>
                    <td>{admin.email}</td>
                    <td>{admin.username}</td>
                    <td>
                    <button type="button" className="button-delete" onClick={() => handleDeleteClick(admin.id, username)}>DELETE</button>
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
export default ViewAdmin;