<template>
    <div style="width: 100%; height:100%" @contextmenu="showMenu">

        <v-row class="top-controls" v-show="outZoom">
            <v-col cols="3">
                <v-btn class="mr-2"
                color="l4" small outlined
                @click="$emit('openExplorer')">
                <v-icon>mdi-folder-home-outline</v-icon>
                </v-btn>                 
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="9" 
            class="video-title-name">
                <p class="l5--text text-truncate text-right">
                    {{List[0]?List[seleIndex].name:'Sem arquivo'}}
                </p>
            </v-col>
        </v-row>

        

        <v-carousel height="inherit" hide-delimiters @
        v-model="seleIndex" :show-arrows="outZoom && controlsVisible" 
        @change="activingSlide('zoomer_'+viewer_id+'('+seleIndex+')')">
            <v-carousel-item v-if="List.length<=0 || loadingFiles">
                <v-sheet
                color="backcard"
                height="100%"
                tile >
                    <v-row 
                    class="fill-height d-flex flex-column"
                    align="center"
                    justify="center" v-if="!loadingFiles">                          
                        <v-icon size="108" color="l5">mdi-file-image-outline</v-icon>
                        <p class="l6--text mt-2">
                            Não há arquivos para visualizar.
                        </p>                        
                    </v-row>

                    <v-row 
                    class="fill-height d-flex flex-column"
                    align="center"
                    justify="center" v-else>  
                        <div class="text-center">
                            <v-progress-circular
                            indeterminate
                            color="l5"
                            ></v-progress-circular>
                            <p class="l6--text">
                                Carregando arquivos salvos...
                            </p>
                        </div>
                    </v-row>                                                           
                </v-sheet>
            </v-carousel-item>
        
            <v-carousel-item v-for="(image, index) in List" :key="index">                                  
                    <v-zoomer style="width: 100%; height: 100%;" :ref="'zoomer_'+viewer_id+'('+index+')'">
                        <img @load="activingSlide('zoomer_'+viewer_id+'('+index+')')"               
                        :src="`http://${server}/files/?path=${image.path}`"
                        class="img-slide-zoomer">
                    </v-zoomer>
            </v-carousel-item>
        </v-carousel>

        <div class="paginator" v-show="outZoom" v-if="List.length>0 && paginationVisible && !loadingFiles">
            <pagina-swip :Images="List"
            @choosedImage="changeSlide"></pagina-swip>            
        </div>

        <v-menu tile dark       
        v-model="popup.active"
        :position-x="popup.x"
        :position-y="popup.y"
        transition="scale-transition"
        :close-on-content-click="false">        
            <v-list dense
            color="backcard">  
                <v-list-item-group
                class="px-2"
                active-class="white--text text--accent-4">
                    <v-list-item class="mb-2">
                        <v-list-item-icon>
                            <v-btn color="l5" outlined x-small @click="paginationVisible = !paginationVisible"> 
                                <v-icon color="l5"> {{paginationVisible?'mdi-eye-off':'mdi-eye'}} </v-icon>
                            </v-btn>       
                        </v-list-item-icon>
                        <v-list-item-title
                        class="l6--text"> Paginação </v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-icon>
                            <v-btn color="l5" outlined x-small @click="controlsVisible = !controlsVisible">
                                <v-icon> {{controlsVisible?'mdi-eye-off':'mdi-eye'}} </v-icon>
                            </v-btn>                            
                        </v-list-item-icon>
                        <v-list-item-title
                        class="l6--text"> Controles </v-list-item-title>
                    </v-list-item>                
                </v-list-item-group>
            </v-list>		
        </v-menu>   

    </div>

</template>

<script>
import { mapGetters } from 'vuex';
import PaginaSwip from './PaginaSwip.vue';


export default {
    
    props:['List', 'viewer_id', 'loadingFiles'],

    data(){
        return{
            seleIndex:0,            
            paginationVisible:true,  
            controlsVisible:false,
            popup:{ active:false, x:0, y:0},        
            slideActive:{},                  
        }
    },

    components:{
       PaginaSwip
    },   
    
    computed:{
        outZoom(){ 
            if(this.slideActive[0]) {                     
                return this.slideActive[0].scale<=1;
            } else {
                return true                                                      
            }
        },
        
        ...mapGetters([
            'server'
        ])        
    },
    
    
    created(){
        // if(this.contentsPresets[this.viewer_id].seleIndex) {        
        //     this.paginationVisible = this.contentsPresets[this.viewer_id].paginationVisible
        //     this.controlsVisible = this.contentsPresets[this.viewer_id].controlsVisible
        // }
    },

    mounted(){
        document.addEventListener('keydown', (event)=> {
            const { code } = event;     
            
            const handleKeyBoard = {				
				ArrowLeft(father){
                    father.handlePrev();
				},
				ArrowRight(father){
					father.handleNext();
				}
			}  
			 			
			if(handleKeyBoard[code]) {
				handleKeyBoard[code](this)
			}
        });
    },



    methods:{

        loadPosition(){
            // this.seleIndex = this.contentsPresets[this.viewer_id].seleIndex
        },

        saveState(){            
            // this.contentsPresets[this.viewer_id].seleIndex = this.seleIndex            
            // this.contentsPresets[this.viewer_id].paginationVisible = this.paginationVisible
            // this.contentsPresets[this.viewer_id].controlsVisible = this.controlsVisible
            // this.$store.dispatch('saveContent')
        },

        handleNext(){
            if(this.seleIndex == this.List.length-1) {
                this.seleIndex = 0
            } else {
                this.seleIndex ++
            }

            this.activingSlide('zoomer_'+this.viewer_id+'('+this.seleIndex+')')        
        },

        handlePrev(){
            if(this.seleIndex == 0) {
                this.seleIndex = this.List.length-1
            } else {
                this.seleIndex --
            }

            this.activingSlide('zoomer_'+this.viewer_id+'('+this.seleIndex+')')
        },
        
        changeSlide(index){            
            if(index == undefined) {
                return
            }

            if(index!=this.seleIndex) {                
                this.seleIndex = index 
                this.activingSlide('zoomer_'+this.viewer_id+'('+this.seleIndex+')')
            }                          
        },

        activingSlide(refere) {   
            // console.log(refere) 
            if(this.$refs[refere]) {
                this.slideActive = this.$refs[refere]
            }
            this.saveState();                        
        },

        showMenu(e){
			e.preventDefault()        
			this.popup.active = false
			
            this.popup.x = e.clientX
            this.popup.y = e.clientY				
			
			this.$nextTick(() => {
				this.popup.active = true
			})
		}
    },
    


}
</script>

<style scoped>
    .paginator {
        height: 30%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.174);
        /* padding-bottom: 5%; */
        z-index: 100;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
    }

    .img-slide-zoomer{
        width: 100%; 
        height: 100%;
        object-fit: contain; 
        cursor: pointer;
    }

    .top-controls {
		right: 0;
		left: 0;
		padding: 10px;
		position: absolute;
		top: 0;
        height: 60px;
		display: flex;
		transition: all 0.2s ease;
		background-color: rgba(0, 0, 0, 0.174);
		z-index: 1;
	} 

    

</style>