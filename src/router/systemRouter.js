
//用户管理路由
import Users from "@/views/systemManager/users/user.vue"
import UserList from "@/views/systemManager/users/list.vue"
import AddOrEditUser from "@/views/systemManager/users/addOrEdit.vue"
import UserDetailed from "@/views/systemManager/users/detailed.vue"


let router = [ 
    // {
//     path: "/root",
//     name: "root",
//     component: "systemManager/purview/purview",
//     meta: {
//         title: "权限管理",
//         icon: "el-icon-s-home",
//     },
//     children: [{
//         path: "/rootList",
//         name: "rootList",
//         component: "systemManager/purview/list",
//         meta: {
//             title: "权限列表",
//             icon: "el-icon-s-home",
//             parentName: "权限管理",
//         }
//     }, {
//         path: "/addOrEditRoot",
//         name: "addOrEditRoot",
//         component: "systemManager/root/addOrEdit",
//         meta: {
//             title: "编辑权限",
//             icon: "el-icon-s-home",
//             parentName: "权限管理",
//             code: ["1001002", "1001003"]
//         }
//     }, ]
// }, 
{
    path: "/users",
    name: "users",
    component: Users,
    meta: {
        title: "用户管理",
        icon: "el-icon-s-home",
        code: ["1003000"]
    },
    children: [{
        path: "/userList",
        name: "userList",
        component: UserList,
        meta: {
            title: "用户列表",
            icon: "el-icon-s-home",
            parentName: "用户管理",
            code: ["1003001"]
        }
    }, {
        path: "/addOrEditUser",
        name: "addOrEditUser",
        component: AddOrEditUser,
        meta: {
            title: "编辑用户",
            icon: "el-icon-s-home",
            parentName: "用户管理",
            code: ["1003002", "1003003"]
        }
    }, {
        path: "/userDetailed",
        name: "userDetailed",
        component: UserDetailed,
        meta: {
            title: "用户信息",
            icon: "el-icon-s-home",
            parentName: "用户管理",
            show: false, //表示是否显示在菜单栏上，默认为true,填false则为不显示
        }
    }, ]
}]

export default router;