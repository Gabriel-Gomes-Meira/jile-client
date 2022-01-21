<template>
  
    <div class="drop">        
    
		<image-viewer :List="FilesSources" :ref="'viewer_'+boxid"
		 :viewer_id="boxid"
		 :loadingFiles="loadingFiles"></image-viewer>
		 <!-- @openExplorer="openExplorer" -->
							
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
			FilesSources:[],      
			loadingFiles:false,  
		}
	},

	computed:{
		...mapGetters([
			'fromExplorer'
		])
	},
	

	created(){		

		console.log(this.fromExplorer)
		this.FilesSources = this.fromExplorer

		// this.loadingFiles = true;
		// this.FilesSources = []

		// setTimeout(() => {
			// this.loadingFiles = false;	
			// this.contentsPresets[this.boxid].FilesSources = this.FilesSources
			// this.$store.dispatch('saveContent')			
		// }, 1500);

		// if(!this.contentsPresets[this.boxid]){			
		// 	this.contentsPresets[this.boxid] = {
		// 		FilesSources: [],				
		// 	}
		// } else if(this.contentsPresets[this.boxid].FilesSources.length>0) {									
		// 	this.loadingFiles = true;
		// 	// ipcRenderer.send('readin', this.contentsPresets[this.boxid].FilesSources)
		// }		
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