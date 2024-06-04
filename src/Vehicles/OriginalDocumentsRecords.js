import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function AddDocumentForm({ isOpen, onClose, Id}) {

    const [vehicleno, setVehicle] = useState([])
    const [issuedDate, setIssuedDate] = useState(null);
    const formattedDate = issuedDate ? format(issuedDate, 'yyyy-MM-dd') : '';
    const [receivedDate, setReceivedDate] = useState(null);
    const formattedDate1 = receivedDate ? format(receivedDate, 'yyyy-MM-dd') : '';
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [otherVehicle, setOtherVehicle] = useState('');

    const [ documents, setDocuments] = useState({vehicleno: "", documentName:"", reason:"", issuedDate: formattedDate, issuedBy: "", issuedTo: "", receivedDate: formattedDate1});

    const handleVehicleChange = (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        // Clear the text field value if a different option is selected
        if (value !== 'other') {
          setOtherVehicle('');
        }
    };

    useEffect(() => {
        // Axios request to fetch data
        axios.post('http://localhost:8081/vehicles/vehicleDetails/dropdown')
        .then((response) => {
            if (response.data.success) {
                setVehicle(response.data.vehicleno);
            }
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (selectedVehicle === '' || (selectedVehicle === 'other' && otherVehicle.trim() === '')) {
            alert('Please select a vehicle number or enter the other vehicle number.');
            return; // Stop the form submission
        }

        // If "Other" is selected, use the value from the otherVehicle input
        const vehicleNumber = selectedVehicle === 'other' ? otherVehicle : selectedVehicle;


        const newDocument = {
          vehicleno: vehicleNumber,
          documentName: documents.documentName,
          reason:documents.reason,
          issuedDate:formattedDate,
          issuedBy: documents.issuedBy,
          issuedTo: documents.issuedTo,
          receivedDate: formattedDate1,
        };

      axios.post('http://localhost:8081/vehicles/vehicleSecurity/originalDocumentsSubmit', newDocument)
          .then(response => {
              if (response.data.success) {
                console.log('Documents Details uploaded successfully');
                  alert('Document Details Added Successfully');
                  // Handle any further actions after successful upload
                  reset();
              } else {
                console.error('Failed to add the Document:', response.data.message);
                  alert('Failed to add the Documents:', response.data.error);
              }
          })
          .catch(err => {
              console.error('Error Add Document Details:', err.message);
              alert('Failed to upload Documents Details. Please try again.'); 
          });
    };

    const handleInput = (name, value) => {
        setDocuments({ ...documents, [name]: value });

      }

    const reset =  () => {
        setSelectedVehicle('');
        setIssuedDate('');
        setReceivedDate('');
        setDocuments({vehicleno: "", documentName:"", reason:"", issuedDate: "", issuedBy: "", issuedTo: "", receivedDate: ""});
    }
  
    return (
        <form className="hidden-form" onSubmit={handleSubmit}>
        <div className={`add-Document-form ${isOpen ? 'open' : 'closed'}`}>
        <h2>Add Vehicle</h2>
        <fieldset className="fieldSet">
        <div className="journey-dropdown">
            <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number:</label>
                <select value={selectedVehicle} onChange={handleVehicleChange}>
                    <option value="">Choose Your Vehicle</option>
                    {vehicleno.length > 0 ? (
                        vehicleno.map(number => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))
                    ) : (
                    <option value="" disabled>
                        No Vehicle Numbers Available
                    </option>
                    )}
                    <option value="other">Other</option>
                </select>
                {selectedVehicle === 'other' && (
            <input type="text" value={otherVehicle} onChange={(event) => setOtherVehicle(event.target.value)} placeholder="Enter other vehicle number" />
            )}
        </div>
          <div className="label">
          <label>
           Document Name:
            <input
              type="text"
              value={documents.documentName}
                  onChange={(e) => handleInput('documentName', e.target.value)} required/>
          </label>
          </div>
          <div className="label">
          <label>
           Reason for Document Issue:
            <input
              type="text"
              value={documents.reason}
                  onChange={(e) => handleInput('reason', e.target.value)} required/>
          </label>
          </div>
          <div className="label">
              <label>
              Issued Date:
              <DatePicker selected={issuedDate}  onChange={date => setIssuedDate(date)} formatDate="MM/DD/YYYY" filterDate={date => date.getDate() !== 5} showYearDropdown scrollableMonthYearDropdown className="date" required/>
              </label>
            </div>
          <div className="label">
          <label>
            Issued By:
            <input
              type="text"
              value={documents.issuedBy}
                  onChange={(e) => handleInput('issuedBy', e.target.value)} required/>
          </label>
          </div>
          <div className="label">
          <label>
            Issued To:
            <input
              type="text"
              value={documents.issuedTo}
                  onChange={(e) => handleInput('issuedTo', e.target.value)} required/>
          </label>
          </div>
          <div className="label">
          <label>
              Received Date:
              <DatePicker selected={receivedDate}  onChange={date => setReceivedDate(date)} formatDate="MM/DD/YYYY" filterDate={date => date.getDate() !== 5} showYearDropdown scrollableMonthYearDropdown className="date"/>
          </label>
          </div>
          </fieldset>
          <button className="button-submit" type="submit">Add Issued Document</button>

          <button className="button-reset" onClick={reset}>RESET</button>
        
        <button className="button-close" onClick={onClose}>Close</button>
        </div>
        </form>
    );
}

function EditOriginalDocumentsRecords({ onClose, onSubmit, documentDetails }) {

    const [vehicleno, setVehicleNo] = useState('');
    const [documentName, setDocumentName] = useState('');
    const [reason, setReason] = useState('');
    const [issuedDate, setIssuedDate] = useState(null);
    // const formattedDate = updatedIssuedDate ? format(updatedIssuedDate, 'yyyy-MM-dd') : '';
    const [issuedBy, setIssuedBy] = useState('');
    const [issuedTo, setIssuedTo] = useState('');
    const [receivedDate, setReceivedDate] = useState(null);
    // const formattedDate = updatedReceivedDate ? format(updatedReceivedDate, 'yyyy-MM-dd') : '';
    const [errors, setErrors] = useState({});
    

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

        // Perform validation
        let validationErrors = {};

        if (!receivedDate) {
            validationErrors.receivedDate = "Received Date is required";
        }

        if (!vehicleno) {
            validationErrors.vehicleno = "Vehicle Number is required";
        }

        if (!documentName) {
            validationErrors.documentName = "Document is required";
        }
        if (!issuedDate) {
            validationErrors.issuedDate = "Issued Date is required";
        }

        // Perform any validation if needed
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (Object.keys(validationErrors).length === 0) {
            onSubmit({ vehicleno, documentName, issuedDate, receivedDate }); 
            onClose();
        }
    };

    useEffect(() => {
        if (documentDetails) {
            setVehicleNo(documentDetails.vehicleno);
            setDocumentName(documentDetails.documentName);
            setReason(documentDetails.reason);
            setIssuedDate(new Date(documentDetails.issuedDate));
            setIssuedBy(documentDetails.issuedBy);
            setIssuedTo(documentDetails.issuedTo);
            setReceivedDate(new Date(documentDetails.receivedDate));
        }
    }, [documentDetails]); 


    return (
        <form className="hidden-form" onSubmit={handleSubmit}>
            <div className='edit-Document-form'>
                <h2>Edit Document Details</h2>
                <fieldset className="fieldSet">
                    <div className="label">
                        <label>
                        Vehicle Number:
                        <input
                            type="text"
                            value={vehicleno}
                            onChange={(e) => setVehicleNo(e.target.value)} readOnly/>
                        </label>
                        {errors.vehicleno && <span className="text-danger">{errors.vehicleno}</span>}
                    </div>
                    <div className="label">
                        <label>
                        Document Name:
                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)} readOnly/>
                        </label>
                        {errors.documentName && <span className="text-danger">{errors.documentName}</span>}
                    </div>
                    <div className="label">
                        <label>
                            Reason:
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)} readOnly/>
                        </label>
                    </div>
                    <div className="label">
                        <label>
                            Issued Date:
                            <DatePicker selected={issuedDate}  onChange={date => setIssuedDate(date)} formatDate="MM/DD/YYYY" filterDate={date => date.getDate() !== 5} showYearDropdown scrollableMonthYearDropdown className="date" required/>
                        </label>
                        {errors.issuedDate && <span className="text-danger">{errors.issuedDate}</span>}
                    </div>
                    <div className="label">
                        <label>
                            Issued By:
                        <input
                            type="text"
                            value={issuedBy}
                            onChange={(e) => setIssuedBy(e.target.value)} readOnly/>
                        </label>
                    </div>
                    <div className="label">
                        <label>
                            Issued To:
                        <input
                            type="text"
                            value={issuedTo}
                            onChange={(e) => setIssuedTo(e.target.value)} readOnly/>
                        </label>
                    </div>
                    <div className="label">
                        <label>
                            Received Date:
                            <DatePicker selected={receivedDate}  onChange={date => setReceivedDate(date)} formatDate="MM/DD/YYYY" filterDate={date => date.getDate() !== 5} showYearDropdown scrollableMonthYearDropdown className="date" required/>
                        </label>
                        {errors.receivedDate && <span className="text-danger">{errors.receivedDate}</span>}
                    </div>
                </fieldset>
                <button className="button-submit" type="submit">Updated Document Records</button>
                
                <button className="button-cancel" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );

}

