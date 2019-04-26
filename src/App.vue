<template>
  <div id="app">
    <ChatWindow/>
    <ChatBar/>
    <ActionBar/>
    <span v-if="room" @click="closeRoom"
      :style="{
        position: 'fixed',
        top: '1vh',
        right: '2vw',
        fontSize: '3vh',
      }"
    >X</span>
  </div>
</template>

<script>
import ChatWindow from '@/components/ChatWindow'
import ChatBar from '@/components/ChatBar'
import ActionBar from '@/components/ActionBar'

export default {
  name: 'app',
  components: {
    ChatWindow,
    ChatBar,
    ActionBar
  },

  data () {
    return {}
  },

  
  mounted () {
    window.onresize = this.handleResize
    const socket = new WebSocket('wss://9ruk5o8rc2.execute-api.us-east-1.amazonaws.com/test')
    socket.onmessage = this.handleMessage
    this.$store.commit('socket', socket)
  },

  methods: {
    handleResize () {
      this.$store.commit('orientation', window.innerHeight > window.innerWidth)
    },
    handleMessage (event) {
      const { action, reqid, result } = JSON.parse(event.data)
      if (action === 'createroom') this.createroom({ reqid, result })
      else if (action === 'joinroom') this.joinroom({ reqid })
      else if (action === 'sendmessage') this.sendmessage({ reqid, result })
    },
    createroom (data) {
      this.$store.commit('createroom', data)
    },
    joinroom (data) {
      this.$store.commit('joinroom', data)
    },
    sendmessage (data) {
      console.log('message received')
      this.$store.commit('sendmessage', data)
    },
    closeRoom () {
      this.$store.commit('closeRoom', this.room)
    }
  },

  computed: {
    room () {
      return this.$store.getters['room']
    }
  },
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  top:0;
  right:0;bottom:0;left:0;
  position: fixed;
}
</style>
