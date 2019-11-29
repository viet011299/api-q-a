var jwt = require('jsonwebtoken');
var key="qa";
module.exports =
    async function (req, res, next) { 
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            var token = bearerToken;
            jwt.verify(token,key, function (err) {
                if (err) {
                    // localStorage.clear();
                    res.badRequest("Vui lòng đăng nhập");
                } else {
                    next();
                }
            });
        } else {
            res.badRequest("Chưa đăng nhập");
        }
        // var LocalStorage = require('node-localstorage').LocalStorage;
        // var localStorage = new LocalStorage('./scratch');
        // const token = localStorage.getItem('token');
        // const checkToken = await Token.find({ token: token }).exec();
        // if (checkToken) {
        //     next();
        // } else {
        //     res.status(404).json({
        //         message: "Vui lòng đăng nhập"
        //     });
        // }
    }