
//短信设置
import SmsInfo from "@/views/baseManager/smsInfo/smsInfo.vue"
import Setting from "@/views/baseManager/smsInfo/setting.vue"

//短信设置
import SmsRecord from "@/views/baseManager/smsRecord/smsRecord.vue"
import SmsRecordList from "@/views/baseManager/smsRecord/list.vue"

//基础信息设置
import BaseInformation from "@/views/baseManager/baseInformation/baseInformation.vue"
import BaseInformationSetting from "@/views/baseManager/baseInformation/baseInformationSetting.vue"

//联系方式设置
import Contact from "@/views/baseManager/contact/contact.vue"
import ContactSetting from "@/views/baseManager/contact/contactSetting.vue"

//备案信息设置
import RecordInformation from "@/views/baseManager/recordInformation/recordInformation.vue"
import RecordInformationSetting from "@/views/baseManager/recordInformation/recordInformationSetting.vue"

//二维码设置
import BitCode from "@/views/baseManager/bitCode/bitCode.vue"
import BitCodeSetting from "@/views/baseManager/bitCode/bitCodeSetting.vue"

//logo设置
import Logo from "@/views/baseManager/logo/logo.vue"
import LogoSetting from "@/views/baseManager/logo/logoSetting.vue"

let router = [{
        path: "/smsInfo",
        name: "smsInfo",
        component: SmsInfo,
        meta: {
            title: "短信管理",
            icon: "el-icon-s-home",
            code: ["3007000"]
        },
        children: [{
                path: "/setting",
                name: "setting",
                component: Setting,
                meta: {
                    title: "短信设置",
                    icon: "el-icon-s-home",
                    parentName: "短信管理",
                    code: ["3007001"]
                }
            },
        ]
    },{
        path: "/smsRecord",
        name: "smsRecord",
        component: SmsRecord,
        meta: {
            title: "短信记录管理",
            icon: "el-icon-s-home",
            code: ["3007000"]
        },
        children: [{
                path: "/smsRecordList",
                name: "smsRecordList",
                component: SmsRecordList,
                meta: {
                    title: "短信记录列表",
                    icon: "el-icon-s-home",
                    parentName: "短信管理",
                    code: ["3007011"]
                }
            },
        ]
    },{
        path: "/baseInformation",
        name: "baseInformation",
        component: BaseInformation,
        meta: {
            title: "基础信息管理",
            icon: "el-icon-s-home",
            code: ["3001000"]
        },
        children: [{
                path: "/baseInformationSetting",
                name: "baseInformationSetting",
                component: BaseInformationSetting,
                meta: {
                    title: "基础信息设置",
                    icon: "el-icon-s-home",
                    parentName: "基础信息管理",
                    code: ["3001001"]
                }
            },
        ]
    },{
        path: "/contact",
        name: "contact",
        component: Contact,
        meta: {
            title: "联系方式管理",
            icon: "el-icon-s-home",
            code: ["3002000"]
        },
        children: [{
                path: "/contactSetting",
                name: "contactSetting",
                component: ContactSetting,
                meta: {
                    title: "联系方式设置",
                    icon: "el-icon-s-home",
                    parentName: "联系方式管理",
                    code: ["3002001"]
                }
            },
        ]
    },{
        path: "/recordInformation",
        name: "recordInformation",
        component: RecordInformation,
        meta: {
            title: "备案信息管理",
            icon: "el-icon-s-home",
            code: ["3003000"]
        },
        children: [{
                path: "/recordInformationSetting",
                name: "recordInformationSetting",
                component: RecordInformationSetting,
                meta: {
                    title: "备案信息设置",
                    icon: "el-icon-s-home",
                    parentName: "备案信息管理",
                    code: ["3003001"]
                }
            },
        ]
    },{
        path: "/bitCode",
        name: "bitCode",
        component: BitCode,
        meta: {
            title: "二维码管理",
            icon: "el-icon-s-home",
            code: ["3004000"]
        },
        children: [{
                path: "/bitCodeSetting",
                name: "bitCodeSetting",
                component: BitCodeSetting,
                meta: {
                    title: "二维码设置",
                    icon: "el-icon-s-home",
                    parentName: "二维码管理",
                    code: ["3004001"]
                }
            },
        ]
    },{
        path: "/logo",
        name: "logo",
        component: Logo,
        meta: {
            title: "Logo管理",
            icon: "el-icon-s-home",
            code: ["3005000"]
        },
        children: [{
                path: "/logoSetting",
                name: "logoSetting",
                component: LogoSetting,
                meta: {
                    title: "Logo设置",
                    icon: "el-icon-s-home",
                    parentName: "Logo管理",
                    code: ["3005001"]
                }
            },
        ]
    }
]
export default router;