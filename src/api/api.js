import axios from '../config/httpConfig.js'


let api = {
    async get(url, data) {
        try {
            return await axios.get(url, data)
        } catch (err) {
            return err
        }
    },
    async post(url, data) {
        let info = {}
        if (data instanceof Array) {
            info = { ...data }
        }
        else {
            info = data
        }
        try {
            return await axios.post(url, info)
        } catch (err) {
            return err
        }
    }
}


export default api