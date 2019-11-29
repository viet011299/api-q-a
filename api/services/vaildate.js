module.exports.checkUser = function (userName) {
    const regexUser = /^(?=.{6,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (userName.match(regexUser)) {
        return true;
    } else {
        return false;
    }
};
module.exports.checkPassword = function (passWord) {
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
    if (passWord.match(regexPassword)) {
        return true;
    } else {
        return false
    }
}
module.exports.checkName = function (name) {
    const regexName = "^[^-\s][a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
    if (name.match(regexName)) {
        return true;
    } else {
        return false;
    }
}

module.exports.checkContent = function (content) {
    const regexName = /^[^-\s]+.+$/;
    if (content.match(regexName)) {
        return true;
    } else {
        return false;
    }
}
module.exports.checkEmail = function (email) {
    const regexEmail = "^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$"
    if (email.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
}
module.exports.checkSurvey = function (q) {
    let kt = true;
    for (let question of q) {
        if (kt == true) {
            if (question.question && question.style) {
                console.log(question.question)
                if (vaildate.checkContent(question.question)) {
                    let a
                    if (question.style == 1) {
                        a = question.data[0].answer;
                        for (let anw of a) {
                            if (!anw.content) {
                                kt = false
                                break
                            } else {
                                if ((vaildate.checkContent(anw.content))) {

                                } else {
                                    kt = false
                                    break
                                }
                            }
                        }
                    } else if (question.style == 2) {
                        a = question.data[0].answer1;
                        for (let anw of a) {
                            if (!anw.content) {
                                kt = false
                                break
                            } else {
                                if ((vaildate.checkContent(anw.content))) {

                                } else {
                                    kt = false
                                    break
                                }
                            }
                        }
                    }
                } else {
                    kt = false
                }

            } else {
                kt = false
            }
        } else {
            break
        }
    }
    console.log(kt)
    return kt;
}