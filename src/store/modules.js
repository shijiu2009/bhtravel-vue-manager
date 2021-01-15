export default {
    a: {
        namespaced: true,
        state: {
            avatar: ' 啊这是我的guang' /** 头像 */ ,
        },
        getters: {
            //操作state的参数
            name(state) {
                return "姓名:" + state.avatar
            },
            //操作getter的参数一级state的参数
            full(state, getters) {
                return getters.avatar + '年龄:' + state.avatar
            }
        },
        mutations: {
            edit(state) {
                console.log(state.avatar)
            }
        },
        actions: {
            aEdit({
                commit
            }, payload) {
                //异步方法
                setTimeout(() => {
                    commit('edit', payload)
                }, 2000)
            }

        },
    }
}