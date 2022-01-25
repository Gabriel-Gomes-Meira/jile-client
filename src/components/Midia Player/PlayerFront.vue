<template>
    
    <div class="player-container"    
    @mouseenter="showControls" 
    @mouseout="showControls"
	
    @contextmenu="showMenu">

      <div class="aside-menu" :id="'v-menufarea_'+player_id" v-if="fullscreenEnable"></div>
      
      <v-row :class="hidingControls?'player-title hide':'player-title'">
        <v-col cols="3">
            <v-btn class="mr-2"
            color="l4" small outlined :disabled="loadingFiles?true:false"
            @click="$emit('openExplorer')">
              <v-icon>mdi-folder-home-outline</v-icon>
            </v-btn> 

            <v-btn class="mr-2"
            color="l4" small outlined :disabled="loadingFiles?true:false"
            @click="$emit('drawerin')">
              <v-icon>mdi-view-list-outline</v-icon>
            </v-btn>                        
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="9" 
        class="player-title-name">
            <p class="l5--text text-truncate text-right">
              {{Midia?Midia.title:'Sem arquivo'}}
            </p>
        </v-col>
      </v-row>

		<!-- Reprodutor de Mídia Start -->
		<v-row class="player-row pb-0"
		>
			
			<player-back v-if="Midia && !loadingFiles"
			:player_id="player_id"  :Midia="Midia"
			@togglePlay="togglePlay" @finish="finish" 
			:key="Midia?Midia.name:'playerbb'"
			@initialized="initialized" @updateProgress="updateProgress" />			
			
			<!-- Mask Player Start -->
			<v-col cols="12" v-else class="mask-player" >
				<p class="text-center" >
					<v-icon size="100" color="l5">mdi-movie-open-outline</v-icon>  
				</p>
				<p class="l6--text text-center" v-if="!loadingFiles">
					Não há arquivos para reproduzir.
				</p> 
				<p class="l6--text" v-else>
					Carregando arquivos salvos...
				</p>
			</v-col>
			
			<!-- Mask Player End -->
		</v-row>
		<!-- Reprodutor de Mídia End -->

      <v-row class="controls-row px-5 pb-6"              
      :class="hidingControls?'hide':''">        
        <v-col cols="12" class="progress">          
          <v-slider v-model="progressBar" :step="1" :disabled="Midia||loadingFiles?false:true"
          height="1"
          color="l5" :thumb-size="50" :thumb-color="'l1'"
          :max="playerDuration" @mousedown="alterningTime=true" @mouseup="alterningTime=false"
          @change="skipAhead" thumb-label>
            <template v-slot:thumb-label="{ value }">
              {{ new Date(value * 1000).toISOString().substr(11, 8) }}
            </template>
          </v-slider> 
                   
        </v-col>

        <v-col class="bottom-controls d-flex align-content-center"
        cols="12">
          <v-row :align="'center'" 
          class="px-3 d-flex">
            
            <v-btn
            class="no-border" @click="prev()" :disabled="Midia||loadingFiles?false:true"
            outlined color="l5" small
            data-title="Previous (s)">
                <v-icon>mdi-skip-previous-outline</v-icon>
            </v-btn>

            <v-btn class="no-border" 
            outlined color="l5"
            small :disabled="Midia||loadingFiles?false:true"
            :data-title="player.paused?'Play (k)':'Pause (k)'" @click="togglePlay" >
              <v-icon>{{player.paused?'mdi-play-outline':'mdi-pause'}}</v-icon>
            </v-btn>

            <v-btn
            class="no-border" @click="next" :disabled="Midia||loadingFiles?false:true"
            outlined color="l5" small
            data-title="Next (n)">
                <v-icon>mdi-skip-next-outline</v-icon>
            </v-btn>
          
            <v-btn class="no-border" 
            outlined color="l5" small
            data-title="Mute (m)"            
            @click="toggleMute" :disabled="Midia||loadingFiles?false:true"
            @mouseover="expandVolume" 
            >
              <v-icon>{{settings.volumeState}}</v-icon>
            </v-btn>            
              
            <v-col
            @mouseleave="expandVolume"
            :class="volumeExpanded?'expandido':'curto'"
            class="pa-0"
            cols="2">            
              <v-slider :disabled="Midia||loadingFiles?false:true"
              style="height:33px"
              color="l5"
              v-model="settings.volume"              
              @input="updateVolume"        
              :max="100"
              :min="0"
              :step="1"></v-slider>
            </v-col>
            
            <v-spacer></v-spacer>
                                    
            <p class="l5--text pt-4 pl-1">
              {{ new Date(this.currentTime * 1000).toISOString().substr(11, 8) }} /
              {{ Midia?new Date(playerDuration * 1000).toISOString().substr(11, 8):'00:00:00' }}
            </p>              
            
            <v-btn @click="togglePip" :disabled="Midia||loadingFiles?false:true"
            data-title="PIP (p)" color="l5" outlined small
            class="no-border">
              <v-icon>{{inpicture?'mdi-arrange-send-to-back':'mdi-picture-in-picture-bottom-right-outline'}}</v-icon>
            </v-btn>

            <v-btn @click="toggleFullScreen" :disabled="Midia||loadingFiles?false:true"
            :data-title="fullscreenEnable?'Full screen (f)':'Regular screen (f)'" 
            color="l5" outlined small
            class="no-border order-1">
              <v-icon>{{fullscreenEnable?'mdi-fullscreen-exit':'mdi-fullscreen'}}</v-icon>
            </v-btn>                                            
          </v-row>                        
        </v-col>        
      </v-row>
      
      <v-menu tile dark       
      v-model="popup.active"
      :position-x="popup.x"
      :position-y="popup.y"
      transition="scale-transition"
      :close-on-content-click="false"
      :attach="attachble">
	  	<v-sheet color="l5" outlined rounded="">
			<v-list dense rounded
			color="backcard" class="pa-0">  
				<v-list-item dense>
					<v-switch
					color="l5"
					v-model="settings.autoplay"  
					inset         
					></v-switch>
					<v-list-item-title
					class="l6--text"> Autoplay </v-list-item-title>
				</v-list-item>
				<v-divider class="l5"></v-divider>

				<v-list-item>
					<v-switch
					color="l5"
					:disabled="settings.randomMode?true:false"
					v-model="settings.loop"              
					inset dense></v-switch>
					<v-list-item-title
					class="l6--text"> Repetir </v-list-item-title>
				</v-list-item>
				<v-divider class="l5"></v-divider>

				<v-list-item>
					<v-switch
					color="l5"
					:disabled="settings.loop?true:false"
					v-model="settings.randomMode"              
					inset dense></v-switch>
					<v-list-item-title
					class="l6--text"> Aleatório </v-list-item-title>
				</v-list-item>
			</v-list>					  
		</v-sheet>      
      </v-menu>      
    </div>
    
