var bcrypt = require('bcrypt');
module.exports.khoitao = async function () {

    const authList = await Auth.find();
    const topicList = await Topic.find();
    const roleList = await Role.find()
    if (authList.length == 0) {
        const hashPassword = await bcrypt.hash('admin', 10);
        await Auth.create({ username: "admin", password: hashPassword, name: "admin", role: 1 });
    }
    if (topicList.length == 0) {
        await Topic.create({ topic: "Lịch học" })
        await Topic.create({ topic: "Giảng đường" })
        await Topic.create({ topic: "Giảng viên" })
        await Topic.create({ topic: "Cơ sở vật chất" })
        await Topic.create({ topic: "Môn học" })
    }
    if (roleList.length == 0) {
        await Role.create({ name_role: "Admin" })
        await Role.create({ name_role: "Người dùng" })
        await Role.create({ name_role: "Chủ tọa" })

    }

};