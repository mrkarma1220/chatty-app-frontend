import React, { useEffect, useState } from 'react'
import './chatOnline.css'
import Avatar from '@material-ui/core/Avatar'
import axios from 'axios'
function ChatOnline({email}) {
    const [online, setOnline] = useState(null)
    useEffect(() => {
        const getOnlineUsers = async() => {
            await axios.get('http://localhost:2000/newUser/'+email)
                .then((res) => {
                    setOnline(res.data)
                })
        }
        getOnlineUsers();
    })
    return (
        <div className='ChatOnline'>
            <div className="chatOnline_wrapper">
                <Avatar className='avatar' src={online?.photoURL} />
                <div className="online_name">
                    <p>{online?.name}</p>
                </div>
                <div className="online_badge"></div>
            </div>
        </div>
    )
}

export default ChatOnline
