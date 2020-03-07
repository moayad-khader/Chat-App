const generateMessage=(text,username)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage=(link,username)=>{
    return{
        username,
        link,
        createdAt:new Date().getTime()
    }
}


module.exports={
    generateMessage,
    generateLocationMessage
}