const form = document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const usersList=document.getElementById('users');

//get username and room from url
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix: true,

});
// console.log(username,room); 


const socket =io();

//join chatroom
socket.emit('joinRoom',{username,room});

//get users and room
socket.on('roomUsers',({room,users}) =>{
    ouputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on('message',message =>{
    console.log(message);
    outputMessage(message); 

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

//message submit

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    // const user=
    socket.emit('chatMessage',msg);

    e.target.elements.msg.value='';
    e.target.elements.msg.focus(); 
})

//outputMessage to dom
function outputMessage(message){
    const div =document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    // console.log(message);
    document.querySelector('.chat-messages').appendChild(div);
}

function ouputRoomName(room)
{
    roomName.innerText=room;
}

function outputUsers(users)
{
    usersList.innerHTML='';
    for(index=0;index<users.length;index++)
    usersList.innerHTML+=`<li>${users[index].username}</li>`;
    console.log(users.innerHTML);
}