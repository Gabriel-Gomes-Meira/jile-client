<template>
  <!-- r=155, c=192 -->
  <dnd-grid-container :layout.sync="WK.layout"
  :margin="4"  
  :maxRowCount="114"
  class="l1"
  :cellSize="{
    h:2,
    w:3
  }">
    <window-card
    v-for="(window, index) in WK.layout" 
    @close="closeWindow(window.id)"
    :key="index"
    :Data="window"
    @maybeResize="handleMinimun">
    </window-card>
          
  </dnd-grid-container>

</template>

<script>
// import { mapGetters } from 'vuex';
// import Container and Box components
import { Container } from '@dattn/dnd-grid'
import WindowCard from './WindowCard.vue'

import '@dattn/dnd-grid/dist/dnd-grid.css'


export default {
  components:{
    DndGridContainer: Container,
    WindowCard
  },  

  props:['WK'],    

  methods:{

    closeWindow(id){        
      this.$emit('closeWC', id)
      
    },

    handleMinimun(window, minheight, minwidth){
      if(window.position.h <= minheight) {
        window.position.h = minheight
      }

      if(window.position.w <= minwidth) {
        window.position.w = minwidth
      }
    },
  },
  
}
</script>

<style>
  .dnd-grid-box.placeholder{
    border:1px dashed rgb(255, 255, 255)!important;
  }
  
</style>