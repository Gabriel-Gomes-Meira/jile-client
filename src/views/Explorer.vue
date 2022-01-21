<template>
  <div>
        <layout 
        :Title="'Jile Client'"
        :server="server"
        :selectedItems="selectedItems.length"
        @open="setItems"  
        @submit="deliverToWork"
        />
        <!-- :Cells="items"
        :getChilds="getChilds" -->
        <!-- @takeMeChilds="getChilds" -->

        <explorer
        :items="lastOpenFolder?lastOpenFolder.children:[]"
        @open="getChilds"
        :isloading="isloading"
        @updateSelection="updateSelection"
        />            
        
  </div>
</template>

<script>
import ExplorerLayot from "../components/Explorer"
import vexplorer from "../components/Explorer/vexplorer.vue"

import {mapGetters} from "vuex"
import axios from "axios";

export default {

    data: () => ({        
        lastOpenFolder:{}, 
        isloading:false,
        selectedItems:[],
    }),

    components:{
        layout:ExplorerLayot,
        explorer:vexplorer
    },    

    computed:{
        ...mapGetters([
            'server'
        ]),        
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
