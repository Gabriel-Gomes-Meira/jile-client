<template>
  <v-app id="app"
  class="l1">   
        
    <!-- <v-scroll-x-reverse-transition v-else-if="$router.history.current.name=='Explorer'"> -->
      <router-view/>
    <!-- </v-scroll-x-reverse-transition>
    <router-view v-else/>  -->
    
    
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: { 
    transitionName:"bounce"   
  },

  data: () => ({        
  }),

  computed: {
    ...mapGetters([
      'server'
  ])},

  methods:{        
  },

  created(){    
    if(this.server) {
      this.$router.push('Explorer')
    }    
    
  }

}
</script>

<style >
  html{
    overflow: hidden!important;;
  }    
</style>