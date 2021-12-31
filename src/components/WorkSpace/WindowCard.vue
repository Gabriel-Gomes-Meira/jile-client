<template>
    <dnd-grid-box :boxId="Data.id"  
    v-if="Data.id" 
    :id="Data.id"
    :dragSelector="'#systembar_'+Data.id">
	
        <!-- SystemBar Start -->
        <v-system-bar
        :id="'systembar_'+Data.id"        
        height="20"        
        class="px-0 py-0 rounded-t l3"
        >
			<v-spacer></v-spacer>
			<v-btn 
			x-small
			color="transparent"
			tile
			elevation="0"
      @click="Data.pinned=!Data.pinned">
				<v-icon>
				{{Data.pinned? "mdi-pin-off-outline":"mdi-pin"}}
				</v-icon>                  
			</v-btn>

			<v-btn x-small 
			color="red darken-2"
			class="rounded-0 rounded-tr"
			
			elevation="0" 
			@click="$emit('close')">
				<v-icon>mdi-close</v-icon>
			</v-btn>
        </v-system-bar>
        <!-- SystemBar END -->
        
        <!-- Cell Card Start -->
        <v-card   
        style="overflow:hidden;"  
        elevation="6"
        color="backcard"
        class="rounded-b rounded-t-0"         
        :height="Data.position.h*6-24">                                         
          	<!-- <music-player v-if="Data.type=='Music'" ></music-player> -->
          <midia-explorer v-if="Data.type=='Player'"
          :boxid="Data.id"></midia-explorer>
              
          <images-explorer v-else-if="Data.type=='Image'"           
          :boxid="Data.id"></images-explorer>
          
          <!-- <navigation v-else-if="Data.type == 'Browser'"></navigation> -->
          
          <!-- <markdower v-else
          :height="Data.position.h*6-24"></markdower> -->
        </v-card>
        <!-- Cell Card End -->
          
	</dnd-grid-box>
</template>

<script>
// import Container and Box components
import { Box } from '@dattn/dnd-grid'
import { mapGetters } from 'vuex';
// import MusicPlayer from './Cell/Music Player/MusicPlayer.vue'
import ImagesExplorer from '../Image Viewer/ImagesExplorer.vue'
import MidiaExplorer from '../Midia Player/ListHandle.vue'
// import Markdower from './Cell/TextEditor/Markdower.vue'



export default {
    props:['Data'],

    components:{        
        DndGridBox: Box, 
        // MusicPlayer,
        ImagesExplorer,
        MidiaExplorer,
        // Markdower,		
    },

    computed: {
		...mapGetters([
			'defaultSizes'  
		])
	},
    
    updated(){
		// console.log(this.Data.position.h)
		this.$emit('maybeResize', this.Data, 
			this.defaultSizes[this.Data.type].h,
			this.defaultSizes[this.Data.type].w)
    },
    
    created(){      
		if(!this.Data.id) {
			this.$destroy();
		} else {        
        this.$emit('maybeResize', this.Data, 
            this.defaultSizes[this.Data.type].h,
            this.defaultSizes[this.Data.type].w)
      }    
    },
}
</script>