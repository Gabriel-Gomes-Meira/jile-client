<template>
    <!-- <v-container fluid fill-height
    class="l1"> -->
        <v-row class="fill-height justify-center pb-10"
         :class="!dialogMode?'':'pa-0 ma-0'">
            <v-col cols="12" class="pb-10">
                <v-card :height="!dialogMode?'88vh':'70vh'"
                class="l5 pa-1" elevation="0">
                    <v-card :height="!dialogMode?'87vh':'69vh'" elevation="0"
                    class="i1 Scrollable ">  

                    <v-container fill-height v-show="items.length==0">
                        <v-row >
                        <v-card-text class="text-center text-h3 l6--text"
                        light>
                        Nenhuma pasta ou disco escolhido.
                        </v-card-text>
                        </v-row>    
                    </v-container>       
                    
                    
                    <v-item-group :multiple="dialogMode" v-model="selectedItems" v-show="items.length>0"
                    @change="(arr) => $emit('updateSelection', arr)"
                    :max="folderisItem?0:items.length">
                        <v-container fluid :class="!dialogMode?'mb-8':''">
                            <v-slide-x-transition>
                            <v-row  v-show="!isloading">  
                                <v-col :cols="cols" v-for="f in filtered" :key="f.id"
                                style="height:100px" class="mt-2" >
                                    
                                    <v-card height="80px" outlined 
                                    @click="!folderisItem?$emit('open', f):selectFolder(f)"
                                    @dblclick="!folderisItem?'':$emit('open', f)"
                                    :color="folderisItem && selectedItems[0]==f?'primary':'backcard'"
                                    class="d-flex align-center justify-center pa-0 rounded-b-0"
                                    v-if="f.children"
                                    >
                                        <v-icon size="80"
                                        v-text="!f.disk?'mdi-folder':'mdi-harddisk'"></v-icon>
                                    </v-card> 
                                    
                                    <v-item v-slot="{ active, toggle }" v-else
                                    :value="f" 
                                    >
                                        <v-card height="80px" outlined class="d-flex align-center justify-center pa-0 rounded-b-0"        
                                        @click="toggle"
                                        @dblclick="!dialogMode?$emit('submit', f):''"        
                                        :color="active?'primary':'blackcard'"
                                        >  
                                            <v-badge right :color="types[f.extension]?types[f.extension]:''" overlap tile
                                            offset-x="70"
                                            offset-y="70">
                                            
                                            <span slot="badge">{{f.extension}}</span>
                                            <v-icon size="80"
                                            >mdi-file</v-icon>
                                            </v-badge>
                                        </v-card> 
                                    </v-item>

                                    <v-card outlined height="20" class="rounded-t-0 text-truncate text-caption text-center"
                                    >
                                    {{f.name}}
                                    </v-card>
                                </v-col>                                 
                            </v-row>            
                            </v-slide-x-transition>
                        </v-container>
                    </v-item-group>               
                    </v-card>   
                </v-card>
            </v-col>

            <!-- <v-hover v-slot="{ hover }">
                <v-btn color="#f77f00" fab absolute bottom 
                @click="$emit('performFavorite')"
                left            
                :style="`transition: 1s; bottom: 60px; ${hover?'left:15px':'left: -20px'}`"
                small
                elevation="2"
                v-show="items.length>0">
                    <v-icon
                    size="35"
                    v-text="isStared?'mdi-star-off-outline':'mdi-star-outline'"></v-icon>
                </v-btn>                            
            </v-hover>         -->
        </v-row>

    <!-- </v-container> -->
</template>

<script>
import * as types from "../Types"

export default {
    
    
    props:{
        items:{
            type:Array,
            default(){
                return []
            }
        },
        cols:{
            type:Number,
            default:2,
        },
        isloading:{
            type:Boolean,
            default:false
        },
        filter:{
            type:String,
            default:'all'
        },
        // isStared:{
        //     type:Boolean,
        //     default:false
        // },
        dialogMode:{
            type:Boolean,
            default:false
        },
        folderisItem:{
            type:Boolean,
            default:false
        }
    },

    data: () => ({
        selectedItems:0,  
        types:types.default.extensions,
        processors:types.default.processors
    }),

    computed:{
        filtered(){
            return this.items.filter((element) => {
                return element.children || this.filter == 'all' || this.filter == this.types[element.extension] || this.filter == this.processors[element.extension]
            })
        },
        allSelectable(){
            return this.filtered.filter((element) => {
                return !element.children;
            })
        }
    },

    methods:{
        selectFolder(folder){
            this.selectedItems = [];
            this.selectedItems[0] = folder;
            this.$emit('updateSelection', this.selectedItems)
        },
        
        selectAllItems(){                        

            if(this.selectedItems != this.allSelectable){
                this.selectedItems = this.allSelectable
            } else {
                this.selectedItems = []
                this.$forceUpdate()
            }
        }
    },
}
</script>

<style>
    .Scrollable{
        overflow-y: auto;      
    }
    .Scrollable::-webkit-scrollbar{        
        width: 8px;
    }
    .Scrollable::-webkit-scrollbar-track{
        /* margin-top: 50px; */
        background-color: #3b3b3c18;
        border-radius: 0px;
    }
    .Scrollable::-webkit-scrollbar-thumb{
        background: #28282ce2;
        border: solid #74758400;
        border-radius: 2px;
    }
</style>