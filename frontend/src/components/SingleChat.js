import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderDetails } from '../config/ChatLogic'
import ProfileModal from './parts/ProfileModal'
import UpdateGroupChatModal from './parts/UpdateGroupChatModal'
import axios from 'axios'
import './styles.css'
import ScrollableChat from './ScrollableChat'

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    
    const [messages,setMessages]=useState([])
    const [loading,setLoading]=useState(false)
    const [newMessage,setNewMessage]=useState()
    const toast=useToast()
    const {user,selectedChat, setSelectedChat,chats}=ChatState()
    const selectedChatMatch=chats.find((c)=>{
        return c._id===selectedChat
    })

    const fetchMessages=async()=>{
        if(!selectedChat) return

        try{
            const config={
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data}=await axios.get(`/api/message/${selectedChatMatch._id}`,config)
            setMessages(data)
            console.log(messages)
            setLoading(false)
        }catch(error){
            toast({
                title:'Error Occured!',
                description:'Failed to Load the Messages',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }

    useEffect(()=>{
        fetchMessages()
    },[selectedChat])

    const sendMessage=async(event)=>{
        if(event.key==="Enter" && newMessage)
        {
            console.log(newMessage)
            try{
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                setNewMessage('')
                const {data}=await axios.post('/api/message',{
                    content: newMessage,
                    chatId: selectedChat,
                },config)
                console.log(data)
                setMessages([...messages,data])
                setFetchAgain(fetchAgain)
            }
            catch(error)
            {
                toast({
                    title: "Error Occured!",
                    description: 'Failed to send the message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                })
            }
        }
    }

    const typingHandler=(e)=>{
        setNewMessage(e.target.value)

        // Typing Indicator Logic
    }

  return (
    <>
        {selectedChat? (
            <>
                <Text fontSize={{base: "28px", md:"30px"}} pb={3} px={2} w={'100%'} fontFamily={'Work sans'} display={'flex'} justifyContent={{base: 'space-between'}} alignItems={'center'}>
                    <IconButton
                        d={{base: "flex", md: "none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={()=> setSelectedChat("")}
                    />
                    {!selectedChatMatch.isGroupChat?(
                        <>
                            {getSender(user,selectedChatMatch.users)} 
                            <ProfileModal user={getSenderDetails(user,selectedChatMatch.users)}/>
                        </>
                    ):(
                        <>
                            {selectedChatMatch.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                selectedChatMatch={selectedChatMatch}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )}
                </Text>
                <Box display={'flex'} flexDir={'column'} justifyContent={'flex-end'} p={3} bg={'#E8E8E8'} width={'100%'} height={'89%'} borderRadius={'lg'} overflowY={'hidden'}>
                    {loading?(<Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'}/>):
                    (
                        <div className='messages'>
                            <ScrollableChat/>
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input variant='filled' bg='#E0E0E0' placeholder='Enter message..' onChange={typingHandler} value={newMessage}/>
                    </FormControl>
                </Box>
            </>
        ):(
            <Box display="flex" alignItems={"center"} justifyContent={"center"} h="100%">
                <Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
                    Click on a user to start Chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat