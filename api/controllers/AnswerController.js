/**
 * AnswerController
 *
 * @description :: Server-side logic for managing answers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require('moment');
module.exports = {
    create: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const idQuestion = req.body.id;
            if (idQuestion) {
                const { content } = req.body;
                const q = await Question.findOne({ id: idQuestion });
                const sec = await Section.findOne({ id: q.section_id });
                if (sec.open == true) {
                    if (content) {
                        if (vaildate.checkContent(content)) {
                            const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                            const createA = await Answer.create({ content: content, idQuestion: idQuestion, auth_Id: idAuth, date: date });
                            const a = await Answer.find({ idQuestion: idQuestion });
                            await Admin_anw.create({
                                auth_Id: idAuth,
                                anw_id: createA.id,
                                date: date,
                                cotent: createA.cotent,
                                status: "Đã tạo"
                            })
                            res.jsonp({
                                q,
                                a,
                                content: "Thêm thành công",
                                success: true
                            });
                        } else {
                            res.jsonp(
                                {
                                    content: "Nội dung câu trả lời nhập vào chưa hợp lệ",
                                    success: false
                                })
                        }

                    } else {
                        res.jsonp({
                            content: "Vui lòng nhập thông tin",
                            success: false
                        })

                    }
                } else {
                    res.jsonp({
                        content: "Phiên đã đóng",
                        success: false
                    })

                }


            } else {

                res.jsonp({
                    content: "Không có id câu hỏi",
                    success: false
                })

            }
        } catch (error) {
            res.badRequest(error)
        }


    },
    edit: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const idAnswer = req.body.id;
            if (idAnswer) {
                const answerEdit = await Answer.findOne({ id: idAnswer });
                if (answerEdit) {
                    if (answerEdit.auth_Id == idAuth) {
                        const { content } = req.body;
                        if (content) {
                            const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                            const updateA = await Answer.update({ id: idAnswer }, { content: content, date: date });
                            const a = await Answer.find({ id: idAnswer });
                            await Admin_anw.create({
                                auth_Id: idAuth,
                                anw_id: updateA.id,
                                date: date,
                                cotent: updateA.cotent,
                                status: "Đã sửa"
                            })
                            res.jsonp({
                                content: "Đã Sửa",
                                a,
                                success: true
                            });
                        } else {
                            res.jsonp({
                                content: "Vui lòng nhập nội dung câu trả lời",
                                success: false
                            })
                        }

                    } else {
                        res.jsonp({
                            content: "Bạn không có quyền sửa",
                            success: false
                        })
                    }

                } else {
                    res.jsonp({
                        content: "Không có câu hỏi cần sửa",
                        success: false
                    })
                }

            } else {
                res.jsonp({
                    content: "Chưa có id câu hỏi sửa",
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
            const idAnswer = req.body.id;
            if (idAnswer) {
                const answersDelete = await Answer.findOne({ id: idAnswer });
                if (answersDelete) {
                    const authDelete = await Auth.find({ id: idAuth })
                    if (answersDelete.auth_Id == idAuth || authDelete.role == 1) {
                        const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                        await Answer.destroy({ id: idAnswer });
                        await Admin_anw.create({
                            auth_Id: idAuth,
                            anw_id: idAnswer,
                            date: date,
                            status: "Đã xóa"
                        })
                        res.jsonp({
                            content: "Xóa câu trả lời thành công",
                            success: true
                        });
                    } else {
                        res.jsonp({
                            content: "Không có quyền xóa",
                            success: true
                        });
                    }

                } else {
                    res.jsonp({
                        content: "Không có trả lời cần xóa",
                        success: false
                    })
                }

            } else {
                res.jsonp({
                    content: "Không có id câu hỏi",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }

    }
};

