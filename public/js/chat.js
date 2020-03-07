const socket=io();

//Elements 
const $messageForm=document.querySelector('#messenger');
const $messageFormInput=$messageForm.querySelector('input');
const $messageFormButton=$messageForm.querySelector('button');
const $sendLocationButton=document.querySelector('#send-location');
const $messages=document.querySelector('#messages');
const $sidebar=document.querySelector("#sidebar");

//Templates
const messageTemplates=document.querySelector('#message-template').innerHTML;
const locationTemplate=document.querySelector('#location-template').innerHTML;
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

//listeners

//message listener
socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplates,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

//location listener
socket.on('renderLocation',(url)=>{
    console.log(url);
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        link:url.link,
        createdAt:moment(url.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoscroll();
});

//rendering room data
socket.on('roomData',({room,users})=>{

    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    $sidebar.innerHTML=html;

})


$messageForm.addEventListener('submit',(event)=>{

    event.preventDefault()


    //disable
    $messageFormButton.setAttribute('disabled','disabled')


    
    const message=event.target.elements.message.value

    socket.emit('sendingMessage',message,(error)=>{
        
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('message has been sent')
    })



})

$sendLocationButton.addEventListener('click',(event)=>{
    
    event.preventDefault();

    $sendLocationButton.setAttribute('disabled','disabled');


    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((postion)=>{
        
        socket.emit('sendingLocation',postion.coords.latitude,postion.coords.longitude,(message)=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log(message)
        })
    })
    
})


socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/';
    }
});