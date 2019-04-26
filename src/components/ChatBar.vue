<template>
  <div id="chat-bar" :style="style">
    <div
      v-for="(room, index) in rooms"
      @click="openRoom(room)"
      :key="index"
      style="cursor: pointer"
    >
      <avatar
        :seed="room"
        :epsilon="0.1"
        :max-divisions="36"
        :style="{
          width: '6vh',
          height: '6vh',
          margin: '1vh'
        }"
      />
    </div>
  </div>
</template>

<script>
import avatar from 'vue-random-avatar'

export default {
  name: 'ChatBar',

  components: {
    avatar
  },

  data () {
    return {
      baseStyle: {
        backgroundColor: "lightgrey",
        display: "flex",
        position: "absolute",
      }
    }
  },

  created() {},

  mounted() {},

  computed: {
    orientation () {
      return this.$store.getters['orientation']
    },

    rooms () {
      return this.$store.getters['rooms']
    },

    style () {
      return this.orientation
        ? {
          ...this.baseStyle,
          height: "10vh",
          width: "100vw",
          bottom: "5vh",
          left: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflowX: 'auto'
        }
        : {
          ...this.baseStyle,
          height: "90vh",
          width: "15vw",
          top: "10vh",
          left: 0,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflowY: 'auto'
        }
    }
  },

  methods: {
    openRoom (room) {
      this.$store.commit('openRoom', room)
    }
  },

  watch: {}
}
</script>

<style>

</style>
