function RegisterValidations(admins,users, drivers){

    let error = {}

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    const username_Pattern = /^\S*$/

    if(admins){
        if(admins.email === ""){
            error.email = "Email should not empty"
        }
        else if(!email_pattern.test(admins.email)){
            error.email = "Email didn't match"
        }else{
            error.email = ""
        }


        if(admins.password === ""){
            error.password = "Password should not empty"
        }
        else if(!password_pattern.test(admins.password)){
            error.password = "Password didn't match"
        }if(admins.password.length <6){
            error.password = "Password should be at least 6 characters long.";
        }else{
            error.password = ""
        }

        if(admins.username === ""){
            error.username = "Name should not empty"
        }
        else if(!username_Pattern.test(admins.username)){
            error.username = "Please enter valid username.";
        }else{
            error.username = ""
        }
    
        if (!admins.confirmpassword) {
            error.confirmpassword = "Please enter your confirm password.";
        }

        if (typeof admins.password !== "undefined" && typeof admins.confirmpassword !== "undefined") {
            
            if (admins.password !== admins.confirmpassword) {
            error.confirmpassword = "Please Confirm Your Password again.";
            }
        }
    }else if(users){
        if(users.password === ""){
            error.password = "Password should not empty"
        }
        else if(!password_pattern.test(users.password)){
            error.password = "Password didn't match"
        }if(users.password.length <6){
            error.password = "Password should be at least 6 characters long.";
        }else{
            error.password = ""
        }

        if(users.username === ""){
            error.username = "Name should not empty"
        }
        else if(!username_Pattern.test(users.username)){
            error.username = "Please enter valid username.";
        }else{
            error.username = ""
        }
    
        if (!users.confirmpassword) {
            error.confirmpassword = "Please enter your confirm password.";
        }

        if (typeof users.password !== "undefined" && typeof users.confirmpassword !== "undefined") {
            
            if (users.password !== users.confirmpassword) {
            error.confirmpassword = "Please Confirm Your Password again.";
            }
        }
    } else if(drivers){
        if(drivers.password === ""){
            error.password = "Password should not empty"
        }
        else if(!password_pattern.test(drivers.password)){
            error.password = "Password didn't match"
        }if(admins.password.length <6){
            error.password = "Password should be at least 6 characters long.";
        }else{
            error.password = ""
        }

        if(drivers.username === ""){
            error.username = "Name should not empty"
        }
        else if(!username_Pattern.test(drivers.username)){
            error.username = "Please enter valid username.";
        }else{
            error.username = ""
        }
    
        if (!drivers.confirmpassword) {
            error.confirmpassword = "Please enter your confirm password.";
        }

        if (typeof drivers.password !== "undefined" && typeof drivers.confirmpassword !== "undefined") {
            
            if (drivers.password !== drivers.confirmpassword) {
            error.confirmpassword = "Please Confirm Your Password again.";
            }
        }
    }

    return error;
}

export default RegisterValidations;