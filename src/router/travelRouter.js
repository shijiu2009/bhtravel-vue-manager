//广告管理路由
import Advert from "@/views/travelManager/advert/advert.vue"
import AdvertList from "@/views/travelManager/advert/advertList.vue"
import AddAdvert from "@/views/travelManager/advert/addAdvert.vue"
import EditAdvert from "@/views/travelManager/advert/editAdvert.vue"
//广告位置
import AdvertSizeList from "@/views/travelManager/advert/advertSiteList.vue"
import AddAdvertSize from "@/views/travelManager/advert/addAdvertSite.vue"
import EditAdvertSize from "@/views/travelManager/advert/editAdvertSite.vue"

//活动
import Activity from "@/views/travelManager/activity/activity.vue"
import ActivityList from "@/views/travelManager/activity/list.vue"
import AddActivity from "@/views/travelManager/activity/add.vue"
import EditActivity from "@/views/travelManager/activity/edit.vue"

//用户评论
import Comment from "@/views/travelManager/userComment/userComment.vue"
import CommentList from "@/views/travelManager/userComment/list.vue"
import AddComment from "@/views/travelManager/userComment/add.vue"
import EditComment from "@/views/travelManager/userComment/edit.vue"

//文旅场所
import travelPlace from "@/views/travelManager/travelPlace/travelPlace.vue"
import travelPlaceList from "@/views/travelManager/travelPlace/list.vue"
import AddTravelPlace from "@/views/travelManager/travelPlace/add.vue"
import EditTravelPlace from "@/views/travelManager/travelPlace/edit.vue"

//测试
import Test from "@/views/travelManager/test/test.vue"
import ListTest from "@/views/travelManager/test/list.vue"
import AddTest from "@/views/travelManager/test/add.vue"
import EditTest from "@/views/travelManager/test/edit.vue"

let router = [{
        path: "/activity",
        name: "activity",
        component: Activity,
        meta: {
            title: "活动管理",
            icon: "el-icon-s-home",
            code: ["4003000"],
        },
        children: [{
            path: "/activityList",
            name: "activityList",
            component: ActivityList,
            meta: {
                title: "活动列表",
                icon: "el-icon-s-home",
                parentName: "活动管理",
                code: ["4003001"],
            }
        }, {
            path: "/addActivity",
            name: "addActivity",
            component: AddActivity,
            meta: {
                title: "添加活动",
                icon: "el-icon-s-home",
                parentName: "活动管理",
                code: ["4003002"]
            }
        }, {
            path: "/editActivity",
            name: "editActivity",
            component: EditActivity,
            meta: {
                title: "编辑活动",
                icon: "el-icon-s-home",
                parentName: "活动管理",
                code: ["4003003"],
                show: false,
            }
        }, ]
    },
    {
        path: "/advert",
        name: "advert",
        component: Advert,
        meta: {
            title: "广告管理",
            icon: "el-icon-s-home",
            code: ["4006000"]
        },
        children: [{
                path: "/advertList",
                name: "advertList",
                component: AdvertList,
                meta: {
                    title: "广告列表",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006011"]
                }
            },
            {
                path: "/addAdvert",
                name: "addAdvert",
                component: AddAdvert,
                meta: {
                    title: "添加广告",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006012"],
                }
            },
            {
                path: "/editAdvert",
                name: "editAdvert",
                component: EditAdvert,
                meta: {
                    title: "编辑广告",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006013"],
                    show: false,
                }
            },
            {
                path: "/advertSizeList",
                name: "advertSizeList",
                component: AdvertSizeList,
                meta: {
                    title: "广告位列表",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006001"]
                }
            },
            {
                path: "/addAdvertSite",
                name: "addAdvertSite",
                component: AddAdvertSize,
                meta: {
                    title: "添加广告位",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006002"]
                }
            },
            {
                path: "/editAdvertSite",
                name: "editAdvertSite",
                component: EditAdvertSize,
                meta: {
                    title: "编辑广告位",
                    icon: "el-icon-s-home",
                    parentName: "广告管理",
                    code: ["4006003"],
                    show: false,
                }
            }
        ]
    }, {
        path: "/comment",
        name: "comment",
        component: Comment,
        meta: {
            title: "用户评论管理",
            icon: "el-icon-s-home",
            code: ["4007000"]
        },
        children: [{
                path: "/commentList",
                name: "commentList",
                component: CommentList,
                meta: {
                    title: "用户评论列表",
                    icon: "el-icon-s-home",
                    parentName: "用户评论管理",
                    code: ["4007001"]
                }
            },
            {
                path: "/addComment",
                name: "addComment",
                component: AddComment,
                meta: {
                    title: "添加用户评论",
                    icon: "el-icon-s-home",
                    parentName: "用户评论管理",
                    code: ["4007002"]
                }
            },
            {
                path: "/editComment",
                name: "editComment",
                component: EditComment,
                meta: {
                    title: "编辑用户评论",
                    icon: "el-icon-s-home",
                    parentName: "用户评论管理",
                    code: ["4007003"],
                    show: false
                }
            }
        ]
    }, {
        path: "/test",
        name: "test",
        component: Test,
        meta: {
            title: "测试",
            icon: "",
            code: ["4007000", "4007001"]
        },
        children: [{
            path: "/listTest",
            name: "listTest",
            component: ListTest,
            meta: {
                title: "测试列表",
                icon: "",
                parentName: "测试",
                code: ["4007000", "4007001"]
            },
        },{
            path: "/addTest",
            name: "addTest",
            component: AddTest,
            meta: {
                title: "添加测试",
                icon: "",
                parentName: "测试",
                code: ["4007000", "4007001"],
                show:false
            },
        }, {
            path: "/editTest",
            name: "editTest",
            component: EditTest,
            meta: {
                title: "编辑测试",
                icon: "",
                parentName: "测试",
                code: ["4007000", "4007001"],
                show:false
            },
        }]
    }, {
        path: "/travelPlace",
        name: "travelPlace",
        component: travelPlace,
        meta: {
            title: "文旅场所管理",
            icon: "el-icon-s-home",
            code: ["4011000"]
        },
        children: [{
                path: "/travelPlaceList",
                name: "travelPlaceList",
                component: travelPlaceList,
                meta: {
                    title: "文旅场所列表",
                    icon: "el-icon-s-home",
                    parentName: "文旅场所管理",
                    code: ["4011001"]
                }
            },
            {
                path: "/addTravelPlace",
                name: "addTravelPlace",
                component: AddTravelPlace,
                meta: {
                    title: "添加文旅场所",
                    icon: "el-icon-s-home",
                    parentName: "文旅场所管理",
                    code: ["4011002"]
                }
            },
            {
                path: "/editTravelPlace",
                name: "editTravelPlace",
                component: EditTravelPlace,
                meta: {
                    title: "编辑文旅场所",
                    icon: "el-icon-s-home",
                    parentName: "文旅场所管理",
                    code: ["4011003"],
                    show: false
                }
            }
        ]
    }
]
export default router;