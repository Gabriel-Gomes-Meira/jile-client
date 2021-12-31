<template>
  <v-app
  id="app">
    <formcomunication v-if="!server"/>

    

  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import Base from './components/WorkSpace/Space.vue';
import BarsdAndDrawer from './components/Layout/BarsAndDrawer.vue';
import Main from "./components/File System/JileMain.vue"
import login from "./components/login.vue"

export default {
  name: 'App',

  components: {
    Base,
    Layout: BarsdAndDrawer,
    FileSystem: Main,
    formcomunication:login
  },

  data: () => ({    
    SelectedWS:-1,
    exploring:false
  }),

  computed: {
    ...mapGetters([
      'WKs','server'
  ])},

  methods:{

    tabchanged(index){
      this.SelectedWS = index
    },
    

  },

  created(){
    // console.log(this.$store.w)
  }

}
</script>

<style >
  html{
    overflow: hidden!important;;
  }
  .Background{    
    overflow: hidden;
    height:100vh;
  }
  
</style>
