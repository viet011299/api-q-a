/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
let key = "qa"
module.exports = {
    login: async function (req, res) {
        try {
            if (req.body.data.username && req.body.data.password) {
                const user = req.body.data;
                const dataAuth = await Auth.findOne({ username: user.username });
                if (dataAuth) {
                    const comparePassword = await bcrypt.compare(user.password, dataAuth.password);
                    if (comparePassword) {
                        const name = dataAuth.name;
                        const time = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                        await Auth.update({ id: dataAuth.id }, { onlineAt: new Date(), date: time });
                        const token = jwt.sign({ username: dataAuth.username, name: dataAuth.name, id: dataAuth.id }, key)
                        res.jsonp({
                            token,
                            time,
                            content: "Đăng nhập thành công",
                            success: true
                        });
                    } else {
                        res.jsonp(
                            {
                                content: "Sai mật khẩu",
                                success: false
                            }
                        )
                    }
                } else {
                    res.jsonp(
                        {
                            content: "Sai tài khoản",
                            success: false
                        }
                    )
                }
            } else {
                res.jsonp(
                    {
                        content: "Vui lòng nhập thông tin",
                        success: false
                    }
                )
            }
        } catch (err) {
            res.badRequest(
                err

            )
        }
    },
    registration: async function (req, res) {
        try {
            if (req.body.username &&
                req.body.password &&
                req.body.name &&
                req.body.email &&
                req.body.confirmpassword
            ) {
                const newUser = req.body;
                if (vaildate.checkUser(newUser.username)) {
                    const checkNameUser = await Auth.findOne({ username: newUser.username });
                    if (checkNameUser) {
                        res.jsonp({
                            content: "User name đã được sử dụng",
                            success: false
                        });
                    } else {
                        const checkEmail = await Auth.findOne({ email: newUser.email });
                        if (checkEmail) {
                            res.jsonp({
                                content: "Email đẫ được sử dụng",
                                success: false
                            })
                        } else {
                            if (vaildate.checkPassword(newUser.password)) {
                                if (vaildate.checkName(newUser.name)) {
                                    if (vaildate.checkEmail(newUser.email)) {
                                        if (newUser.confirmpassword == newUser.password) {
                                            await khoitao.khoitao();
                                            const hashPassword = await bcrypt.hash(newUser.password, 10);
                                            const user = await Auth.create({
                                                username: newUser.username,
                                                password: hashPassword,
                                                name: newUser.name,
                                                email: newUser.email,
                                                role: 2
                                            });
                                            res.send({
                                                content: "Đăng kí người dùng thành công",
                                                success: true
                                            });
                                        } else {
                                            res.jsonp({
                                                content: "Mật khẩu xác nhận chưa trùng nhau",
                                                success: false
                                            });
                                        }

                                    } else {
                                        res.jsonp({
                                            content: "Email chưa đúng định dạng. Vd: abc@abc.com.vn ",
                                            success: false
                                        });
                                    }
                                } else {
                                    res.jsonp({
                                        content: "Tên chưa hợp lệ",
                                        success: false
                                    });
                                }

                            } else {
                                res.jsonp({
                                    content: "Mật khẩu sai định dạng : Mật khẩu có độ dài từ 6 đến 16 ký tự có ít nhất 1 số và 1 chữ cái ",
                                    success: false
                                });
                            }
                        }

                    }
                } else {
                    res.jsonp({
                        content: "Tài khoản cần từ 6 tới 16 ký tự không có ký tự đặc biệt chỉ số và chữ",
                        success: false
                    });
                }
            } else {
                res.jsonp({
                    content: "Vui lòng nhập đủ thông tin",
                    success: false
                });
            }
        } catch (error) {
            res.badRequest(
                {
                    error

                }
            );
        }
    },
    getInfor: async function (req, res) {
        try {
            const idAuth = req.body.id;
            if (idAuth) {
                const dataAuth = await Auth.findOne({ id: idAuth });
                if (dataAuth) {
                    const queryA = `SELECT a.id,a.username,a.name,a.onlineAt,a.email,a.createdAt,a.date,
                    (SELECT r.name_role From role r WHERE a.role=r.id) role,
                    (SELECT COUNT(*) FROM section s WHERE s.auth_id=a.id) countS,
                    (SELECT COUNT(*) FROM question q WHERE q.auth_Id=a.id) countQ
                    FROM auth a 
                    where id=${idAuth}`

                    const queryQ = `SELECT q.*,a.name,
                    (SELECT count(*)FROM answer anw where anw.idQuestion=q.id) as countA FROM question q
                    inner join auth a on a.id=q.auth_Id
                    JOIN section s on s.id=q.section_id
                    where q.auth_id=${idAuth}`

                    const queryS = `SELECT a.name,t.topic,s.*,
                    (SELECT count(*) From question q where q.section_id=s.id ) as countQ FROM section s 
                    inner join auth a on s.auth_id=a.id 
                    inner join topic t on t.id = s.topic_id
                    where auth_id=${idAuth}
                    ORDER BY s.updatedAt DESC`

                    const querySur = `SELECT s.*,a.name,sec.title secTitle FROM survey s 
                    JOIN auth a on a.id=s.auth_id
                    JOIN section sec on sec.id=s.section_id
                    where s.auth_id = ${idAuth}
                    ORDER BY s.updatedAt DESC`

                    Auth.query(queryA, [''], function (err, A) {
                        if (err) {
                            res.badRequest(err)
                        } else {
                            Section.query(queryS, [''], function (err, listS) {
                                if (err) {
                                    return res.badRequest(err);
                                } else {
                                    Question.query(queryQ, [''], function (err, listQ) {
                                        if (err) {
                                            return res.badRequest(err);
                                        } else {
                                            Survey.query(querySur, [''], function (err, listSur) {
                                                res.jsonp({
                                                    A,
                                                    listS,
                                                    listQ,
                                                    listSur,
                                                    content: "Thành công",
                                                    success: true
                                                });
                                            })

                                        }

                                    });
                                }

                            });

                        }

                    })
                } else {
                    res.jsonp({
                        content: "Không có tài khoản cần tìm",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Không có id",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(
                error
            );
        }
    },
    myauth: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const queryA = `SELECT a.id,a.username,a.name,a.onlineAt,a.email,a.createdAt,a.date,
            (SELECT r.name_role From role r WHERE a.role=r.id) role,
            (SELECT COUNT(*) FROM section s WHERE s.auth_id=a.id) countS,
            (SELECT COUNT(*) FROM question q WHERE q.auth_Id=a.id) countQ
            FROM auth a 
            where id=${idAuth}`
            const queryQ = `SELECT q.*,a.name,
            (SELECT count(*)FROM answer anw where anw.idQuestion=q.id) as countA FROM question q
            inner join auth a on a.id=q.auth_Id
            JOIN section s on s.id=q.section_id
            where q.auth_id=${idAuth}`

            const queryS = `SELECT a.name,t.topic,s.*,
            (SELECT count(*) From question q where q.section_id=s.id ) as countQ FROM section s 
            inner join auth a on s.auth_id=a.id 
            inner join topic t on t.id = s.topic_id
            where auth_id=${idAuth}
            ORDER BY s.updatedAt DESC`

            const querySur = `SELECT s.*,a.name,sec.title secTitle FROM survey s 
                    JOIN auth a on a.id=s.auth_id
                    JOIN section sec on sec.id=s.section_id
                    where s.auth_id = ${idAuth}
                    ORDER BY s.updatedAt DESC`
            Auth.query(queryA, [''], function (err, A) {
                if (err) {
                    res.badRequest(err)
                } else {
                    Section.query(queryS, [''], function (err, listS) {
                        if (err) {
                            return res.badRequest(err);
                        } else {
                            Question.query(queryQ, [''], function (err, listQ) {
                                if (err) {
                                    return res.badRequest(err);
                                } else {
                                    Survey.query(querySur, [''], function (err, listSur) {
                                        res.jsonp({
                                            A,
                                            listS,
                                            listQ,
                                            listSur,
                                            content: "Thành công",
                                            success: true
                                        });
                                    })
                                }

                            });
                        }

                    });

                }

            })
        } catch (error) {
            res.badRequest(error)
        }
    },
    editpassword: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const idA = req.body.id;
            if (idA) {
                const editpasswordAuth = await Auth.findOne({ id: idA })
                if (editpasswordAuth) {
                    if (idA == idAuth) {
                        const { oldpassword, password, confirmpassword } = req.body
                        if (oldpassword && password && confirmpassword) {
                            const comparePassword = await bcrypt.compare(oldpassword, editpasswordAuth.password);
                            if (comparePassword) {
                                if (vaildate.checkPassword(password)) {
                                    if (password == confirmpassword) {
                                        const hashPassword = await bcrypt.hash(password, 10);
                                        await Auth.update({ id: idA }, { password: hashPassword })
                                        res.jsonp({
                                            content: "Thay đổi thành công",
                                            success: true
                                        })
                                    } else {
                                        res.jsonp({
                                            content: "Mật khẩu không trùng khớp với nhau",
                                            success: false
                                        })
                                    }
                                } else {
                                    res.jsonp({
                                        content: "Mật khẩu sai định dạng : Mật khẩu có độ dài từ 6 đến 16 ký tự có ít nhất 1 số và 1 chữ cái",
                                        success: false
                                    })
                                }
                            } else {
                                res.jsonp({
                                    content: "Nhập sai mật khẩu cũ",
                                    success: false
                                })
                            }
                        } else {
                            res.jsonp({
                                content: "Nhập đủ thông tin",
                                success: false
                            })
                        }
                    } else {
                        res.jsonp({
                            content: "Không có quyền sửa",
                            success: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có tài khoản cần sửa mật khẩu",
                        success: false
                    })

                }
            } else {
                res.jsonp({
                    content: "Không có id tài khoản càn sửa",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }

    },
    top5: async function (req, res) {
        try {
            const queryTop5Quest = `SELECT a.name,(SELECT COUNT(*) FROM question q WHERE q.auth_Id=a.id) COUNTQ FROM auth a
            ORDER BY COUNTQ DESC limit 5`
            const queryTop5Answer = `SELECT a.name,(SELECT COUNT(*) FROM answer anw WHERE anw.auth_Id=a.id) COUNTA FROM auth a
            ORDER BY COUNTA DESC limit 5`
            Question.query(queryTop5Quest, [''], function (err, listTop5Q) {
                Answer.query(queryTop5Answer, [''], function (err, listop5A) {
                    res.jsonp({
                        listTop5Q,
                        listop5A,
                        content: "thành công",
                        success: true
                    })
                })
            })
        } catch (error) {
            res.badRequest(error)
        }
    }
};

