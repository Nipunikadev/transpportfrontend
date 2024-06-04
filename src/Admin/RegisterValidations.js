function RegisterValidations(admins,users, drivers){

    let errors = {}

    const validateNIC = (nic) => {
        const nicPattern = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        return nicPattern.test(nic);
    }

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    };

    const validateContact = (contact) => {
        const contactPattern = /^\d{10}$/;
        return contactPattern.test(contact);
    };

    const validateUsername = (username) => {
        const usernamePattern = /^[a-zA-Z0-9]{3,}$/;
        return usernamePattern.test(username);
    };

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordPattern.test(password);
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    const checkValidations = (data) => {
        if (data.nic && !validateNIC(data.nic)) {
            errors.nic = "Invalid NIC format";
        }
        if (data.email && !validateEmail(data.email)) {
            errors.email = "Invalid email format";
        }
        if (data.contact && !validateContact(data.contact)) {
            errors.contact = "Contact number should be 10 digits";
        }
        if (data.username && !validateUsername(data.username)) {
            errors.username = "Username should be alphanumeric and at least 3 characters long";
        }
        if (data.password && !validatePassword(data.password)) {
            errors.password = "Password should be at least 6 characters long and include uppercase, lowercase and digits";
        }
        if (data.password && data.confirmpassword && !validateConfirmPassword(data.password, data.confirmpassword)) {
            errors.confirmpassword = "Passwords do not match";
        }
    };

    if (admins.nic || admins.email || admins.username || admins.password || admins.confirmpassword) {
        checkValidations(admins);
    }

    if (users.email || users.username || users.password || users.confirmpassword) {
        checkValidations(users);
    }

    if (drivers.nic || drivers.email || drivers.username || drivers.password || drivers.confirmpassword) {
        checkValidations(drivers);
    }

    return errors;
};


export default RegisterValidations;