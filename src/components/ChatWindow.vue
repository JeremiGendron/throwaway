<template>
  <div id="chat-window" :style="style">
    <div id="chat-header" :style="headerStyle" v-if="room">
      <avatar 
        :seed="room"
        :epsilon="0.1"
        :max-divisions="36"
        :style="{
          width: '7vh',
          height: '7vh',
          margin: '1vh'
        }"
      />
      <span
        class="selector"
        :style="{
          fontSize: '2vh',
          borderBottom: '1px solid #2c3e50',
          lineHeight: '1.15'
        }"
        @click="copy(room)"
      >
        {{room}}
      </span>
    </div>
    <div v-else
      :style="{
        height: '10vh',
        width: '42.5vw',
        display: 'flex',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >

    </div>
    <div id="chat-messages"
      :style="messagesStyle"
    >
      <div class="chat-message"
        v-for="(message, index) in messages"
        :key="index"
      >

      </div>
    </div>
    <div id="chat-input"
      :style="inputStyle"
    >
      <textarea
        :style="{
          width: '90%',
          height: '100%',
          border: 'none',
          padding: 0,
          resize: 'none'
        }"
        placeholder="..."
        v-model="textarea"
      ></textarea>
      <div id="chat-submit"
        :style="{
          width: '10%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EEEEEEEE'
        }"
        @click="submit"
      >
        <span
          :style="{
            fontSize: '3vh',
            cursor: 'pointer'
          }"
        >></span>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from 'vue-random-avatar'

export default {
  name: 'ChatWindow',

  components: {
    avatar
  },

  data () {
    return {
      textarea: '',
      baseStyle: {
        backgroundColor: "#DDDDDDEE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "absolute",
      },
      headerStyle: {
        height: '10vh',
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderBottom: '1px solid black',
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center'
      },
      messagesStyle: {
        height: '80vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
      },
      inputStyle: {
        height: '10vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
  },

  methods: {
    submit () {
      this.socket.send(JSON.stringify({
        room: this.room,
        message: this.textarea.length > 282 ? this.textarea.substr(0, 282) : this.textarea
      }))
      this.textarea = ''
    },
    copy (room) {
      this.$copyText(room).then((e) => {
        alert('Copied.')
      })
    }
  },

  created () {},

  mounted () {
  },

  computed: {
    orientation () {
      return this.$store.getters['orientation']
    },

    room () {
      return this.$store.getters['room']
    },

    messages () {
      return this.$store.getters['messages']
    },

    socket () {
      return this.$store.getters['socket']
    },

    style () {
      return this.orientation 
        ? {
          ...this.baseStyle,
          width: "100vw",
          height: "85vh",
          top: 0,
          left: 0
        }
        : {
          ...this.baseStyle,
          width: "85vw",
          height: "100vh",
          top: 0,
          left: "15vw"
        }
    }
  },
}
</script>

<style>
</style>
