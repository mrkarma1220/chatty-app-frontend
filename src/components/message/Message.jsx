import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import './message.css'
import axios from 'axios'
import {format} from 'timeago.js'

function Message({own, data}) {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUser = async() => {
            try{
                await axios.get('http://localhost:2000/newUser/'+data.sender)
                .then((res) => {
                    setUser(res.data);
                })
            } catch(err) {
                console.log(err)
            }
        }
        getUser()
    },[])
    return (
        <div className={own ? 'message_container own' : 'message_container'}>
            <Avatar className='message_avatar' src={user ? user.photoURL : ''} />
            <div className="message__wrapper">
                <p className='message'>{data.text}</p>
                <small className='time'>{format(data.createdAt)} </small>
            </div>
        </div>
    )
}

export default Message
