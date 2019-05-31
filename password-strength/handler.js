"use strict";
var {
  verifyPassword,
  strong
} = require('./constraints');

module.exports.password = async event => {
  try {
    const { password } = event.pathParameters;
    var veri = await verifyPassword(password);
    var {score} =await strong(password);
    console.log(score);
    
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Todo ok" + password,
          score
        })
      };
    
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error " + e.message,
        scoer:e.score
      })
    };
  }
};
