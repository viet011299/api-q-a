var jwt = require('jsonwebtoken');
var key='qa'
module.exports.getId = async function (headers) {
    const bearer = headers.split(' ');
        const token= bearer[1];
        const decoded= await jwt.decode(token); 
        return decoded.id
}