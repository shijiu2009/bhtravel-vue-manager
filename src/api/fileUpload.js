import api from './api.js'


function fileUpload(data) {
    return api.post('/api/manager/webuploader', data)
}

export default {
    fileUpload,
}