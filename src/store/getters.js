const getters = {
    getHeight (state) {
        return state.tableHeight - state.tagsHeight
    },
  }
   
  export default getters