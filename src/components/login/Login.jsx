import React, { useContext, useEffect, useState } from 'react'
import logo from '../../assets/preview.jpg'
import './login.css'
import { UserContext } from '../../context/UserContext'
import { auth, provider } from '../../services/firebase'
import { useHistory } from 'react-router-dom'
import authService from '../../services/authService'
import axios from 'axios'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingBar from '../loader/LoadingBar'

function Login() {
    const {loggedUser, setLoggedUser} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    useEffect(() => {
        toast.configure();
        let authUser = authService();
        if(authUser != null) {
            history.push('/chattyApp')
        }
    },[])
    const login = () => {
        setLoading(true);
        setTimeout(() => {
            auth.signInWithPopup(provider)
            .then((res) => {
                let userData = {
                    email: res.user.email,
                    name: res.user.displayName,
                    photoURL: res.user.photoURL
                }
                axios.post('http://localhost:2000/newUser', userData)
                .then((res) => {
                    window.localStorage.setItem('loggedUser', JSON.stringify(res.data));
                    setLoggedUser(res.data)
                    history.push('/chattyApp')
                    toast.success('Logged in',{autoClose: 1300});
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false);
                    toast.error('Failed to login',{autoClose: 1300} )
                })
                
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            })
        },3000)
    }
    return (
        <div className='login'>
            {loading ? 
                 <LoadingBar />
                : 
                <div className='login_wrapper'>
                    <h1 className='app_name'> <span>C</span>hatty</h1>
                    <div className={loading ? 'button animate' : 'button'} onClick={login}>
                    <img className='googleLogo' src={logo} alt="" />
                    <div className="button_content">
                        <img className='googleLogo1' src={logo} alt="" />
                        <h4 className='loginText'>Login with Google</h4>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Login
