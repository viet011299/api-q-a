/**
 * SurveyController
 *
 * @description :: Server-side logic for managing surveys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');
var moment = require('moment');
module.exports = {
    create: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const section_id = req.body.id
            if (section_id) {
                const s = await Section.findOne({ id: section_id })
                if (s) {
                    if (s.auth_id == idAuth) {
                        if (s.open == true) {
                            const survey = req.body
                            if (survey.title && survey.description) {
                                if (vaildate.checkContent(survey.title) && vaildate.checkContent(survey.description)) {
                                    if (vaildate.checkSurvey(survey.content)) {
                                        const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                                        const newSurvey = await Survey.create({
                                            title: survey.title,
                                            description: survey.description,
                                            section_id: section_id,
                                            auth_id: idAuth,
                                            open: true,
                                            date: date
                                        })
                                        await Admin_sur.create({
                                            auth_Id: idAuth,
                                            survey_id: newSurvey.id,
                                            status: "Đã tạo",
                                            date: date
                                        })
                                        for (let q of survey.content) {
                                            const newQ = await Questionsurvey.create({
                                                survery_id: newSurvey.id,
                                                content: q.question,
                                                type: q.style
                                            })
                                            let a
                                            if (q.style == 1) {
                                                a = q.data[0].answer
                                                for (let anw of a) {
                                                    await Answersurvey.create({
                                                        question_id: newQ.id,
                                                        content: anw.content
                                                    })
                                                }
                                            } else if (q.style == 2) {
                                                a = q.data[0].answer1
                                                for (let anw of a) {
                                                    await Answersurvey.create({
                                                        question_id: newQ.id,
                                                        content: anw.content
                                                    })
                                                }
                                            }

                                        }
                                        res.jsonp({
                                            content: "Tạo thành công",
                                            newSurvey,
                                            success: true
                                        })
                                    } else {
                                        res.jsonp({
                                            content: "Nhập đủ và đúng nội dung câu hỏi và câu trả lời",
                                            success: false
                                        })
                                    }
                                } else {
                                    res.jsonp({
                                        content: "Nhập đúng nội dùng mô tả của khảo sát ",
                                        success: false
                                    })
                                }


                            } else {
                                res.jsonp({
                                    content: "Nhập đủ nội dùng mô tả của khảo sát ",
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
                            content: "Bạn không có quyền tạo cuộc khảo sát",
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
                    content: "Chưa có id",
                    success: false
                })
            }


        } catch (error) {
            res.badRequest(error)
        }

    },
    viewsurvey: async function (req, res) {
        try {
            const idSurvey = req.body.id;
            if (idSurvey) {
                const surveyView = await Survey.findOne({ id: idSurvey });
                if (surveyView) {
                    const listQ = [];
                    const list = await Questionsurvey.find({ survery_id: idSurvey })
                    for (let q of list) {
                        const listA = await Answersurvey.find({ question_id: q.id })
                        listQ.push({ q: q, a: listA })
                    }
                    res.jsonp({
                        surveyView, listQ
                        , content: "Thành công",
                        success: true
                    });
                } else {
                    res.jsonp({
                        content: "Không có survey",
                        success: false
                    })
                }

            } else {
                res.jsonp({
                    content: "Chưa có id của survey",
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
            const idSurvey = req.body.id;
            const authDelete = await Auth.findOne({ id: idAuth })
            if (idSurvey) {
                const deleteSur = await Survey.findOne({ id: idSurvey })
                if (deleteSur) {
                    if (deleteSur.auth_Id == idAuth || authDelete.role == 1) {
                        await Survey.destroy({ id: idSurvey })
                        const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                        await Admin_sur.create({
                            auth_Id: idAuth,
                            survey_id: idSurvey,
                            status: "Đã xóa",
                            date: date
                        })
                        res.jsonp({
                            content: "đã xóa thành công",
                            success: true
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có khảo sát cần xóa",
                        success: true
                    })
                }

            } else {
                res.jsonp({
                    content: "Không có id suvery",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }

    },
    open: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const idSurvey = req.body.id;
            const authopen = await Auth.findOne({ id: idAuth })
            if (idSurvey) {
                const openSurvey = await Survey.findOne({ id: idSurvey })
                if (openSurvey) {
                    if (openSurvey.auth_id == idAuth || authopen.role == 1) {
                        if (openSurvey.open == true) {
                            res.jsonp({
                                content: "Khảo đang mở",
                                success: false
                            })
                        } else {
                            await Survey.update({ id: idSurvey }, { open: true })
                            const querySur = `SELECT s.*,a.name authName,sec.title authName FROM survey s 
                            JOIN auth a on a.id=s.auth_id
                            JOIN section sec on sec.id=s.section_id`
                            Survey.query(querySur, [''], function (err, listSur) {
                                res.jsonp({
                                    listSur,
                                    content: "Mở cuộc khảo sát thành công",
                                    success: true
                                })
                            })

                        }
                    } else {
                        res.jsonp({
                            content: "Không có quyền mở khảo sát",
                            success: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có cuộc khảo sát cần mở",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Chưa có id cuộc khảo sát",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }
    },
    close: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const idSurvey = req.body.id;
            if (idSurvey) {
                const closeSurvey = await Survey.findOne({ id: idSurvey })
                if (closeSurvey) {
                    const authclose = await Auth.findOne({ id: idAuth })
                    if (closeSurvey.auth_id == idAuth || authclose.role == 1) {
                        if (closeSurvey.open == false) {
                            res.jsonp({
                                content: "Khảo sát đang đóng",
                                success: false
                            })
                        } else {
                            await Survey.update({ id: idSurvey }, { open: false })
                            const querySur = `SELECT s.*,a.name authName,sec.title authName FROM survey s 
                            JOIN auth a on a.id=s.auth_id
                            JOIN section sec on sec.id=s.section_id`
                            Survey.query(querySur, [''], function (err, listSur) {
                                res.jsonp({
                                    listSur,
                                    content: "Đóng cuộc khảo sát thành công",
                                    success: true
                                })
                            })
                        }
                    } else {
                        res.jsonp({
                            content: "Không có quyền đóng khảo sát",
                            success: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không có cuộc khảo sát cần đóng",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Không có id khảo sát cần đóng",
                    success: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }
    },
    doSurvey: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const listQ = req.body.listQ
            const idSurvey = req.body.id
            const doSurvey = await Survey.findOne({ id: idSurvey });
            if (doSurvey) {
                if (doSurvey.open == true) {
                    const checkdoSurvey = await AuthChooseSurvey.findOne({ survey_id: idSurvey, auth_id: idAuth })
                    if (checkdoSurvey) {
                        res.jsonp({
                            content: "Đã tham gia khảo sát",
                            success: false
                        })
                    } else {

                        await AuthChooseSurvey.create({
                            survey_id: idSurvey,
                            auth_id: idAuth
                        })
                        _.forEach(listQ, async function (value, index) {
                            if (_.get(Object.keys(value), 'length')) {
                                const q = await Questionsurvey.findOne({ id: Number(index) })
                                if (q.type == 2) {
                                    _.forEach(value, async function (t, a) {
                                        await AuthChooseAnswer.create({ auth_id: idAuth, answer_id: a })
                                    })
                                } else {
                                    await Answersurvey.create({ content: value, question_id: q.id })
                                }


                            } else {
                                await AuthChooseAnswer.create({ auth_id: idAuth, answer_id: value })
                            }
                        })
                        const listA = await AuthChooseAnswer.find();
                        const date = moment(Date.now()).format("HH:mm DD-MM-YYYY");
                        await Admin_sur.create({
                            auth_Id: idAuth,
                            survey_id: idSurvey,
                            status: "Đã tham gia khảo sát",
                            date: date
                        })
                        res.jsonp({
                            content: "Tham gia thành công",
                            listA,
                            success: true
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Khảo sát đã đóng",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Không có phiên cần làm",
                    success: false
                })
            }


        } catch (error) {
            res.badRequest(error)
        }
    },  
    statistics: async function (req, res) {
        try {
            const idSurvey = req.body.id;
            if (idSurvey) {
                const s = await Survey.findOne({ id: idSurvey })
                if (s) {
                    const listQ = await Questionsurvey.find({ survery_id: idSurvey })
                    let result = []
                    for (let q of listQ) {
                        const listA = await Answersurvey.find({ question_id: q.id })
                        let alist = []
                        for (let a of listA) {
                            const answerCount = await AuthChooseAnswer.find({ answer_id: a.id })
                            alist.push({ id: a.id, content: a.content, count: answerCount.length })
                        }
                        result.push({ q: q, alist })
                    }
                    res.jsonp({
                        result,
                        content: "Thành công",
                        success: true
                    })
                } else {
                    res.jsonp({
                        content: "Không có survey cần thông kê",
                        success: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Không có id survey",
                    success: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }
    }
};


