<template>
  
    <div class="drop">        
    
		<image-viewer :List="wc.contents" :ref="'viewer_'+boxid"
		 :viewer_id="boxid"
		 :loadingFiles="loadingFiles" 
		 @openExplorer="exploring = true"/>

		<explorer 
		:show="exploring"
		:filter="'Image'"
		@close="exploring = false"
		@submit="receiveFiles"
		/>
							
    </div>
  
</template>



<script>
import { mapGetters } from 'vuex';
import ImageViewer from './ImageViewer.vue'
import dialog from '../Explorer/DialogExplorer.vue'

export default {
	name: 'ImagesExplorer',

	props:['boxid'],

	components:{
		ImageViewer,
		explorer:dialog
	},

	data(){    
		return{        			 
			loadingFiles:false,  
			exploring:false,
		}
	},

	computed:{
		...mapGetters([
			'WKs'
		]),

		wc(){
			return this.WKs.searchWC(this.boxid)
		}
	},
	

	created(){								
	},
  
  	methods:{		    									
		receiveFiles(arg){
			this.wc.contents = arg;
		}
  	}
}
</script>



<style scoped>  

	.drop{
		height: inherit;
	}

	.uploadmyfile{
		display: none;
	}
</style>