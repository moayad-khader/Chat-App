const http=require('http');
const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');


const publicDirectory=path.join(__dirname,'../public');




const app=express();
const server=http.createServer(app);




app.use(bodyParser.json());
app.use(express.static(publicDirectory));






module.exports=server;