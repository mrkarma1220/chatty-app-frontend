function authService() {
    let loggedUser = window.localStorage.getItem('loggedUser');
    return loggedUser
}
export default authService;