import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'throwaway'
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    orientation: window.innerHeight > window.innerWidth,
    rooms: [],
    newroom: null,
    room: null,
    messages: {}
  },

  getters: {
    orientation: (state) => state.orientation,
    socket: (state) => state.socket,
    rooms: (state) => state.rooms,
    newroom: (state) => state.newroom,
    room: (state) => state.room,
    messages: (state) => state.messages[state.room]
  },

  mutations: {
    orientation: (state, orientation) => state.orientation = orientation,
    socket: (state, socket) => state.socket = socket,
    createroom: (state, { reqid, result }) => {
      state.newroom = [reqid, result]
      state.rooms = [...state.rooms, result]
    },
    joinroom: (state, { reqid }) => {
      state.rooms = [...state.rooms, reqid]
      state.room = reqid
    },
    openRoom: (state, room) => state.room = room,
    closeRoom: (state, room) => {
      const index = state.rooms.findIndex((val) => val === room)
      state.rooms.splice(index, 1)
      Vue.set(state, 'rooms', state.rooms)
      state.room = null
    },
    sendmessage: (state, { reqid, result }) => {
      console.log(reqid, result)
      console.log(state.messages)
      if (!state.messages[reqid]) Vue.set(state.messages, reqid, [result])
      else state.messages[reqid] = Vue.set(state.messages, reqid, [...state.messages[reqid], result])
    }
  },

  actions: {

  },

  plugins: [vuexLocal.plugin]
})
