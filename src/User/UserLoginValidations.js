const UserLoginValidations = (details) => {

    let error = {}

    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    const username_pattern = /^\S*$/


    console.log('username:' , details.username);
    console.log('password:' , details.password);
    if(details.password.length <6){
        error.password = "Password should be at least 6 characters long.";
    }
    else if(details.password === ""){
        error.password = "Password should not be empty";
    }else if(!password_pattern.test(details.password)){
        error.password = "Please enter a valid password.";
    }else{
        error.password = "";
    }

    if(details.username === ""){
        error.username = "Name should not be empty";
    }
    else if(!username_pattern.test(details.username)){
        error.username = "Please enter a valid username.";
    }else{
        error.username = "";
    }


    return error;
}

export default UserLoginValidations;