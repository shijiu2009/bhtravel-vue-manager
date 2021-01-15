import Vue from 'vue'

let $this = Vue.prototype;
import api from '@/api/api.js'
import loading from '@/utils/loading.js' // 引入loading

//删除提示框数据
let openDeleteWarning = (path, data) => {
    return new Promise((resolve, reject) => {
        $this.$confirm("此操作将永久删除该数据么, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
            .then(() => {
                //在列表中删除数据
                loading.show();
                return api.post(path, data)
            })
            .then((result) => {
                loading.hide();
                if (result.status) {
                    //弹出提示
                    $this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                    resolve(result)
                } else {
                    $this.$message({
                        type: "error",
                        message: result.msg,
                    });
                    reject(result)
                }
            })
            .catch((err) => {
                if (err == "cancel") {
                    $this.$message('取消删除');
                }
                else {
                    $this.$message({
                        type: "error",
                        message: err.msg,
                    });
                }
                reject(err)
            });
    })
}

//根据传入的数组将对象里的id拼接成字符串
let idSplicing = (idList) => {
    return new Promise((resolve, reject) => {
        //判断是否有选中项
        if (idList.length <= 0) {
            $this.$message({
                type: "warning",
                message: "请选择删除项",
            });
            return;
        }
        //拼接ID
        let ids = "";
        idList.forEach((item) => {
            ids += item.id + ",";
        });
        ids = ids.slice(0, ids.length - 1);
        //批量删除
        if (ids) {
            resolve({
                ids: ids
            })
        } else {
            reject('');
        }
    })
}

//更新或编辑数据
let addOrEdit = (data) => {
    loading.show();
    return new Promise((resolve, reject) => {
        api.post(data.path, data.data)
            .then(result => {
                loading.hide();
                if (result.status) {
                    $this.$message.success("提交成功！");
                    resolve(result);
                } else {
                    if (data.data.id) {
                        $this.$message.error("数据更新失败");
                    } else {
                        $this.$message.error("数据添加失败");
                    }
                    reject(result);
                }
            }).catch((err) => {
                loading.hide();
                if (data.data.id) {
                    $this.$message.error("数据更新失败");
                } else {
                    $this.$message.error("数据添加失败");
                }
                reject(err);
            });
    })

}

export default {
    openDeleteWarning,
    idSplicing,
    addOrEdit,
}