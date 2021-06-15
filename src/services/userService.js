function userService() {
    let loggedUser = window.localStorage.getItem('loggedUser');
    if(loggedUser != null){
        return loggedUser;
    }
    return null;
}

export default userService;