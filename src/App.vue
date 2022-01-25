<template>
  <v-app id="app"
  class="l1">   
        
    <!-- <v-scroll-x-reverse-transition v-else-if="$router.history.current.name=='Explorer'"> -->
      <router-view/>
    <!-- </v-scroll-x-reverse-transition>
    <router-view v-else/>  -->

    <v-snackbar
    v-model="snack.dialog">
        {{ snack.message }}
        <template v-slot:action>
            <v-btn
            color="red"
            text                
            @click="snack.dialog = false">
            Fechar
            </v-btn>
        </template>
    </v-snackbar>
    
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
      'server', 'snack'
  ])},

  methods:{        
  },

  created(){   
    this.$store.dispatch('loadState')   
    if(!this.server) {
      this.$router.push('/')
    }    
    
  }

}
</script>

<style >
  html{
    overflow: hidden!important;;
  }    
</style>