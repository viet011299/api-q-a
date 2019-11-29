/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
var bcrypt = require('bcrypt');
module.exports = {
    getAll: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const auth = await Auth.findOne({ id: idAuth })
            if (auth) {
                if (auth.role == 1) {
                    const query = `SELECT a.id,a.username,a.name,a.onlineAt,a.email,a.createdAt,a.date,
                    (SELECT r.name_role From role r WHERE a.role=r.id) role,
                    (SELECT COUNT(*) FROM section s WHERE s.auth_id=a.id) countS,
                    (SELECT COUNT(*) FROM question q WHERE q.auth_Id=a.id) countQ
                    FROM auth a`
                    Auth.query(query, [''], function (err, listA) {
                        if (err) {
                            res.badRequest(err)
                        } else {
                            res.jsonp({
                                listA,
                                content: "Thành công",
                                success: true
                            })
                        }
                    })
                } else {
                    res.jsonp({
                        conntent: "Bạn không phải là admin",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    conntent: "Không có tài khoản",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }
    },
    changeRole: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const auth = await Auth.findOne({ id: idAuth })
            const id = req.body.id
            if (auth) {
                if (auth.role == 1) {
                    if (id) {
                        const authChange = await Auth.findOne({ id: id });
                        if (authChange) {
                            if (authChange.role == 1) {
                                res.jsonp({
                                    conntent: "Không được thay đổi quyền admin",
                                    success: false
                                })
                            } else {
                                if (authChange.role == 2) {
                                    await Auth.update({ id: id }, { role: 3 })
                                    res.jsonp({
                                        conntent: "Đã được thay đổi quyền từ chủ tọa thành người dùng",
                                        success: true
                                    })
                                } else {
                                    if (authChange.role == 3) {
                                        await Auth.update({ id: id }, { role: 2 })
                                        res.jsonp({
                                            conntent: "Đã được thay đổi quyền từ người dùng thành chủ tọa",
                                            success: true
                                        })
                                    }
                                }
                            }

                        } else {
                            res.jsonp({
                                conntent: "Chưa có id tài khoản cần thay đổi",
                                success: false
                            })
                        }

                    } else {
                        res.jsonp({
                            conntent: "Không có id người dùng cần thay đổi",
                            success: false
                        })
                    }

                } else {
                    res.jsonp({
                        conntent: "Không phải là admin",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    conntent: "Không có tài khoản",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }
    },
    create: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const auth = await Auth.findOne({ id: idAuth })
            if (auth.role == 1) {
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
                                                const hashPassword = await bcrypt.hash(newUser.password, 10);
                                                const user = await Auth.create({
                                                    username: newUser.username,
                                                    password: hashPassword,
                                                    name: newUser.name,
                                                    email: newUser.email,
                                                    role: 3
                                                });
                                                res.send({
                                                    content: "Tạo chủ tọa thành công",
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
            } else {
                res.jsonp({
                    conntent: "Không có quyền",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }

    },
    resetpassword: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const authreset = await Auth.findOne({ id: idAuth })
            const idA = req.body.id;
            if (idA) {
                const resetpasswordAuth = await Auth.findOne({ id: idA })
                if (resetpasswordAuth) {
                    if (authreset.role == 1) {
                        const password = resetpasswordAuth.username;
                        const hashPassword = await bcrypt.hash(password, 10);
                        await Auth.update({ id: idA }, { password: hashPassword })
                        res.jsonp({
                            content: "Đã reset mật khẩu",
                            success: true
                        })
                    } else {
                        res.jsonp({
                            content: "Bạn không phải admin",
                            success: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có tài khoản cần reset mật khẩu",
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
    history: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const auth = await Auth.findOne({ id: idAuth })
            if (auth.role == 1) {
                const historySec = await Admin_sec.find()
                const historyQ = await Admin_quest.find()
                const historyA = await Admin_anw.find()
                const historySur = await Admin_sur.find()
                res.jsonp({
                    content: "Thành công",
                    success: true,
                    historySec,
                    historyQ,
                    historyA,
                    historySur
                })
            } else {
                res.jsonp({
                    content: "Không phải admin",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }
    },
    listall: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const auth = await Auth.findOne({ id: idAuth })
            if (auth.role == 1) {
                const queryQ = `SELECT q.*,a.name,
                    (SELECT count(*)FROM answer anw where anw.idQuestion=q.id) as countA FROM question q
                    inner join auth a on a.id=q.auth_Id
                    JOIN section s on s.id=q.section_id
                    ORDER BY q.updatedAt DESC
                    `
                const queryS = `SELECT a.name,t.topic,s.*,
                    (SELECT count(*) From question q where q.section_id=s.id ) as countQ FROM section s 
                    inner join auth a on s.auth_id=a.id 
                    inner join topic t on t.id = s.topic_id
                    ORDER BY s.updatedAt DESC`

                const queryAnw = `SELECT * FROM answer anw 
                JOIN auth a on a.id=anw.auth_Id
                ORDER BY anw.updatedAt DESC`

                const querySur = `SELECT s.*,a.name authName,sec.title authName FROM survey s 
                JOIN auth a on a.id=s.auth_id
                JOIN section sec on sec.id=s.section_id`
                
                Section.query(queryS, [''], function (err, listS) {
                    if (err) {
                        return res.badRequest(err);
                    } else {
                        Question.query(queryQ, [''], function (err, listQ) {
                            if (err) {
                                return res.badRequest(err);
                            } else {
                                Answer.query(queryAnw, [''], async function (err, listAnw) {
                                    if (err) {
                                        return res.badRequest(err)
                                    } else {
                                        Survey.query(querySur,[''],function(err,listSur){
                                            res.jsonp({
                                                listS,
                                                listQ,
                                                listAnw,
                                                listSur,
                                                content: "Thành công",
                                                success: true
                                            });
                                        })
                                        
                                    }
                                })

                            }

                        });
                    }

                });
            } else {
                res.jsonp({
                    content: "Không phải admin",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(
                error
            )
        }
    },

};

