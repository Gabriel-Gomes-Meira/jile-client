<template>
    <v-app
    background-color="primary"
    >           
        <layout 
        :Title="'Jile Client'"
        :server="server"
        :Folders="Disks"
        @open="setItems"          
        :havepast="history.length>0"
        @back="topast"
        :havedest="future.length>0"
        @front="todest"
        @clearDest="future = []"
        @tabchanged="tabchanged"
        :SelectedTab="SelectedWS"
        @performFavorite="performFavorite"
        />                
           
        <v-container fluid fill-height
        class="l1">
            
            <v-slide-x-transition>
                <v-item-group 
                style="position: absolute!important; 
                top:-300px; right:0; z-index:1;"
                
                v-model="filter" mandatory 
                v-show="!hasSelected"
                >
                    <v-item v-slot="{ toggle}" :value="type.type"
                    v-for="(type, index) in bottom" :key="type.type">
                        <v-hover v-slot="{ hover }"                
                        >
                            <v-card :key="index" @click="toggle"
                            :color="type.type"
                            style="position: relative!important;"
                            :style="`top:${500+index}px; transition: 1s; 
                            ${hover?'width: 170px;':'width: 155px;'}
                            ${hover?'right: 0px;':'right: -108px;'}`" 
                            
                            class="pa-0 ma-0 rounded-r-0 rounded-l-pill mb-2" 
                            >                        
                                <v-card-text >
                                    <v-icon v-text="type.icon" class="mr-5"></v-icon>

                                    <span class="white--text right-text"
                                    > {{ type.name }} </span>
                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </v-item>
                </v-item-group>
            </v-slide-x-transition>

            <v-tabs-items v-model="SelectedTab"
            class="l1"
            :class="SelectedTab?'Scrollablex':''"
            style="width: 100vw"
            >
                <v-tab-item :value="0"
                width="100%">
                    <explorer
                    class="explorer"
                    :items="lastOpenFolder?lastOpenFolder.children:[]"
                    @open="getChilds"
                    @submit="deliverToWork"
                    :isloading="isloading"
                    :filter="filter"
                    />                     
                    <!-- :isStared="isFavorite"
                     -->
                    <!-- v-show="!hasSelected" -->                                        
                </v-tab-item>

                <v-tab-item
                v-for="(WK, index) in WKs.wks"
                :key="index"
                :value="index+1"
                class="Contentable "
                >
                <!-- @contextmenu.prevent="showMenuWorkSpace" -->
                        <desk 
                        class="Background"
                        
                        :WK="WK" 
                        @closeWC="(arg) => WKs.deleteWC(WK, arg)" />                                        
                </v-tab-item>

                <!-- <v-tab-item :value="1001">
                    
                    <ProtospaceVue />                              
                                  
                </v-tab-item>       -->
            </v-tabs-items>                

            
        </v-container>
    </v-app>
</template>

<script>
import ProtospaceVue from "../components/WorkSpace/Protospace.vue"
import ExplorerLayot from "../components/Explorer"
import vexplorer from "../components/Explorer/vexplorer.vue"
import Base from "../components/WorkSpace/Space.vue"
import {mapGetters} from "vuex"
import axios from "axios";

import * as types from "../components/Types"

export default {

    data: () => ({                 
        history:[],
        future:[],
        Disks:[],
        isloading:false,        
        SelectedWS:undefined,
        filter:'all',
        menu:{
            active:false,
            x:0,
            y:0
        },
        bottom:[
            {
                type:"all",
                icon:"mdi-archive",
                name:"Tudo"
            },{
                type:"video",
                icon:"mdi-television-play",
                name:"Video"
            },{
                type:"image",
                icon:"mdi-image",
                name:"Imagem"
            },{
                type:"audio",
                icon:"mdi-music-note",
                name:"Música"
            },{
                type:"text",
                icon:"mdi-book",
                name:"Texto"
            },
        ]
    }),

    components:{
        layout:ExplorerLayot,
        explorer:vexplorer,
        desk:Base,     
        ProtospaceVue   
    },    

    computed:{
        ...mapGetters([
            'server', 'FavoritesFolders','WKs'
        ]),     
        lastOpenFolder:{
            get(){
                return this.history.length>0?this.history[this.history.length-1]:{}
            },
            set(value){
                this.history.push(value)
            }
        },
        isFavorite(){
            return this.FavoritesFolders.findIndex(element => element.path == this.lastOpenFolder.path) != -1
        },
        hasSelected(){
            return this.SelectedWS || this.SelectedWS>=0
        },
        SelectedTab(){
            if(this.hasSelected){
                return this.SelectedWS+1
            } else {
                return 0;
            }
        }
    },

    methods:{   
        setItems(obj){
            if(obj != this.lastOpenFolder){
                this.isloading = true;   
                setTimeout(() => {
                    this.lastOpenFolder = obj;
                }, 500);
                
                setTimeout(() => {
                    this.isloading = false;    
                }, 1000);
            }
        },

        getChilds(obj) {  
            this.isloading = true;    
            this.future = []                  
            axios.get(`http://${this.server}?path=${obj.path}`)
                .then(response => {      
                    setTimeout(() => {
                        obj.children = response.data
                        obj.children.sort((a,b)=>{                            
                            
                            if(!a.children && !b.children){
                                return this.intrisictOrder(a, b);
                            } else {
                                return 0             
                            }            
                        })
                        this.setItems(obj)
                    }, 500);              
                    setTimeout(() => {                        
                        this.isloading = false;    
                    }, 1000);
                })
                .catch(error => {                                    
            });            
        },

        intrisictOrder(a, b){
            var name1 = a.name.substring(0,a.name.lastIndexOf(a.extension))                                                                
            var name2 = b.name.substring(0,b.name.lastIndexOf(b.extension)) 
            
            if(name1.length>=name2.length){                
                for (let index = 0; index < name1.length; index++) {                    

                    if(name1.charAt(index) > name2.charAt(index)){
                        return 1;
                    } else if (name2.length > name1.length && name1.charAt(index) < name2.charAt(index) ) {
                        return -1;
                    } 
                }
            } else {
                // .includes() diferenciado, avalio se as strings são bem parecidas
                var countEquals = 0;
                for (let index = 0; index < name2.length; index++) {                    

                    if(name2.charAt(index) == name1.charAt(index)) {
                        countEquals ++                        
                    }                    
                }

                if(countEquals*100/name2.length > 80){
                    return -1
                }

            }

            return 0;
        },

        getDisks(){
            axios.get(`http://${this.server}/disks/`).then((response) =>{                
                this.Disks = response.data
                this.lastOpenFolder.children = response.data
            })
        },          
        
        deliverToWork(content){
                        
            this.WKs.createWS('Workspace '+
                                this.WKs.size)
            var WC = this.WKs.createWC(this.WKs.size-1,
                types.default.processors[content.extension])

            this.WKs.setContents(WC, [content])                        

            this.SelectedWS = this.WKs.size-1
        },

        //retrocede no histórico de folders entrados
        topast(){
            this.future.unshift(this.history.pop())
            this.setItems(this.history.pop())            
        },

        //avança no histórico de folders entrados
        todest(){
            this.history.push(this.future.shift())
            this.setItems(this.history.pop())
        },

        performFavorite(){
            if(this.isFavorite){
                this.FavoritesFolders.splice(
                    this.FavoritesFolders.findIndex(element => element.path == this.lastOpenFolder.path), 1)
            } else {
                this.FavoritesFolders.push(this.lastOpenFolder)
                this.$store.dispatch('saveAppState', 
                                    ['FavoritesFolders', this.FavoritesFolders])
            }
        },

        tabchanged(index){               
            this.SelectedWS = index                      
        },
        
        
    },

    created(){
        if(!this.server){
            this.$router.push('/')
        }              
    },

    mounted(){   
        if(this.server){
            this.getDisks();                      
        }     
    }
}
</script>

<style>
    .Background{    
        max-width: 1vw!important;
        height: inherit;    
    }
    
    .Contentable{
        height:90vh;     
        min-width: 1000vw;   
        transition: 1s;
    }
    .explorer{
        transition: 1s;      
    }

    .Scrollablex{
        overflow-y:hidden;
        overflow-x: scroll;
    }
    .Scrollablex::-webkit-scrollbar{        
        width: 8px;
    }
    .Scrollablex::-webkit-scrollbar-track{
        margin-top: 50px;
        background-color: #3b3b3c18;
        border-radius: 0px;
    }
    .Scrollablex::-webkit-scrollbar-thumb{
        background: #28282ce2;
        border: solid #74758400;
        border-radius: 2px;
    }
</style>








!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
vexplorer terá modo "non-dialog" e "dialog" para performar as requisições de busca de arquivos.
A mudança de plano se dá pelo fato de ser mais cômodo e adequado para UX se o explorer estiver junto ao workspace.
Handler irá prover a comunicação.

Apartir de agora também, o explorer abri um determinado tipo de arquivo com um duplo click, em um workspace criado dinâmicamente.

