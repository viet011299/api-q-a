/**
 * QuestionController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');

module.exports = {

    list: async function (req, res) {
        try {
            const queryQ = `SELECT q.*,a.name authName,s.title secTitle
            ,(Select count(*) from answer anw where anw.idQuestion=q.id) countA
            FROM question q 
            JOIN section s on s.id=q.section_id 
            JOIN auth a on a.id=q.auth_Id`
            Question.query(queryQ, [''], function (err, listQ) {
                if (err) {
                    res.badRequest(err)
                } else {
                    res.jsonp({
                        listQ,
                        content: "Thành công",
                        success: true
                    })
                }
            })
        } catch (error) {
            res.badRequest(error)
        }
    },
    viewquestion: async function (req, res) {
        try {
            const idQuestion = req.body.id;
            if (idQuestion) {
                const q = await Question.findOne({ id: idQuestion });
                if (q) {
                    let queryQ = `
                            SELECT q.*,a.name FROM question q
                            inner join auth a on a.id=q.auth_Id
                            where q.id=${idQuestion}`;
                    Question.query(queryQ, [''], function (err, Q) {
                        if (err) {
                            return res.badRequest(err);
                        } else {
                            let queryA = `
                                    SELECT anw.*,a.name FROM answer anw
                                    inner join auth a on a.id=anw.auth_Id
                                    where anw.idQuestion=${idQuestion}
                                    `
                            Answer.query(queryA, [''], function (err, listA) {
                                if (err) {
                                    return res.badRequest(err);
                                } else {
                                    res.jsonp({
                                        Q,
                                        listA,
                                        content: "Thành công",
                                        success: true
                                    });
                                }

                            })

                        }
                    });
                    // const sec = await Section.findOne({ id: q.section_id })
                    // const a = await Answer.find({ idQuestion: idQuestion });
                    // res.jsonp({
                    //     sec,
                    //     q, a,
                    //     success: true
                    // });
                } else {
                    res.jsonp({
                        success: false,
                        content: "Không có câu hỏi"
                    })
                }

            } else {
                res.jsonp({
                    content: "Chưa có id",
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
            const id = await taikhoan.getId(headers);
            const sectionId = req.body.id;
            const { content } = req.body;
            if (sectionId) {
                const sec = await Section.findOne({ id: sectionId })
                if (sec) {
                    if (sec.open == true) {
                        if (content) {
                            if (vaildate.checkContent(content)) {
                                const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                                const createQ = await Question.create({ content: content, date: date, section_id: sectionId, count_like: 0, auth_Id: id });
                                await Admin_quest.create({
                                    auth_Id: id,
                                    quest_id: createQ.id,
                                    status: "Đã tạo",
                                    date: date,
                                    content: createQ.content
                                })
                                const listQ = await Question.find({ section_id: sectionId });
                                res.jsonp({
                                    listQ,
                                    sec,
                                    success: true,
                                    content: "Thêm câu hỏi thành công"
                                });
                            } else {
                                res.jsonp({
                                    content: "Nội dung nhập vào chưa hợp lệ",
                                    success: false
                                })
                            }
                        } else {
                            res.json({
                                content: "Vui lòng nhập đủ thông tin",
                                success: false
                            })
                        }
                    } else {
                        res.json({
                            content: "Phiên đã đóng",
                            success: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có phiên",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Chưa có id phiên",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(
                error

            )
        }
    },

    edit: async function (req, res) {
        try {
            const idQuestion = req.body.idQuestion;
            if (idQuestion) {
                const questionEdit = await Question.findOne({ id: idQuestion });
                if (questionEdit) {
                    const s = await Section.findOne({ id: questionEdit.section_id });
                    if (s.open == true) {
                        const headers = req.headers['authorization'];
                        const idAuth = await taikhoan.getId(headers);
                        if (questionEdit.auth_Id == idAuth) {
                            const content = req.body.content;
                            if (content) {
                                if (vaildate.checkContent(content)) {
                                    const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                                    const updateQ = await Question.update({ id: idQuestion }, { content: content, date: date })
                                    await Admin_quest.create({
                                        auth_Id: idAuth,
                                        quest_id: updateQ.id,
                                        status: "Đã Sửa",
                                        date: date,
                                        content: updateQ.content
                                    })
                                    const q = await Question.find({ id: idQuestion })
                                    res.jsonp({
                                        q,
                                        success: true
                                    });
                                } else {
                                    res.jsonp({
                                        content: "Nội dung nhập vào chưa hợp lệ"
                                        , success: false
                                    })
                                }

                            } else {
                                res.jsonp({
                                    content: "Vui lòng nhập đủ hông tin",
                                    success: false
                                })
                            }
                        } else {
                            res.jsonp({
                                content: "Không có quyền sửa",
                                success: false
                            });
                        }
                    } else {
                        res.json({
                            content: "Phiên đã đóng",
                            success: false
                        })
                    }

                } else {
                    res.json({
                        content: "Không có câu hỏi cần sửa",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Chưa có id",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }

    },
    delete: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const authDelete = await Auth.findOne({ id: idAuth })
            const { id } = req.body;
            if (id) {
                const questionDelete = await Question.findOne({ id: id });
                if (questionDelete) {
                    if (questionDelete.auth_Id == idAuth || authDelete.role == 1) {

                        await Question.destroy({ id: id });
                        const answerDelete = await Answer.find({ idQuestion: id });
                        if (answerDelete) {
                            await Answer.destroy({ idQuestion: id });
                        }

                        const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                        await Admin_quest.create({
                            auth_Id: id,
                            quest_id: id,
                            status: "Đã Xoá",
                            date: date,

                        })
                        res.jsonp(
                            {
                                content: "Xóa thành công",
                                success: true
                            }
                        )
                    } else {

                        res.jsonp({
                            content: "Không có quyên xóa",
                            success: false
                        })
                    }
                }
                else {
                    res.jsonp({
                        content: "Không có câu hỏi cần xóa",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Chưa có id",
                    success: false
                });
            }

        } catch (error) {
            res.badRequest(
                error
            )
        }


    },
    // like: async function (req, res) {
    //     const { id } = req.params;
    //     const q = await Question.findOne({ id: id })
    //     const like = q.count_like + 1;
    //     console.log(like);
    //     await Question.update({ id: id }, { count_like: like });
    //     res.jsonp(q);
    // }
};

