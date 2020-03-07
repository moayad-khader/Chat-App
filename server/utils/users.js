const users=[];


//add user ,removeUser,getUser,getUsersInRoom

//Add user method 
const adduser=({id,username,room})=>{

    //validate the data
    if(!username||!room){
        return{
            error:"username and room are required"
        }
    }

    //Clean data
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();


    //Check existing user
    const existingUser=users.find(user=>{
        return user.username===username && user.room===room;
    })

    if(existingUser){
        return {
            error:"a user with the same username is in the room"
        }
    }

    //Storing the user

    const user={
        id,
        username,
        room
    };

    users.push(user);


    return {user};

   


}



//Remove user method
const removeUser=(id)=>{

    const index=users.findIndex(user=>user.id===id);

    if(index!==-1){
        return users.splice(index,1)[0];
    }

}

//Getting a user
const getUser=(id)=>{

    return users.find((user)=>{
        return user.id===id;
    })

}

//Get user in a room

const getUsersInRoom=(room)=>{
    
    return users.filter(user=>user.room===room);

}


module.exports={
    adduser,
    removeUser,
    getUser,
    getUsersInRoom
}