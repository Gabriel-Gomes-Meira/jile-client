<template>

	<div class="drop"     
	:id="'player-container_'+boxid"
	>

		<v-navigation-drawer
		v-model="drawerList"
		absolute
		temporary class="suboverflow-h"
		>
			<v-list 
			nav dense >
				<v-list-item v-if="ListMask.length>0">
					<v-btn x-small color="l6" 
					outlined
					@click="deletingState">
						<v-icon>{{isDeleting?'mdi-cancel':'mdi-playlist-minus'}}</v-icon>
					</v-btn>

					<v-btn x-small color="l6" outlined 
					class="ml-8"
					@click="confimDelete" v-if="isDeleting && willDeletes.length>0">
						<v-icon>mdi-check-circle-outline</v-icon>
					</v-btn>

					<v-btn color="l6" x-small absolute
					outlined right
					@click="selectAll">
						<v-icon>mdi-playlist-remove</v-icon>
					</v-btn>             
				</v-list-item>
				<v-divider></v-divider>        

				<v-list-item-group 
				:multiple="isDeleting?true:false"
				v-model="selected"         
				active-class="l6--text text--accent-4">
					<draggable v-model="ListMask" v-if="ListMask.length>0">            
						<v-list-item v-for="(file, index) in ListMask"          
						:key="index"> 
							<v-list-item-content>
								<v-list-item-title class="video-title">            
									<trunquee 
									:text="file.name"
									:speed="105"
									:cursor="'pointer'">                   
									</trunquee>
								</v-list-item-title>                  
							</v-list-item-content>
						</v-list-item>                        
					</draggable>     
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
				
		<player :Midia="wc.contents[0]" :loadingFiles="loadingFiles"
		:settings="WKs.searchWC(boxid).settings" @drawerin="drawerList=true" @next="next" @prev="prev" @nextRandom="getRandom"
		ref="player" :player_id="boxid"
		@openExplorer="exploring = true"
		></player>		

		<explorer 
		:show="exploring"
		:filter="'Player'"
		@close="exploring = false"
		@submit="receiveFiles"
		/>
		

	</div>
</template>


<script>

import { mapGetters } from 'vuex';
import Player from './PlayerFront.vue'
import draggable from 'vuedraggable'
import Trunquee from '../Trunquee.vue'
import dialog from '../Explorer/DialogExplorer.vue'




export default {
	name: 'ListHandle',

	props:['boxid'],

	components:{
		Player,
		draggable,
		Trunquee,
		explorer:dialog
	},

	data(){    
		return{    			
			ListMask:[],        
			loadingFiles:false,
			isDeleting:false,   
			willDeletes:[],
			drawerList:false,	
			exploring:false,		
		}
	},

	computed:{
		...mapGetters([		
			'WKs', 'interComunication'
		]),

		wc(){
			return this.WKs.searchWC(this.boxid)
		},

		selected:{ 
			get(){
				//v-model será do atual reproduzindo caso usário não esteja deletando a lista
				if(!this.isDeleting) {
					return this.ListMask.findIndex((element) =>{        
						if (element.name == this.wc.contents[0].name) {                   
							return true;
						}
					})
				} else {
					//v-model será da lista de pontenciais deletes
					return this.willDeletes
				}
			},
			set(value){
				//encontrar o video desejado no array principal
				if(value) {
					//tratamento para definir o selected value ser igual ao video que reproduzirá na lista
					if (!this.isDeleting) {
						var wanted = this.wc.contents.findIndex((element) =>{
						if(element.name == this.ListMask[value].name) {
								return true;
							}
						})						
		
						// fazer remoção do inicio e adição ao final até o quem que eu desejo estar no inicio                
						for (let index = wanted; index > 0; index--) {
							this.wc.contents.push(this.wc.contents.shift())                    
						}						
						this.WKs.searchWC(this.boxid).settings.currentTime = 0;
					} else {
						//tratamento para escolher itens para se deletar            
						this.willDeletes = value            
					}										
				}        
			}
		},


	},	

	beforeDestroy(){		
		// this.$store.dispatch('saveContent')
	},

	methods:{	
		receiveFiles(arg){
			this.wc.contents = arg;
			Object.assign(this.ListMask, this.wc.contents)			
		},

		// receivePath(arg){
		// 	console.log(arg.length)
		// 	// this.explorer.caminho = arg;
		// },

		// Metodos executados no ListHandle, porém chamados no Player
		next(){  
			//primeiro verficando se não está ocorrendo uma remoção da lista, pois caso esteja, selected não poderá ser alterado
			if(!this.isDeleting) {
				if(!this.ListMask[this.selected+1]) {  
					this.selected = 0      
				} else { this.selected++ }
				
				// this.$nextTick(() => {
					this.WKs.searchWC(this.boxid).settings.currentTime = 0;
				// })
			}								
		},

		prev(){
			if(!this.ListMask[this.selected-1]) {
				this.selected = this.ListMask.length-1;        
			} else {
				this.selected--;
			}
		},    

		getRandom() {
			var min = Math.ceil(0);
			var max = Math.floor(this.ListMask.length);
			this.selected = Math.floor(Math.random() * (max - min)) + min;      
		},
		
		selectAll(){
			this.isDeleting = true;
			this.ListMask.forEach((e, index) => {
				this.willDeletes.push(index)
			})      
		},

		deletingState(){
			if(this.isDeleting) {        
				this.isDeleting = false
				this.willDeletes = []
			} else {
				this.isDeleting = true
			}
		},

		confimDelete(){
			//acessar via index antigos vai acarretar em erros, então devo primeiro enlaçar cada elemento ao titulo
			var names = []
			this.willDeletes.forEach((e) => {        
				names.push(this.ListMask[e].name) 
			})      

			names.forEach((e) =>{				
				//encontrando index do elemento a ser removido no mask        
				var willRemoved = this.ListMask.findIndex((element) =>{
					if(e == element.name) {
						return true;
					}
				})
				willRemoved = this.ListMask.splice(willRemoved, 1)        
				//removendo 
				

				willRemoved = this.wc.contents.findIndex((element)=>{
					if(element.name == e) {
						return true;
					}
				})
				willRemoved = this.wc.contents.splice(willRemoved, 1)            
				//repetindo 
			})

			// finalizando processo de deleção
			this.deletingState()
			//setando selected com o index de .ListMask que corresponde ao name do, atuaListMaskente em execução, .wc.contents
			this.selected = this.ListMask.findIndex((element) => {
				if(element.name == this.wc.contents[0].name) {
					return true
				}
			})			
		},

		// chamar o explorer
		callExplorer(){						
		},		
	},
	
	created(){
		Object.assign(this.ListMask, this.wc.contents)
	}
	
}
</script>



<style scoped>
	.drop{
		height: inherit;                  
	}  
</style>