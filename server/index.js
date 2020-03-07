const server=require('./server');
require('./socket');


const port=process.env.PORT;

server.listen(port,()=>{
    console.log(`Server up on ${port}`);
});

