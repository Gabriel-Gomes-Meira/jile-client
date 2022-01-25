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
				//	onAction: function () {
				//		dialog.active = true;
				//		dialog.arg = null;
				//	}
				});

				editor.ui.registry.addMenuItem('save', {
					icon:'save',
					text: 'Salvar',
					onAction: function () {			
						//ignore os comentários abaixo até segunda ordem:			
						//a ideia de salvar é bem simples: passa para o dialog o document, o usuario cria a pasta e/ou file desejado, seleciona, e salva, mas recebe um aviso de sobreposição antes, caso escolha um arquivo já existente. Em caso dele já ter nome, dá pra salvar por aqui mesmo. 
					}
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
							
		<!-- <open-dialog :active="dialog.active"
		:document="dialog.arg"
		@close="dialog.active=false"
		@savedDocument="saved"
		@openDocument="open"/> -->

		<!-- <v-snackbar
		top v-model="snack.active"
		color="success">
			{{snack.message}}
			<template v-slot:action="{ attrs }">
				<v-btn
				color="white"
				text
				v-bind="attrs"
				@click="snack.active = false"
				>
					<v-icon>mdi-close-circle-outline</v-icon>
				</v-btn>
			</template>

		</v-snackbar> -->
	</div>
     
    
   
</template>

<script>

import Editor from '@tinymce/tinymce-vue'
// import OpenDialog from './OpenDialog.vue'
import { mapGetters } from 'vuex';

export default {
	name: 'Markdower',   

	props:['boxid'],

	components: {
		'editor': Editor,		
		// OpenDialog
   	},

	data(){
		return {
			// dialog:{
			// 	active:false,
			// 	arg:null
			// },
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
		fetch(`http://${this.server}/files/?path=${this.wc.contents[0].path}`)
		.then(resp => resp.text())
		.then(text => {
			this.document.content = text
		})
		// this.$store.dispatch('loadMarkdower')
		
	},

	methods:{
		// saved(file){
		// 	this.document.oldcontent = this.document.content
		// 	this.document.id = file.id
		// 	this.document.name = file.name
		// 	this.snack.message = 'Salvo com sucesso!'
		// 	this.snack.active = true
		// }, 

		// open(file){
		// 	this.document.oldcontent = file.content
		// 	this.document.content = file.content
		// 	this.document.name = file.name
		// 	this.document.id = file.id			
		// }
	}
 }
 </script>

 <style>
 	.tox-notification {
		display: none!important;
	}
 </style>