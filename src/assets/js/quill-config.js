//  取消eslint规则
/* eslint-disable */
/* eslint-disable no-new */
/* eslint-disable no-alert, no-console */
// eslint-disable-next-line
import {
    MessageBox,
    Message
} from "element-ui"; // 引入
import fileUploadApi from "@/api/fileUpload.js";
import baseUrl from "@/config/baseUrl.js";
/*富文本编辑图片上传配置*/
const uploadConfig = {
    action: '', // 必填参数 图片上传地址
    methods: 'POST', // 必填参数 图片上传方式
    token: '', // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
    name: 'img', // 必填参数 文件的参数名
    size: 3*1024, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
    accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon' // 可选 可上传的图片格式
};

// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{
        'header': 1
    }, {
        'header': 2
    }],
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }],
    [{
        'direction': 'rtl'
    }],
    [{
        'size': ['small', false, 'large', 'huge']
    }],
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],
    [{
        'color': []
    }, {
        'background': []
    }],
    [{
        'font': []
    }],
    [{
        'align': []
    }],
    ['clean'],
    ['link', 'image', 'video']
];

const handlers = {
    image: function image() {
        var self = this;
        var fileInput = this.container.querySelector('input.ql-image[type=file]');
        if (fileInput === null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            // 设置图片参数名
            if (uploadConfig.name) {
                fileInput.setAttribute('name', uploadConfig.name);
            }
            // 可设置上传图片的格式
            fileInput.setAttribute('accept', uploadConfig.accept);
            fileInput.classList.add('ql-image');
            // 监听选择文件
            fileInput.addEventListener('change', function () {
                // 创建formData
                let fromdata = new FormData();
                let file = fileInput.files[0]
                // 图片上传
                fromdata.append("file", file);
                fromdata.append("filetype", "image");
                fromdata.append("type", file.type);
                fromdata.append("json", "1");
                fileUploadApi
                    .fileUpload(fromdata)
                    .then((result) => {
                        let length = self.quill.getSelection(true).index;
                        //设置显示图片
                        self.quill.insertEmbed(length, 'image', baseUrl.releaseUrl + result.filePath);
                        self.quill.setSelection(length + 1)
                        //回传给父组件的值
                        Message({
                            showClose: true,
                            message: "图片导入成功",
                            type: "success",
                        });
                    })
                    .catch(() => {
                        Message({
                            showClose: true,
                            message: "图片导入失败",
                            type: "error",
                        });
                    });
            });
            this.container.appendChild(fileInput);
        }
        fileInput.click();
    }
};

export default {
    placeholder: '',
    theme: 'snow', // 主题
    modules: {
        toolbar: {
            container: toolOptions, // 工具栏选项
            handlers: handlers // 事件重写
        },
        imageResize: {
            displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar']
        }
    }
};