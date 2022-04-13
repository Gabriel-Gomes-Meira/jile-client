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
                    v-show="selectedItems.length>0 && !isSaving">
                        <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
                    </v-btn>

                    <v-btn icon @click="performSelectAll"
                    style="z-index: 15;"
                    >
                        <v-icon v-text="'                    mdi-select-multiple'" />
                    </v-btn>

                    <v-btn icon @click="deliverToServer"
                    style="z-index: 15;"
                    color="primary"
                    :disabled="NewFileName.length==0?true:false"
                    v-show="selectedItems.length>0 && isSaving">
                        <v-icon>mdi-package-down</v-icon>
                    </v-btn>
                    
                    <v-text-field
                    class="mt-6"
                    dense
                    v-show="selectedItems.length>0 && isSaving"
                    v-model="NewFileName"
                    outlined
                    label="Nome do novo Arquivo"
                    ></v-text-field>

                    <v-spacer></v-spacer>
                    <v-btn icon 
                    :disabled="!history.length>0"
                    @click="topast"
                    v-show="selectedItems==0">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>

                    <v-btn icon 
                    :disabled="!future.length>0"
                    @click="todest"
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
                    :folderisItem="isSaving"
                    ref="explorer"
                    />     
                </v-row>         
            </v-container>

            <v-navigation-drawer v-model="favoriteDrawer"
            absolute temporary   
            right
            width="auto"
            class="l3">
                <v-list nav
                dense
                active-class="white--text text--accent-4">   
                    <!-- <v-list-item
                    @click="$emit('performFavorite')">
                        <v-list-item-icon >
                            <v-icon
                            v-text="'mdi-plus'"/>                        
                        </v-list-item-icon>
                        <v-list-item-title 
                        v-text="'Adicionar aos Favoritos'" />
                    </v-list-item>          -->

                    <v-list-item v-for="folder in FavoritesFolders" :key="'star_'+folder.name"
                    @click="performOpen(folder)">
                        <v-list-item-icon >
                            <v-icon
                            v-text="'mdi-folder-open'"/>                        
                        </v-list-item-icon>
                        <v-list-item-title 
                        v-text="folder.name" />
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>              
        </v-card>
    </v-dialog>
</template>

<script>
import explorer from "./vexplorer.vue"
import {mapGetters} from "vuex"
import axios from "axios"

export default {
    // name:'dialogexplorer'
    props:['show', 'filter', 'isSaving'],
    data: () => ({
        cols:3,
        selectedItems:[],
        history:[],
        future:[],
        Disks:[],
        isloading:false,
        NewFileName:"",
        favoriteDrawer: false,
    }),

    components:{
        explorer
    },

    computed:{
        ...mapGetters([
            'server', 'WKs', 'FavoritesFolders'
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
                if(name1>name2){
                    return 1
                } else if(name1.length<name2){
                    return -1
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
        },

        deliverToServer(){
            this.$emit('save', [this.selectedItems[0], this.NewFileName])
            this.$emit('close')
        },

        performSelectAll(){
            console.log(this.$refs.explorer)
            this.$refs.explorer.selectAllItems()
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