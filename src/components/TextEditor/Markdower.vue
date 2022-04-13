 <template>
	<div style="height:inherit">
		<v-tooltip bottom >
			<template v-slot:activator="{ on, attrs }">
				<v-btn style="position:absolute; top:0; right:0; z-index:100" color="orange"
				x-small fab class="mr-2 mt-1" text
				v-bind="attrs"
				v-on="on"
				v-show="document.content != document.oldcontent">
					<v-icon>
						mdi-exclamation-thick
					</v-icon>
				</v-btn>
			</template>
      		<span> Não salvo </span>
		</v-tooltip>
		
		<editor
		api-key="no-api-key"        		
		:init="{   
			height:'inherit',
			resize:false,
			menubar: 'myfile edit insert format table',
			menu: {
				myfile: { title: 'File', items: 'open save' }
			},
			setup: function (editor) {
				var toggleState = false;						

				editor.ui.registry.addMenuItem('open', {
					icon:'document-properties',
					text: 'Abrir',
					onAction: performOpen
				});

				editor.ui.registry.addMenuItem('save', {
					icon:'save',
					text: 'Salvar',
					onAction: performSave
				});
				
			},
			plugins: [
			'advlist autolink lists link image charmap print preview anchor',
			'searchreplace visualblocks code fullscreen',
			'insertdatetime media table paste code help wordcount'
			],
			toolbar: 'fontselect fontsizeselect formatselect |  bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist outdent indent | undo redo'        
			}"
			v-model="document.content"
		/>
							
		<explorer
		:show="dialog.active"
		:filter="'Text'"
		:isSaving="!dialog.opening"
		@close="dialog.active = false"
		@save="upDocument"
		@submit="receiveFiles"
		/>

	</div>
     
    
   
</template>

<script>

import Editor from '@tinymce/tinymce-vue'
import dialog from '../Explorer/DialogExplorer.vue'
import axios from 'axios'
import { mapGetters } from 'vuex';

export default {
	name: 'Markdower',   

	props:['boxid'],

	components: {
		'editor': Editor,		
		explorer:dialog
   	},

	data(){
		return {
			dialog:{
				active:false,	
				opening:true
			},
			// snack:{
			// 	message:'',
			// 	active:false,
			// },
			document:{
				id:'',
				name:'',
				content:'',
				oldcontent:''
			}
		}
	},
	
	computed:{
		...mapGetters([
			'WKs', 'server'
		]),
		wc(){
			return this.WKs.searchWC(this.boxid)
		}
	},

	created(){
		if(this.wc.contents[0]){
			this.setContent()
		}
		// this.$store.dispatch('loadMarkdower')
		
	},

	methods:{
		
		receiveFiles(arg){
			this.wc.contents = arg;
			this.setContent()
		},

		setContent(){
			fetch(`http://${this.server}/files/?path=${this.wc.contents[0].path}`)
			.then(resp => resp.text())
			.then(text => {
				this.document.content = text
			})
		},

		performSave(){
			this.dialog.active = true
			this.dialog.opening = false
		},

		performOpen(){
			this.dialog.active = true
			this.dialog.opening = true
		},

		upDocument(data){
			var headers = {
				'Content-Type': 'application/json',	
			}
			axios.post(`http://${this.server}/save/`, {
				filename:data[1],
				address:data[0].path+"\\",
				content:this.document.content
			}, {headers: headers}).then((response) =>{
				console.log(response)
				this.$store.dispatch('saveWorkState');
			})		
		}
	}
 }
 </script>

 <style>
 	.tox-notification {
		display: none!important;
	}
 </style>