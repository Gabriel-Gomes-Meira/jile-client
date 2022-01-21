<template>
  <v-container fluid fill-height
        class="Background l1">
            <v-row class="fill-height pb-10 justify-center">
                <v-col cols="12" class="pb-10">
                    <v-card height="88vh"
                    class="l5 pa-1" elevation="0">
                        <v-card height="87vh" elevation="0"
                        class="i1 Scrollable ">  

                        <v-container fill-height v-show="items.length==0">
                            <v-row >
                            <v-card-text class="text-center text-h3 l6--text"
                            light>
                            Nenhuma pasta ou disco escolhido.
                            </v-card-text>
                            </v-row>    
                        </v-container>       
                        
                        
                        <v-item-group multiple v-model="selectedItems" v-show="items.length>0"
                        @change="(arr) => $emit('updateSelection', arr)">
                            <v-container fluid class="mb-8">
                                <v-slide-x-transition>
                                <v-row  v-show="!isloading">  
                                        <v-col :cols="cols" v-for="f in items" :key="f.id"
                                        style="height:100px" class="mt-2" >
                                            
                                            <v-card height="80px" outlined 
                                            @click="$emit('open', f)"
                                            class="d-flex align-center justify-center pa-0 rounded-b-0"
                                            v-if="f.children"
                                            >
                                                <v-icon size="80">mdi-folder</v-icon>
                                            </v-card> 
                                            
                                            <v-item v-slot="{ active, toggle }" v-else
                                            :value="f">
                                                <v-card height="80px" outlined class="d-flex align-center justify-center pa-0 rounded-b-0"        
                                                @click="toggle"        
                                                :color="active?'primary':'blackcard'"
                                                >                                        
                                                    <v-badge right :color="f.extension.substring(1)" overlap tile
                                                    offset-x="70"
                                                    offset-y="70">
                                                    
                                                    <span slot="badge">{{f.extension}}</span>
                                                    <v-icon size="80"
                                                    >mdi-file</v-icon>
                                                    </v-badge>
                                                </v-card> 
                                            </v-item>

                                            <v-card outlined height="20" class="rounded-t-0 text-truncate text-caption text-center">
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
            </v-row>
                
        </v-container>
</template>

<script>
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
        }
    },

    data: () => ({
        selectedItems:0,  
    }),

    methods:{
        
    }
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