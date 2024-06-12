import React, {useState, useEffect} from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function DeleteVehicles() {

    //const location = useLocation();
    const Navigate = useNavigate(); 
    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const [deletedVehicleDetails, setDeletedVehicleDetails] = useState([]);
    const rowLimit = deletedVehicleDetails.length;

    useEffect(() => {
      // Check if the user is logged in, if not, redirect to the login page
      if (!username) {
          Navigate('/admin');
      }
  }, [username, Navigate]);

    useEffect(() => {
      const fetchDeletedVehicleDetails = async () => {
          try {
              const response = await axios.post("http://localhost:8081/vehicles/vehicleDetails/deletedVehicles");
              console.log("Server Response:", response.data);
              if (response.data.loginStatus) {
                  setDeletedVehicleDetails(response.data.deletedVehicles || []);
              } else {
                  console.error("Failed to fetch vehicle data:", response.data.error);
              }
          } catch (error) {
              console.error("Error while fetching vehicle data:", error);
          }
      };

      fetchDeletedVehicleDetails();
  }, []);

    const undoDelete = async (deleteVehicle) => {
      try {
        if (!deleteVehicle || deleteVehicle.id === undefined) {
          console.error("Invalid deleteVehicle object or ID is missing.", deleteVehicle);
          return;
        }
    
        console.log("Undoing delete for vehicle:", deleteVehicle.id);
    
        const response = await axios.post("http://localhost:8081/vehicles/vehicleDetails/undoDelete", { id: deleteVehicle.id }, { headers: { 'Content-Type': 'application/json' }});
    
        console.log("Server response:", response.data);
    
        if (response.data.success) {
          setDeletedVehicleDetails((prevVehicles) =>
            prevVehicles.filter(vehicle => vehicle.id !== deleteVehicle.id)
          );
    
          Navigate('/vehicles/vehicleDetails', { replace: true });
        } else {
          console.error('Failed to delete the vehicle. Server response:', response.data);
        }
      } catch (error) {
        console.error("Error while undoing delete:", error);
      }
    };

    const confirmUndoDelete = (vehicle, event) => {
      event.preventDefault(); 
      const isConfirmed = window.confirm(`Are you sure you want to undo deletion for vehicle number: ${vehicle.vehicleno}?`);
      if (isConfirmed) {
        undoDelete(vehicle);
      }
    };

    if (!deletedVehicleDetails || deletedVehicleDetails.length === 0) {
      // Handle the case where there are no deleted vehicle details
      return (
        <form className="hidden-form">
          <div className="add-vehicle-form">
            <p>No deleted vehicle details available.</p>
            <button type="button" className="button-back" onClick={() => { Navigate("/vehicles/vehicleDetails"); }}>BACK</button>
          </div>
        </form>
      );
    }

    return(
    <form className="vehicle-form">
      <div className="form-inner">
        <h2>Deleted Vehicle Details</h2>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Vehicle Number</th>
                        <th>Vehicle Type</th>
                    </tr>
                </thead>
                <tbody>
                {deletedVehicleDetails.slice(0, rowLimit).map((vehicle, id) => (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{vehicle.vehicleno}</td>
                  <td>{vehicle.vehicletype}</td>
                  <td><button type="button" className="button-edit" onClick={(e) => confirmUndoDelete(vehicle, e)}>UNDO</button></td>
                </tr>
              ))}
            </tbody>
            </table>
            <button type="button" className="buttonBack" onClick={() => { Navigate("/vehicles/vehicleDetails", { state: { username } })}}>BACK</button>
            </div>
          </div>
    </form>
    )

}
export default DeleteVehicles;