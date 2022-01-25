<template>
  
    <div class="drop">        
    
		<image-viewer :List="wc.contents" :ref="'viewer_'+boxid"
		 :viewer_id="boxid"
		 :loadingFiles="loadingFiles"></image-viewer>		 
							
    </div>
  
</template>



<script>
import { mapGetters } from 'vuex';
import ImageViewer from './ImageViewer.vue'


export default {
	name: 'ImagesExplorer',

	props:['boxid'],

	components:{
		ImageViewer
	},

	data(){    
		return{        			 
			loadingFiles:false,  
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