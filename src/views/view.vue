<template>
  <layout v-if="server"
    :Title="'WorkSpacing'"     
    @tabchanged="tabchanged"
    @openExplorer="exploring = !exploring"></layout>

    <v-main v-if="server">
      <v-container grid-list-xs fluid
      class="Background l1" v-show="WKs.size<=0 || exploring">
        <v-slide-y-transition>
          <file-system v-show="exploring"/>
          <!-- @openFile="callResolver"  -->
        </v-slide-y-transition>
        
      </v-container>

      <v-tabs-items v-model="SelectedWS"
      v-if="WKs.size>0">
        <v-tab-item
        v-for="(WK, index) in WKs.wks"
        :key="index">
          <v-container grid-list-xs fluid
          class="Background l1">
            <Base 
            :WK="WK" 
            @closeWC="(arg) => WKs.deleteWC(WK, arg)" />
            
          </v-container>          
        </v-tab-item>      
      </v-tabs-items>

      
    </v-main>
</template>

<script>
import WorkLayout from "./layout/workspace/BarsAndDrawer.vue"
import ExplorerLayout from "./layout/explorer/BarsAndDrawer.vue"
export default {
    components:{
        WorkLayout,
        ExplorerLayout
    }

}
</script>

<style>

</style>