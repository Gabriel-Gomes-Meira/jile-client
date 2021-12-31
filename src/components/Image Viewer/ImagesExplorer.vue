<template>
  
    <div class="drop"     
    @dragover.prevent
    @dragleave.prevent
    @drop.prevent="drop($event)">        
    
		<image-viewer :List="FilesSources" :ref="'viewer_'+boxid"
		 :viewer_id="boxid"
		@openExplorer="openExplorer" :loadingFiles="loadingFiles"></image-viewer>
					
		<input type="file" :id="'uploadmyfile_'+boxid" class="uploadmyfile"
		:accept="'image/*'" multiple @change="requestUploadFile">      
    </div>
  
</template>



<script>
import { mapGetters } from 'vuex';
import ImageViewer from './ImageViewer.vue'
// import { ipcRenderer } from "electron"
// import { constructFileFromLocalFileData } from "get-file-object-from-local-path"

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
			'contentsPresets'
		])
	},

	created(){
		// ipcRenderer.on('readout', (event, args) =>{					
		// 	var URL = window.URL || window.webkitURL
			
		// 	var element = this.contentsPresets[this.boxid].FilesSources[args[1]]

		// 	const file = constructFileFromLocalFileData(args[0]) // returns a JS File object			

		// 	this.FilesSources.push({
		// 		src:URL.createObjectURL(file)	,
		// 		path:element.path,
		// 		title:element.title,
		// 		type:element.type,
		// 	})	

		// 	if(!args[2]) {								
		// 		this.loadingFiles = args[2];
		// 		this.$refs['viewer_'+this.boxid].loadPosition();
		// 	}			 

		// })		

		if(!this.contentsPresets[this.boxid]){			
			this.contentsPresets[this.boxid] = {
				FilesSources: [],				
			}
		} else if(this.contentsPresets[this.boxid].FilesSources.length>0) {									
			this.loadingFiles = true;
			ipcRenderer.send('readin', this.contentsPresets[this.boxid].FilesSources)
		}		
	},
  
  	methods:{

		openExplorer(){
			document.getElementById('uploadmyfile_'+this.boxid).click()
		},
    
		async drop(e){
				
			let files = [...e.dataTransfer.files]
			let images = files.filter(file => file.type.indexOf('image/') >= 0)

			if (images.length > 0) {
				this.loadingFiles = true;

				var URL = window.URL || window.webkitURL
				  				
				this.FilesSources = []

				setTimeout(() => {
					images.forEach(file => {														
						this.FilesSources.push(
							{								
								src:URL.createObjectURL(file),
								title:file.name,							
								path:file.path,
								type:file.type            
							}                
						)										
					})

					this.loadingFiles = false;	
					this.contentsPresets[this.boxid].FilesSources = this.FilesSources
					this.$store.dispatch('saveContent')									
				}, 1500);															
			}        
		},

		requestUploadFile(){
			var src = this.$el.querySelector('#uploadmyfile_'+this.boxid)
			this.drop({dataTransfer:src})
		},    
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