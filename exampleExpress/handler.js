"use strict";
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamonDB;

if(IS_OFFLINE === 'true'){
  dynamonDB = new AWS.DynamoDB.DocumentClient({
    region:'localhost',
    endpoint:'http://localhost:8000'
  });
}else{
  dynamonDB = new AWS.DynamoDB.DocumentClient();
}


// const dynamonDB = new AWS.DynamoDB.DocumentClient();

// app.use(bodyParser.json({string:false}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Hola mundo con express"
  });
});

app.post("/users", (req, res) => {
  const { userId, name } = req.body;

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId,
      name
    }
  };

  dynamonDB.put(params, error => {
    if (error) {
      return res.status(400).json({
        message: "no se ha podido gurdar el usuario"
      });
    }else{
      return res.json({
        message:'usuario guardado con exito',
        userId,
        name
      });
    }
  });
 
});

app.get("/users",async(req,res)=>{
  try {
    const params = {
      TableName: USERS_TABLE
    };
    var users = await findAllUsers(params);
    res.json(users);
  } catch (error) {
    res.status(400).json(error)
  }
})

app.get("/users/:userId",(req,res)=>{
  const params = {
    TableName : USERS_TABLE,
    Key:{
      userId:req.params.userId
    }
  }
  dynamonDB.get(params,(error,resultado)=>{
    if(error){
      console.log(error);
      return res.status(400).json({
        error:'no ha podido acceder a los usuarios'
      })
    }
    if(!resultado.Item){
      return res.status(404).json({
        error:'Usuario no encontrado'
      })
    }else{
      const { userId, name } = resultado.Item;
      return res.json({
        userId, name
      });

    }
  });
});


function findAllUsers(params){
  return new Promise((resolve,reject)=>{
    dynamonDB.scan(params,(error,result)=>{
      if(error){
        reject({
          message: "no se ha podido gurdar el usuario",
          error
        });
      }else{
        resolve({
          message:'usuario encontrado con exito',
          users:result
        });

      }

    })

  });
}

module.exports.generic = serverless(app);
