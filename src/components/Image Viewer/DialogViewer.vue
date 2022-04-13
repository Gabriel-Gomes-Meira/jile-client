<template>
        <v-dialog v-model="active"
        fullscreen
        persistent overlay            
        transition="dialog-transition"             
        >
            <v-card class="rounded-0 pa-0 ma-0" height="100vh" >
                <v-toolbar color="backcard" dense>
                    <v-btn-toggle
                    v-model="vizu"
                    mandatory
                    @change="test"
                    >
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }"
                            >
                                <v-btn
                                color="white"
                                dark                                
                                v-on="{tooltip}"
                                icon
                                
                                >
                                    <v-icon size="20"
                                    v-text="'mdi-arrow-expand-all'"/>
                                </v-btn>
                            </template>
                            <span>Encaixar Ambos</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }"
                            >
                                <v-btn
                                color="white"
                                dark                                
                                v-on="{tooltip}"
                                icon                                
                                >
                                    <v-icon size="20"
                                    v-text="'mdi-arrow-expand-horizontal'"/>
                                </v-btn>
                            </template>
                            <span>Encaixar Largura</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ on: tooltip }"
                            >
                                <v-btn
                                color="white"
                                dark                                
                                v-on="{tooltip}"
                                icon                                
                                >
                                    <v-icon size="20"
                                    v-text="'mdi-arrow-expand-vertical'"/>
                                </v-btn>
                            </template>
                            <span>Encaixar Altura</span>
                        </v-tooltip>
                   
                    </v-btn-toggle>
                    <v-spacer></v-spacer>
                    
                        <v-btn color="white" icon
                        @click="$emit('close')">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    
                </v-toolbar>
        
                <v-carousel height="93vh" hide-delimiters
                v-model="seleIndex" :show-arrows="outZoom && controlsVisible" 
                @change="activingSlide('zoomer_'+viewer_id+'('+seleIndex+')')"
                class="pa-0 ma-0 ">
                 
                    <v-carousel-item v-if="List.length<=0
                    ">
                        <v-sheet
                        color="backcard"
                        height="100%"
                        tile >
                            <v-row 
                            class="fill-height d-flex flex-column"
                            align="center"
                            justify="center" >                          
                                <v-icon size="108" color="l5">mdi-file-image-outline</v-icon>
                                <p class="l6--text mt-2">
                                    Não há arquivos para visualizar.
                                </p>                        
                            </v-row>                                                         
                        </v-sheet>
                    </v-carousel-item>
                
                    <v-carousel-item v-for="(image, index) in List" :key="index" class="pa-0 
                    ma-0 Scrollabley" :ref="'fimage_'+viewer_id"
                    >                                  
                            <!-- <v-zoomer  
                            :ref="'zoomer_'+viewer_id+'('+index+')'"
                            :doubleClickToZoom="true"
                            mouseWheelToZoom="false"
                            v-if="vizu==0"
                            
                            > 
                                
                                <img @load="$emit('load','zoomer_'+viewer_id+'('+index+')')"               
                                :src="`http://${server}/files/?path=${image.path}`"
                                class="img-slide-zoomer"
                                :style="imgstyle">
                            </v-zoomer>  -->
                            
                            <!-- class="d-flex fill-height justify-center align-center" -->
                            <div
                            style="display: flex;
                            max-height: 100%;
                            max-width: inherit;
                            justify-content: center;
                            overflow:auto;"
                            >
                                <img
                                @dblclick="arimg==2?arimg=1:arimg+=0.25"
                                :src="`http://${server}/files/?path=${image.path}`"
                                class="img-slide-zoomer"                            
                                :style="imgstyle"
                                >                     
                            </div>                           
                            
                            
                    </v-carousel-item>
                </v-carousel>                            
            </v-card>
        </v-dialog>
</template>

<script>
export default {
    name:"DialogViewer",
    props:["server", "List", "viewer_id", "outZoom", "controlsVisible", "seleIndex", "active"],

    computed:{
        imgstyle(){
            var stl =  `cursor: pointer;`
            if(this.vizu == 0){
                return stl+'width: inherit; height:100%; object-fit: contain; '
            } else {
                
                return `${stl}${this.vizu==2?'height: 100%;':'width: 100%;'}`
            }
        },

        scrollability(){
            if(this.vizu>0){
                return this.vizu==1?'overflow-y: scroll':'overflow-x: auto';
            }
        }
    },

    data(){
        return {
          vizu:0,
          arimg:1
        }
    },

    methods:{
        test(value){
            console.log(value)
            var isz = document.querySelectorAll(".img-slide-zoomer")
            isz[1].parentElement.classList.add("Scrollable")
            if (value == 1) {
                // var scrable = document.getElementById('fimage_'+this.viewer_id)
                isz[1].parentElement.style.overflowX = 'hidden'
                isz[1].parentElement.style.overflowY = 'auto'
                // scrable.firstChild.style.overflowX = 'hidden'
                // scrable.firstChild.style.overflowY = 'auto'
                // console.log(scrable.children)
            } else if (value == 2) {
                // var scrable = document.getElementById('fimage_'+this.viewer_id)
                isz[1].parentElement.style.overflowX = 'auto'
                isz[1].parentElement.style.overflowY = 'hidden'
                // scrable.firstChild.style.overflowY = 'hidden'
                // scrable.firstChild.style.overflowX = 'auto'
            } else {
                isz[1].parentElement.style.overflowX = 'hidden'
                isz[1].parentElement.style.overflowY = 'hidden'
            }
            // console.log(isz)
            // isz.forEach((element) => {
            //     console.log(element.parentElement)
            // })            
        }
    }

}
</script>

<style>

    /* .img-slide-zoomer{
        width: 100%; 
        height: 100%;
        object-fit: contain; 
        cursor: pointer;
    } */

    .Scrollable{
        /* overflow-y: scroll;
        overflow-x: scroll; */
        /* overflow-x: hidden;
        overflow-y: hidden; */
        
    }

    .Scrollable::-webkit-scrollbar{        
        width: 8px;
    }
    .Scrollable::-webkit-scrollbar-track{
        /* margin-top: 2px; */
        /* background-color: #c4c4cd7a; */
        background-color: transparent;
        border-radius: 0px;
    }
    .Scrollable::-webkit-scrollbar-thumb{
        background: #373738;
        border: solid #fcfdff00;
        border-radius: 2px;
    }

</style>