function OriginalDocumentsRecords() {


    const location = useLocation();
    const { username } = location.state || { username: undefined };
    const Navigate = useNavigate(); 
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [originals, setOriginals] = useState([]); 
    const [vehicleno, setVehicle] = useState([])
    const rowLimit = originals.length;
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isChangeDocumentOpen, setChangeDocumentOpen] = useState(false);
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'en-CA' uses the yyyy-mm-dd format
    };

    useEffect(() => {
        // Check if the user is logged in, if not, redirect to the login page
        if (!username) {
            Navigate('/admin');
        }
    }, [username, Navigate]);

    const handleVehicleChange = (event) => {
        const value = event.target.value;
        setSelectedVehicle(value);
        // Clear the text field value if a different option is selected
    };

    useEffect(() => {
        // Axios request to fetch data
        axios.post('http://localhost:8081/vehicles/vehicleDetails/dropdown')
        .then((response) => {
            if (response.data.success) {
                setVehicle(response.data.vehicleno);
            }
        })
        .catch(err => {
            console.log("Error Add DropDown Details", err);
        });
        axios.post('http://localhost:8081/vehicles/vehicleSecurity/originalDocumentsRecords', { vehicleno: selectedVehicle})
        .then(res => {
            console.log("Vehicle Records Response:", res.data);
            if (res.data.success) {
                console.log("Successfully", res.data.documents);
                setOriginals(res.data.documents);
            } else {
                console.error("Failed to fetch vehicle data:", res.data.error);
            }
        })
        .catch(err => {
            console.log(err);
        });
                   
    }, [selectedVehicle]);

    const openAddForm = (e) => {
        e.preventDefault();
        setIsAddFormOpen(true);
    };
    
    const closeAddForm = () => {
        setIsAddFormOpen(false);
    };

    const addDocument = (newDocument) => {
      setOriginals((prevDocuments) => [...prevDocuments, newDocument]);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
    };
    

    const handleEditOriginalDocumentsSubmit = ({ vehicleno, documentName, reason, issuedDate, issuedBy, issuedTo, receivedDate }) => {

        const formattedIssuedDate = issuedDate ? format(issuedDate, 'yyyy-MM-dd') : '';
        const formattedReceivedDate = receivedDate ? format(receivedDate, 'yyyy-MM-dd') : '';

        try {
            const response = axios.post('http://localhost:8081/vehicles/vehicleSecurity/editOriginalDocumentsRecords', {vehicleno, documentName, reason, 
            issuedDate: formattedIssuedDate, 
            issuedBy, issuedTo, 
            receivedDate: formattedReceivedDate
        });
            console.log(response.data);
            alert ('Document Details updated successfully')
            window.location.reload();
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
            <form className='security-form-records' onSubmit={handleSubmit}>
            <div className={`security-documents-form ${isAddFormOpen || isChangeDocumentOpen ? 'blur-background' : ''}`}>
                    <h2>Vehicle Security Details</h2>
                    <div className="journey-dropdown">
                    <label htmlFor="vehicleno" name="vehicleno" >Vehicle Number: </label>
                        <select value={selectedVehicle} onChange={handleVehicleChange}>
                        <option value="">Choose Your Vehicle</option>
                        {vehicleno.length > 0 &&(
                            vehicleno.map(number => (
                                <option key={number} value={number}>
                                    {number}
                                </option>
                            ))
                        )}
                        </select>
                    </div>
                <button className="add" onClick={openAddForm}>Add Issue Original Document</button>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Vehicle No</th>
                                    <th>Document Name</th>
                                    <th>Reason</th>
                                    <th>Issued Date</th>
                                    <th>Issued By</th>
                                    <th>Issued To</th>
                                    <th>Received Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {originals.slice(0, rowLimit).map((original, index) => (
                            <tr key={original.id ? original.id : index}>
                                <td>{index + 1}</td>
                                <td>{original.vehicleno}</td>
                                <td>{original.documentName}</td>
                                <td>{original.reason}</td>
                                <td>{formatDate(original.issuedDate)}</td>
                                <td>{original.issuedBy}</td>
                                <td>{original.issuedTo}</td>
                                <td>{formatDate(original.receivedDate)}</td>
                                <td>
                                <button className="button-edit" onClick={() => {setSelectedDocument(original);
                                                                            setChangeDocumentOpen(true);}}>EDIT</button>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <button className="button-back" onClick={() => {Navigate('/vehicles/vehicleSecurity', { state: { username } })}}>BACK</button>

                </div>
            </form>
            {isAddFormOpen && (
            <AddDocumentForm isOpen={isAddFormOpen} onClose={closeAddForm} addDocument={addDocument} />
            )}

            {isChangeDocumentOpen && selectedDocument && (
                <EditOriginalDocumentsRecords
                    documentDetails={selectedDocument} // Passing selected document as props
                    onClose={() => setChangeDocumentOpen(false)}
                    onSubmit={handleEditOriginalDocumentsSubmit}
                />
            )}
        </div>

    );

}
export default OriginalDocumentsRecords;