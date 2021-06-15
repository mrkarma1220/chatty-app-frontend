import React, { useContext, useEffect, useState } from 'react'
import { Avatar } from '@material-ui/core';
import './conversation.css'
import axios from 'axios'
import { UserContext } from '../../context/UserContext';


function Conversation({member}) {
    const {loggedUser} = useContext(UserContext);
    const [conUser, setConUser] = useState(null);
    var thisUser = [];
    useEffect(() => {
        thisUser = member.filter((mem) => mem!=loggedUser.email);
        const getUser = async() => {
            try{
                await axios.get('http://localhost:2000/newUser/'+thisUser[0])
                .then((res) => {
                    setConUser(res.data);
                })
            } catch(err) {
                console.log(err)
            }
        }
        getUser()
    },[])
    return (
        <div className='conversation'>
            <div className="conversation_wrapper">
                <Avatar className='avatar'src={conUser ? conUser.photoURL : ''}/>
                <div className="conversation_name">
                    <h5>{conUser ? conUser.name : thisUser[0]}</h5>
                </div>
            </div>
        </div>
    )
}

export default Conversation