</template>

<script >
import { mapGetters } from 'vuex';
import PlayerBack from './PlayerBack.vue'

export default {
    props:['Midia', 'settings', 'loadingFiles', 'player_id'],
	
    data(){
		return{
			player:{},          
			playerDuration:0, 
			progressBar:0,    
			currentTime:0,               
			popup:{ active: false, x:0, y:0},
			hidingControls:false,
			alterningTime:false,            
			volumeExpanded:false,
			fullscreenEnable:false,          
			inpicture:false,          
			attachble:false,			
        }
    },

	components:{
		PlayerBack
	},

	computed:{
		...mapGetters([
			// 'settings'
		])
	},	
	
	// updated(){						
	// 	this.$store.dispatch('saveContent');
	// },	

	// beforeDestroy(){	
	// 	this.saveState()
	// },

    mounted(){ 
		   				
      	document.addEventListener('keydown', this.keyboardShortcuts); 					
    },

    methods:{

		// saveState(){			
		// 	this.$store.dispatch('saveContent');
		// },		
		      
		next(){			
			if(this.settings.randomMode) {
				this.$emit('nextRandom')
			} else {
				this.$emit('next');
			}      
		},
		prev(){
			this.settings.currentTime = 0
			this.$emit('prev');
		},

		initialized(player){			
			this.player = player
			this.playerDuration = Math.round(this.player.duration)		
			const inter = setInterval(() => {
				this.recoverTime()
				// console.log(this.player)
				if(this.player.readyState) {
					clearInterval(inter);
				}
			}, 100);							

		},				

		finish(){
			if(this.settings.loop) {
				this.togglePlay();
			} else if (this.settings.autoplay) {
				this.next();
			}        
		},  

        //Play e display, simples assim
		togglePlay() {        
			if (this.player.paused) {
				this.player.play();
			} else {
				this.player.pause();
			}
		},
					
		// Serve pra realizar a animação de expand e retract do volume
		expandVolume(){               
			this.volumeExpanded = !this.volumeExpanded;         
		},								
	
		recoverTime(){
			if(this.settings.currentTime) {
				this.progressBar = this.settings.currentTime
				this.skipAhead()			
			} else {
				this.settings.currentTime = 0
			}	
			
			if(this.settings.autoplay) {
				this.togglePlay()
			}
		},

		// Atualiza progress slider
		updateProgress() {							
			
			this.currentTime = this.player.currentTime
			if(!this.alterningTime){
				this.progressBar = this.currentTime;                
			}    
			
			if(this.currentTime>this.settings.currentTime) {
				
				this.settings.currentTime = this.player.currentTime
				// this.$store.dispatch('saveContent');				
			}
								
		},        

		// Pula pro tempo que usuário interagir
		skipAhead() {
			if(!this.alterningTime){
				this.player.currentTime = this.progressBar;            
			}
		},

		// Atualiza valor do volume no player, e atualiza icone correspondente
		updateVolume() {
			if (this.player.muted) {
				this.player.muted = false;
			}

			this.updateVolumeIcon()			
			this.player.volume = this.settings.volume/100;
		},
		updateVolumeIcon() {
			if (this.player.muted || this.player.volume === 0) {
				this.settings.volumeState = 'mdi-volume-mute'
			} else if (this.settings.volume > 0 && this.settings.volume <= 30) {
				this.settings.volumeState = 'mdi-volume-low'
			} else if (this.settings.volume > 30 && this.settings.volume <= 70){
				this.settings.volumeState = 'mdi-volume-medium'
			} else {
				this.settings.volumeState = 'mdi-volume-high'
			}
		},

		// Muta volume
		toggleMute() {        
			if (this.settings.volume>0) {            
				this.settings.volume = 0;
			} else {
				this.settings.volume = 20;
			}

			this.updateVolume()
		},        

		// Habilita e desabilita o fullscreen mode
		toggleFullScreen() {
			if (document.fullscreenElement) {
				document.exitFullscreen();
				this.attachble = false;
				this.fullscreenEnable = false;
			} else {
				document.getElementById('player-container_'+this.player_id).requestFullscreen();          
				this.fullscreenEnable = true;
			}
		},
				
		// Abilitar modo picture
		async togglePip() {        
			try {
				if (this.player !== document.pictureInPictureElement) {
					this.inpicture = true;
					await this.player.requestPictureInPicture();
				} else {
					await document.exitPictureInPicture();
					this.inpicture = false;
				}
			} catch (error) {
				console.error(error);
			} 
		},

		// Esconder/mostrar controls
		showControls() {      
			if (this.player.paused || !this.Midia) {
				this.hidingControls = false;
				return;
			}
					
			this.hidingControls=!this.hidingControls; 
			if(!this.hidingControls){
				setTimeout(()=>{
					this.hidingControls = true;
				},3000)
			}       
		},

		// Tratamento de keyboard
		keyboardShortcuts(event) {
			if(!this.player) {				
				return
			}     						

			const { code } = event;          
			const handleKeyBoard = {
				Space(father){
					father.togglePlay();
					
					if (father.player.paused) {
						father.showControls();

					} else {
						setTimeout(() => {
						father.showControls();
						}, 2000);
					}
				},
				KeyK(father){
					this.Space(father);
				},
				KeyM(father){
					father.toggleMute();
				},
				KeyN(father){
					father.next();
				},
				KeyP(father){
					father.prev();              
				},
				KeyF(father){
					father.toggleFullScreen();
				},
				KeyS(father){
					father.togglePip();
				},
				ArrowDown(father){
					var posvol = father.volume-5              
					if(posvol < 0)
						posvol = 0;

					father.volume = posvol;
					father.updateVolume();               
				},
				ArrowUp(father){
					var posvol = father.volume+5              
					if (posvol > 100)
						posvol = 100;

					father.volume = posvol;
					father.updateVolume();
				},
				ArrowLeft(father){
					father.progressBar-=10;
					father.skipAhead();
				},
				ArrowRight(father){
					father.progressBar+=10;
					father.skipAhead();
				}
			} 
			
			if(handleKeyBoard[code]) {
				handleKeyBoard[code](this)
			}
		},
		
		showMenu(e){
			e.preventDefault()        
			this.popup.active = false

			if(!this.fullscreenEnable) {
				this.popup.x = e.clientX
				this.popup.y = e.clientY
				
			} else {
				var area = document.getElementById('v-menufarea_'+this.player_id)
				area.style.left = e.clientX+'px'
				area.style.top = e.clientY+'px'
				this.attachble = area
			}

			this.$nextTick(() => {
				this.popup.active = true
			})
		}
    },    
}


