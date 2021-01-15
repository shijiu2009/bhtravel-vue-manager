//  取消eslint规则
/* eslint-disable */
/* eslint-disable no-new */
/* eslint-disable no-alert, no-console */
// eslint-disable-next-line

//校验名称,不为空，且多大输入12个字符
function checkName(value) {
    let reg = /^.{0,12}$/
    return reg.test(value)
}

//校验是否是存正整数,符合返回true,不符合返回false
function checkNumber(value) {
    let reg = /^[0-9]+$/;
    return reg.test(value)
}

//phone电话号码校验,符合返回true,不符合返回false
function checkPhone(value) {
    var tel = /^0\d{2,3}-?\d{7,8}$/; //电话号码
    var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; //手机号码
    if (value.length == 11) { //手机号码
        return phone.test(value)
    } else if (value.length == 13 && value.indexOf("-") != -1) { //电话号码
        return tel.test(value);
    }
}

//邮箱校验,符合返回true,不符合返回false
function checkEmail(value) {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(value);
}

// 密码校验 6个字符以上，而包括数字和字母
function checkPassword(password) {
    let reg = /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/;
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,16}$/;
    return reg.test(password);
}

//只能输入数字和字母
function letterAndNumber(str) {
    let reg = /[^\w\.\/]/ig;
    return !reg.test(str);
}

function check(name, data) {
    let msg = "";
    //符合返回true,不符合返回false
    let isCheck = true
    switch (name) {
        case "text":
            if (!checkName(data)) {
                isCheck = false
                msg = "名称不能不为空，且最多只能输入12个字符"
            }
            break;
        case "number":
            if (!checkNumber(data)) {
                isCheck = false
                msg = "只能数值不符合数字规范"
            }
            break;
        case 'phone':
            if (!checkPhone(data)) {
                isCheck = false
                msg = "电话号码输入不符合规范"
            }
            break;
        case "email":
            if (!checkEmail(data)) {
                isCheck = false
                msg = "输入邮箱不符合规范"
            }
            break;
        default:
            if (!checkPassword(data)) {
                isCheck = false
                msg = "密码不符合规范，密码为6个字符以上，而包括数字和字母"
            }
    }
    return {
        msg: msg,
        isCheck: isCheck
    }
}

export default {
    checkNumber,
    checkPhone,
    checkEmail,
    checkPassword,
    check,
    letterAndNumber,
}