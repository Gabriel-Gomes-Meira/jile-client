<template>
    <v-dialog
    v-model="show"
    scrollable         
    width="80vw"
    transition="dialog-transition"
    persistent
    > 
        
        <v-card height="80vh"
        color="l1" style="overflow-y:hidden;">
            <v-container >
                <v-row>                    
                    <v-toolbar 
                    :color="selectedItems.length>0?'black':'l2'" dense>

                    <v-btn icon @click="deliverToWork"
                    style="z-index: 15;"
                    v-show="selectedItems.length>0">
                        <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>
                    <v-btn icon 
                    :disabled="!history.length>0"
                    @click="$emit('back')"
                    v-show="selectedItems==0">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>

                    <v-btn icon 
                    :disabled="!future.length>0"
                    @click="$emit('front')"
                    v-show="selectedItems.length==0">
                        <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>

                    <v-menu offset-y>
                        <template v-slot:activator="{on}">
                            <v-btn icon  
                            v-on="on"
                            v-show="selectedItems.length==0">
                            <v-icon>mdi-view-module</v-icon>
                            </v-btn>                
                        </template>
                        <v-card>
                            <v-btn v-for="i in 4" :key="i+'b'" @click="cols = i"
                            small>
                            {{i}}
                            </v-btn>                
                        </v-card>
                    </v-menu>

                    <v-btn color="" icon
                    large @click="$emit('close')"
                    >
                        <v-icon>
                            mdi-close-thick
                        </v-icon>
                    </v-btn>
                </v-toolbar>
                </v-row>
                
                <v-row>
                    <explorer
                    class="explorer"
                    :items="lastOpenFolder?lastOpenFolder.children:[]"
                    @open="getChilds"
                    @updateSelection="updateSelection"                    
                    :isloading="isloading"
                    :filter="filter"
                    :dialogMode="true"
                    :cols="cols"
                    />     
                </v-row>         
            </v-container>            
        </v-card>
    </v-dialog>
</template>

<script>
import explorer from "./vexplorer.vue"
import {mapGetters} from "vuex"
import axios from "axios"

export default {
    // name:'dialogexplorer'
    props:['show', 'filter'],
    data: () => ({
        cols:3,
        selectedItems:[],
        history:[],
        future:[],
        Disks:[],
        isloading:false,
    }),

    components:{
        explorer
    },

    computed:{
        ...mapGetters([
            'server', 'WKs'
        ]),     
        lastOpenFolder:{
            get(){
                return this.history.length>0?this.history[this.history.length-1]:{}
            },
            set(value){
                this.history.push(value)
            }
        },
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

        getDisks(){
            axios.get(`http://${this.server}/disks/`).then((response) =>{                
                this.Disks = response.data
                this.lastOpenFolder.children = response.data
            })
        },

        updateSelection(arr){
            this.selectedItems = arr;
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
    
        updateSelection(arr){
            this.selectedItems = arr;
        },

        deliverToWork(){
            this.$emit('submit', this.selectedItems)
            this.$emit('close')
        }
    },

    mounted(){   
        if(this.server){
            this.getDisks();                      
        }     
    }
}
</script>

<style scoped>
    /* .explorer{
        width: 100%;
        height: 100%;
    } */
</style>