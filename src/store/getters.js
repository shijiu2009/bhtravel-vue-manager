const getters = {
    getHeight (state) {
        return state.tableHeight - state.tagsHeight - 240
    },
  }
   
  export default getters