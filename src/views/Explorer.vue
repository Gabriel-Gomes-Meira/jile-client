<template>
  <div>
        <layout 
        :Title="'Jile Client'"
        :server="server"
        :selectedItems="selectedItems.length"
        @open="setItems"  
        @submit="deliverToWork"
        :havepast="history.length>0"
        @back="topast"
        :havedest="future.length>0"
        @front="todest"
        @clearDest="future = []"
        />                

        <explorer
        :items="lastOpenFolder?lastOpenFolder.children:[]"
        @open="getChilds"
        :isloading="isloading"
        @updateSelection="updateSelection"
        :filter="filter"
        :isStared="isFavorite"
        @performFavorite="performFavorite"
        /> 

        <v-item-group style="position: absolute!important; top:0; right:0;" v-model="filter" mandatory>
            <v-item v-slot="{ toggle}" :value="type.type"
            v-for="(type, index) in bottom" :key="type.type">
                <v-hover v-slot="{ hover }"                
                >
                    <v-card :key="index" @click="toggle"
                    :color="type.type"
                    style="position: relative!important;"
                    :style="`top:${200+index}px; transition: 1s; 
                    ${hover?'width: 170px;':'width: 155px;'}
                    ${hover?'right: 0px;':'right: -108px;'}`" 
                    
                    class="pa-0 ma-0 rounded-r-0 rounded-l-pill mb-2" 
                    >
                    <!-- ${hover?'':'right:-0px'}; -->
                        <v-card-text >
                            <v-icon v-text="type.icon" class="mr-5"></v-icon>

                            <span class="white--text right-text"
                            > {{ type.name }} </span>
                        </v-card-text>
                    </v-card>
                </v-hover>
            </v-item>
        </v-item-group>
  </div>
</template>

<script>
import ExplorerLayot from "../components/Explorer"
import vexplorer from "../components/Explorer/vexplorer.vue"
// import * as types from "../components/Types"
import {mapGetters} from "vuex"
import axios from "axios";

export default {

    data: () => ({                 
        history:[],
        future:[],
        isloading:false,
        selectedItems:[],
        filter:'',
        bottom:[
            {
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
        explorer:vexplorer
    },    

    computed:{
        ...mapGetters([
            'server', 'FavoritesFolders'
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
                        this.setItems(obj)
                    }, 500);              
                    setTimeout(() => {                        
                        this.isloading = false;    
                    }, 1000);
                })
                .catch(error => {                                    
            });            
        },  
        
        updateSelection(arr){
            this.selectedItems = arr;
        },
        
        deliverToWork(){
            this.$store.dispatch('saveAppState', ['toWorkspace', this.selectedItems])                        
            this.$router.push('Work')
        },

        topast(){
            this.future.unshift(this.history.pop())
            this.setItems(this.history.pop())            
        },

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
        }
        
    },

    created(){
        if(!this.server){
            this.$router.push('/')
        }              
    },

    mounted(){        
    }
}
</script>
