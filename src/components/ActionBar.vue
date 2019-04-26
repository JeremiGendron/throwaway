<template>
  <div id="action-bar" :style="actionBarStyle">
    <div id="buttons" :style="buttonsStyle">
      <div id="create" @click="createRoom" :style="createStyle">
        <span
          :style="{
            fontSize: '3vh',
            padding: '1vh 2vw',
            cursor: 'pointer'
          }"
        >
          +
        </span>
      </div>
      <div id="join" @click="joinRoom" :style="joinStyle">
        <span
          :style="{
            fontSize: '3vh',
            padding: '1vh 2vw',
            cursor: 'pointer'
          }"
        >
          #
        </span>
      </div>
    </div>
    <div id="join-dialog" v-if="showJoinDialog || showCreateDialog" :style="joinDialogStyle" @click="closeDialog">
    </div>
    <div id="join-form" v-if="showJoinDialog" :style="joinFormStyle">
      <!--
      <div id="close-join" class="close-join">
        <div id="close-x" class="close-x" @click="closeDialog">X</div>
      </div>
      -->
      <div id="join-inputs">
        <avatar
          v-if="inputIdValid"
          :seed="inputModel"
          :epsilon="0.1"
          :max-divisions="36"
          :style="{
            width: '6vh',
            height: '6vh'
          }"
        />
        <input
          id="input-id"
          type="text" 
          :style="{
            padding: '0.5vh',
            border: !inputIdValid && inputIdDirty ? '1px solid red' : inputIdValid ? '1px solid green' : ''
          }"
          @keyup="validateInput"
          v-model="inputModel"
          placeholder="7cf26f0c-0460-4980-a3df-317bdd910b4e"
          autocomplete="off"
        />
        <div id="input-submit" @click="sendJoin" style="cursor: pointer"><span>Join</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from 'vue-random-avatar'
import validateUuid from 'uuid-validate'

export default {
  name: 'ActionBar',

  components: {
    avatar
  },

  data () {
    return {
      showCreateDialog: false,
      showJoinDialog: false,
      inputIdDirty: false,
      inputIdValid: false,
      waitingFor: '',
      inputModel: '',
      baseActionBarStyle: {
        backgroundColor: "grey",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute"
      },
      baseButtonsStyle: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      baseCreateStyle: {
        color: 'white',
        borderRight: '1px solid black',
        borderBottom: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      baseJoinStyle: {
        color: 'white',
        borderBottom: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'

      },
      baseJoinDialogStyle: {
        backgroundColor: '#33333355',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
      baseJoinFormStyle: {
        backgroundColor: 'white',
        boxShadow: '5px 10px 8px #888888',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        padding: '1vh 2vw 2vh 2vw',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }
  },

  methods: {
    createRoom () {
      this.loading = true
      const reqid = Math.random().toString()
      this.waitingFor = reqid
      this.socket.send(JSON.stringify({
        action: 'createroom',
        reqid
      }))
    },
    sendJoin () {
      const reqid = Math.random().toString()
      this.waitingFor = reqid
      this.socket.send(JSON.stringify({
        action: 'joinroom',
        room: this.inputModel,
        reqid
      }))
    },
    joinRoom () {
      this.showJoinDialog = true
    },
    closeDialog () {
      this.showJoinDialog = false
      this.showCreateDialog = false
      this.inputModel = ''
      this.inputIdDirty = false
      this.inputIdValid = false
    },
    validateInput () {
      this.inputIdDirty = true
      this.inputIdValid = validateUuid(this.inputModel, 4)
    },
    openRoom (room) {
      this.$store.commit('openRoom', room)
    }
  },

  created() {
  },

  mounted() { 
  },

  computed: {
    orientation () {
      return this.$store.getters['orientation']
    },

    newroom () {
      return this.$store.getters['newroom']
    },
    socket () {
      return this.$store.getters['socket']
    },

    room () {
      return this.$store.getters['room']
    },

    actionBarStyle () {
      return this.orientation
        ? {
          ...this.baseActionBarStyle,
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "5vh"
        }
        : {
          ...this.baseActionBarStyle,
          top: 0,
          left: 0,
          height: "10vh",
          width: "15vw"
        }
    },
    buttonsStyle () {
      return this.orientation
        ? {
          ...this.baseButtonsStyle,
          flexDirection: "row",
        }
        : {
          ...this.baseButtonsStyle,
          flexDirection: "row",
        }
    },
    createStyle () {
      return this.orientation
        ? {
          ...this.baseCreateStyle,
          width: "50%",
          height: "100%",
        }
        : {
          ...this.baseCreateStyle,
          width: "50%",
          height: "100%"
        }
    },
    joinStyle () {
      return this.orientation
        ? {
          ...this.baseJoinStyle,
          width: "50%",
          height: "100%",
        }
        : {
          ...this.baseJoinStyle,
          width: "50%",
          height: "100%"
        }
    },
    joinDialogStyle () {
      return this.orientation
        ? {
          ...this.baseJoinDialogStyle,

        }
        : {
          ...this.baseJoinDialogStyle,
        }
    },
    joinFormStyle () {
      return this.orientation
        ? {
          ...this.baseJoinFormStyle,
        }
        : {
          ...this.baseJoinFormStyle,
        }
    }
  },

  watch: {
    room (val) {
      if (val === this.inputModel) {
        this.openRoom(val)
        this.closeDialog()
      }
    },
    newroom (val) {
      if (val[0] === this.waitingFor) {
        this.waitingFor = ''
        this.loading = false
        this.openRoom(val[1])
      }
    }
  }
}
</script>

<style>
.close-join {
  width: 100%;
  height: 2vh;
  display: flex;
  align-items: center;
  justify-content: flex-end
}
.close-x {
  font-size: 2vh;
  cursor: pointer;
}

#join-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#input-id {
  height: 1.5vh;
  margin: 1vh 1vw;
}

#input-submit {
  height: 2vh;
  width: 4vw;
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0.5vh 1vw
}

.loader{
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: url('//upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Phi_fenomeni.gif/50px-Phi_fenomeni.gif') 
              50% 50% no-repeat rgb(249,249,249);
}

.result {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