</script>

<style>

	.player-container{
		height: inherit;
		padding-top: 0;	
	}

	.player-title {
		right: 0;
		left: 0;
		padding: 10px;
		position: absolute;
		top: 0;
		display: flex;
		transition: all 0.2s ease;
		background-color: #302f2faa;
		z-index: 1;
	} .player-title.hide{
		opacity: 0;
		pointer-events: none;
	}


	.player-row{  
		height: inherit;
		margin-top: 0!important;		
	} .player-row div{
		height: inherit;
		width: 100%;
	} .player-row div video{
		height: 100%;
		width: 100%;  
	} .mask-player {
		height: inherit;
		display: flex;		
		align-items: center;
		justify-content: center;
		flex-flow: column;
	}


	.controls-row{  
		height: 90px;  
		bottom: 0;
		right: 0;
		left: 0;  
		position: absolute;
		transition: all 0.2s ease;
		background-color: #302f2fde;
	}

	.controls-row.hide {
		opacity: 0;
		pointer-events: none;
	}

	.progress{
		height: 25px;
	}

	.bottom-controls{
		height: 50px;  
	}

	.no-border {
		border: none;
	}

	button * {
		pointer-events: none;
	}


	.curto{    
		opacity: 0;
		max-width: 0; 
		transition: 0.5s;  
	}
	.expandido{
		opacity: 1;
		max-width: 100%;
		transition: 0.5s;
	}

	.aside-menu{
		position: absolute;
		height: 10%;
		width: 15%;
	}

</style>