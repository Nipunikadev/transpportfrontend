import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Start from './Start';
import AdminLogin from './Admin/AdminLogin';
import AdminHome from './Admin/AdminHome';
import Register from './Admin/Register';
import UpdateDriver from './Admin/UpdateDriver';
import HistoryRecords from './Records/HistoryRecords';
import DriverLogin from './Driver/DriverLogin';
import Dashboard from './Driver/Dashboard';
import Attendance from './Driver/Attendance';
import Journey from './Driver/Journey';
import DriverHistory from './Driver/ViewMyHistory';
import VehicleDetails from './Vehicles/VehicleDetails';
import ViewVehicles from './Vehicles/ViewVehicles';
import EditVehicles from './Vehicles/EditVehicles';
import VehicleSecurity from './Vehicles/VehicleSecurity';
import OriginalDocumentsRecords from './Vehicles/OriginalDocumentsRecords';
import FollowUpDetails from './Vehicles/FollowUpDetails';
import FuelRecords from './Records/FuelRecords';
import VehicleRecords from './Records/VehicleRecords';
import TripRecords from './Records/TripRecords';
import AttendanceRecords from './Records/AttendanceRecords';
import DeletedVehicles from './Vehicles/DeletedVehicles';
import FuelUsage from './Vehicles/FuelUsage';
import VehicleMaintenance from './Vehicles/VehicleMaintenance';
import UserLogin from './User/UserLogin';
import UserHome from './User/UserHome';


function App() {
  

  return (
    <section className='bg'>
    <BrowserRouter>
     <Routes>
     <Route path='/' element={<Start />}></Route>
      <Route path='/admin' element={<AdminLogin />}></Route>
      <Route path='/admin/home/*' element={<AdminHome/>}> </Route>
      <Route path='/admin/home/register' element={<Register/>}> </Route>
      <Route path='/admin/home/register/driver' element={<Register/>}> </Route>
      <Route path='/admin/home/register/user' element={<Register/>}> </Route>
      <Route path='/admin/home/register/driver/updateDriver' element={<UpdateDriver/>}> </Route>
      <Route path='/driver' element={<DriverLogin/>}></Route>
      <Route path='/driver/dashboard' element={<Dashboard/>}> </Route>
      <Route path='/driver/dashboard/attendance' element={<Attendance/>}></Route>
      <Route path='/driver/dashboard/journey' element={<Journey/>}> </Route>
      <Route path='/driver/dashboard/history' element={<DriverHistory/>}></Route>
      <Route path='/vehicles/vehicleDetails' element={<VehicleDetails/>}></Route>
      <Route path='/vehicles/vehicleDetails/viewVehicles' element={<ViewVehicles/>}></Route>
      <Route path='/vehicles/vehicleDetails/editVehicles' element={<EditVehicles/>}></Route>
      <Route path='/vehicles/vehicleDetails/deletedVehicles' element={<DeletedVehicles/>}></Route>
      <Route path='/vehicles/vehicleSecurity' element={<VehicleSecurity/>}></Route>
      <Route path='/vehicles/vehicleSecurity/originalDocumentsRecords' element={<OriginalDocumentsRecords/>}></Route>
      <Route path='/vehicles/followupDetails' element={<FollowUpDetails/>}></Route>
      <Route path='/vehicles/historyDetails/fuelUsage' element={<FuelUsage/>}></Route>
      <Route path='/vehicles/historyDetails/vehicleMaintenance' element={<VehicleMaintenance/>}></Route>
      <Route path='/records/historyRecords' element={<HistoryRecords/>}></Route>
      <Route path='/records/fuelRecords' element={<FuelRecords/>}></Route>
      <Route path='/records/vehicleRecords' element={<VehicleRecords/>}></Route>
      <Route path='/records/tripRecords' element={<TripRecords/>}></Route>
      <Route path='/records/attendanceRecords' element={<AttendanceRecords/>}></Route>
      <Route path='/user' element={<UserLogin/>}></Route>
      <Route path='/user/home' element={<UserHome/>}> </Route>
     </Routes>
    </BrowserRouter> 
    </section>
  );
}

export default App;
