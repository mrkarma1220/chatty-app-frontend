import React, { useContext, useEffect, useRef, useState } from 'react'
import './Messenger.css'
import SearchOutlined from '@material-ui/icons/SearchOutlined'
import Conversation from '../conversation/Conversation'
import Message from '../message/Message'
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton'
import ChatOnline from '../chatOnline/ChatOnline'
import { UserContext } from '../../context/UserContext'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import LoadingBar from '../loader/LoadingBar'
import {io} from 'socket.io-client'

function Messenger() {
    const {loggedUser, setLoggedUser} = useContext(UserContext)
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();
    const socket = useRef()
    const [onlineUsers, setOnlineUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState(null)

    useEffect(() => {
        socket.current = io("ws://localhost:8080");
        socket.current.on('getMessage', data => {
            setSocketMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    },[])

    useEffect(() => {
        socketMessage && currentChat?.members.includes(socketMessage.sender) && 
        setMessages(prev => [...prev, socketMessage])
    },[socketMessage, currentChat])

    useEffect(() => {
        socket.current.emit('addUser', loggedUser.email);
        socket.current.on('getUsers', users => {
            setOnlineUser(users);
        })
    },[loggedUser])

    // getting users conversation list
    useEffect(() => {
        const getConversation = async () => {
            try{
                const result = await axios.get("http://localhost:2000/conversation/"+loggedUser.email)
                setConversations(result.data);
            } catch(err) {
                console.log(err)
            }
        }
        getConversation();
        toast.configure();
        if(loggedUser == null) {
            history.push('/login')
        }
    },[])

    // getting messages of the selected member
    useEffect(() => {
        // console.log(currentChat._id);
        const getMessages = async () => {
            if(currentChat != null) {
                setLoading(true);
                await axios.get('http://localhost:2000/message/'+currentChat._id)
                .then((res) => {
                    setMessages(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false)
                })
            }
        }
        getMessages();
    },[currentChat])

    // scrolling to the last chat dynamically
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth" })
    }, [messages])

    // sending new message
    const sendNewMessage = async () => {
        if(newMessage != '') {
            let newMess = {
                conversationId: currentChat._id,
                sender: loggedUser.email,
                text: newMessage
            }

            const receiverId = currentChat.members.find(member => member != loggedUser.email);
            socket.current.emit("sendMessage", {
                senderId: loggedUser.email,
                receiverId: receiverId,
                text: newMessage
            })
            setNewMessage('')
            await axios.post('http://localhost:2000/message',newMess)
            .then((res) => {
                setMessages([...messages, res.data]);
                console.log(res.data);
            })
            .catch((err) => console.log(err))
        }
    }

    // signout
    const signOut = () => {
        setLoading(true);
        setTimeout(() => {
            window.localStorage.clear();
            setLoading(false);
            history.push('/login')
            toast.success('Logged out!!!',{autoClose: 1300})
        },3000)
    }
    return (
        <div className='messenger'>
            <div className={loading ? 'loading' : ''} ></div>
            <div className="messenger_wrapper">
                <div className="message_members">
                    <div className="members_wrapper">
                        <div className="input_wrapper">
                            <input type="text" placeholder='Search for a member' className='search_member' />
                            <SearchOutlined className='search_icon'/>
                        </div>
                        <h3><span>C</span>hats</h3>
                        {conversations.map((conversation) => {
                            // if(conversation.members[1] != loggedUser.email){
                                return(
                                    <div key={conversation._id} className='tabs' onClick={() => setCurrentChat(conversation)}>
                                        <Conversation member={conversation.members} />
                                    </div>
                                )
                            // }
                        })}
                    </div>
                </div>
                <div className="message_window">
                    {currentChat ? 
                        <div className="messages_wrapper">
                        <div className="message_top" id='message_top'>
                            {messages.length == 0 ? 
                                <div className="no_message">
                                    <h3 className='no_new_message'>No new messages 😲</h3>
                                    <LoadingBar />
                                </div>
                                :
                                messages.map(message => (
                                    <div ref={scrollRef} key={message._id}>
                                        <Message data={message} own={message.sender == loggedUser.email ? true : false} />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="message_bottom">
                            <div className="message_input">
                                <input type="text" value={newMessage} onKeyUp={(e) => {if(e.key === 'Enter') sendNewMessage()}} onChange={(e) => setNewMessage(e.target.value)} className="text_input" placeholder='Write something' />
                                <IconButton onClick={sendNewMessage}>
                                    <SendIcon className="sendIcon" />
                                </IconButton>
                            </div>
                        </div>
                    </div> 
                    : 
                    <div className="no_chat">
                        <div className="no_chat_wrapper">
                            <h1>Open a chat to <span>C</span>hatty... 🚀 </h1> 
                            <LoadingBar bar={true} />
                        </div>
                    </div>
                    }
                </div>
                <div className="online_details">
                    {onlineUsers.map(onlineUser => (
                        <ChatOnline key={onlineUser.socketId} email={onlineUser.userEmail} />
                    ))}
                    <Button onClick={signOut} variant='contained' color='secondary' className='signOut_btn'>
                        SIGN OUT
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Messenger
