/**
 * TopicController
 *
 * @description :: Server-side logic for managing topics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: async function (req, res) {
        try {
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const authCreate = await Auth.findOne({ id: idAuth })
            const { topic } = req.body
            if (authCreate == 1) {
                if (topic) {
                    if (vaildate.checkContent(topic)) {

                        await Topic.create({ topic: topic })
                        res.jsonp({
                            content: "Tạo thành công",
                            succses: true
                        })


                    } else {
                        res.jsonp({
                            content: "Xin nhập nội dung đúng",
                            succses: false
                        })
                    }

                } else {
                    res.jsonp({
                        content: "Không có nội dung chủ đề",
                        succses: false
                    })
                }
            } else {
                res.jsonp({
                    content: "Không có quyền tạo",
                    succses: false
                })
            }
        } catch (error) {
            res.badRequest(error)
        }
    },
    list: async function (req, res) {
        try {
            const listTopic = await Topic.find({})
            res.jsonp({
                content: "Thành công",
                succses: true,
                listTopic
            })
        } catch (error) {
            res.badRequest(error)
        }
    },
    edit: async function (req, res) {
        try {
            const idTopic = req.body.id
            const headers = req.headers['authorization'];
            const idAuth = await taikhoan.getId(headers);
            const authEdit = await Auth.findOne({ id: idAuth })
            if (authEdit.role == 1) {
                if (idTopic > 5) {
                    if (idTopic) {
                        const topicEdit = await Topic.findOne({ id: idTopic })
                        if (topicEdit) {
                            const topic = req.body.topic;
                            if (topic) {
                                if (vaildate.checkContent(topic)) {
                                    await Topic.update({ id: idTopic }, { topic: topic })
                                    res.jsonp({
                                        content: "Sửa thành công thành công",
                                        succses: true
                                    })


                                } else {
                                    res.jsonp({
                                        content: "Xin nhập nội dung đúng",
                                        succses: false
                                    })
                                }

                            } else {
                                res.jsonp({
                                    content: "Không có nội dung chủ đề",
                                    succses: false
                                })
                            }

                        } else {
                            res.jsonp({
                                content: "Không có chủ đề cần sửa",
                                succses: false
                            })
                        }
                    } else {
                        res.jsonp({
                            content: "Chưa có id topic",
                            succses: false
                        })
                    }
                } else {
                    res.jsonp({
                        content: "Không được sửa topic",
                        succses: false
                    })
                }

            } else {
                res.jsonp({
                    content: "Không có quyền sửa",
                    succses: false
                })
            }

        } catch (error) {
            res.badRequest(error)
        }
    },
};

