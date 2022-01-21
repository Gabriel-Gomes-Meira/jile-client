<template>
    <div>
        
        <v-app-bar        
        dense class="elevation-0"
        :color="selectedItems>0?'black':'l3'">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>

            <v-btn icon disabled v-if="!selectedItems>0">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <v-btn icon  v-if="!selectedItems>0"
                    v-on="on">
                    <v-icon>mdi-view-module</v-icon>
                    </v-btn>                
                </template>
                <v-card>
                    <v-btn v-for="i in 4" :key="i+'b'" @click="$emit('defCol')"
                    small>
                    {{i}}
                    </v-btn>                
                </v-card>
            </v-menu>
              
            <v-btn icon v-if="!selectedItems>0"
            :disabled="!havepast"
            @click="$emit('back')">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-btn icon v-if="!selectedItems>0"
            :disabled="!havedest"
            @click="$emit('front')">
                <v-icon>mdi-arrow-right</v-icon>
            </v-btn>

            <v-btn icon v-if="!selectedItems>0"
            @click="favoriteDrawer = !favoriteDrawer"
            >
                <v-icon>mdi-folder-star-multiple</v-icon>
            </v-btn>

            <v-btn icon v-else @click="$emit('submit')">
                <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
            </v-btn>
            
            <v-toolbar-title class="ml-6">
                {{selectedItems>0?
                `${selectedItems} mídias selecionadas...`
                :Title}}
            </v-toolbar-title>                                  
        </v-app-bar>

        <v-navigation-drawer v-model="favoriteDrawer"
        absolute temporary   
        right
        width="auto"
        class="l3">
            <v-list nav
            dense
            active-class="white--text text--accent-4">            
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
        
        <v-navigation-drawer v-model="drawer"
        absolute temporary   
        width="auto"    
        class="l3 scrollable-x">
        
            <v-list nav
            dense
            active-class="white--text text--accent-4">            
            
                <v-list-item            
                to="/Work">
                    <v-list-item-icon>
                        <v-icon>mdi-home-analytics</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>WorkSpace</v-list-item-title>
                </v-list-item>            

                <v-expansion-panels focusable flat
                style="max-width:250px;min-width:250px"
                >
                    <v-expansion-panel class="l3">                    
                        <v-expansion-panel-header class="px-2">  
                            <div class="text-left">                            
                                <v-icon left>mdi-format-paint</v-icon>                        
                            </div>
                            <span class="text-left mr-13">Temas</span>
                            <v-spacer></v-spacer>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content 
                        color="grey lighten-2" >
                            <v-row
                            >
                                <v-col
                                v-for="(theme, index) in themes"
                                cols="4"
                                :key="index"
                                class="pt-5 ">
                                    <v-btn outlined
                                    :color="theme.maincolor"    
                                    @click="changeTheme(theme.name)" 
                                    style="border:none">
                                        <v-icon size="40">mdi-circle</v-icon>
                                    </v-btn>                            
                                </v-col>                        
                            </v-row>                    
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>


                
                <!-- <v-list-item            
                @click="saveState">
                    <v-list-item-icon>
                    <v-icon>mdi-content-save-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Salvar</v-list-item-title>
                </v-list-item> -->                
            </v-list>            
            <v-treeview
                v-model="tree"                    
                :items="Folders"
                :load-children="getChilds"                
                activatable                
                item-key="name"
                open-on-click                
            >
                <template v-slot:prepend="{ item, open }">
                <v-icon v-if="item.children && !item.disk">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else-if="item.disk" size="24">
                    mdi-harddisk
                </v-icon>
                <v-icon v-else>
                    <!-- {{ files[item.file] }} -->
                    mdi-file
                </v-icon>
                </template>
                <template v-slot:label="{item}">
                    <v-list-item-title class="text-truncate"
                    @click="performOpen(item)">
                        {{item.name}} 
                    </v-list-item-title>
                </template>
            </v-treeview>                        
        </v-navigation-drawer>

        

        

        
        <v-snackbar
        v-model="dialog.snack">
            {{ message }}
            <template v-slot:action>
                <v-btn
                color="red"
                text                
                @click="dialog.snack = false">
                Fechar
                </v-btn>
            </template>
        </v-snackbar>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from "axios"
import Trunquee from "../Trunquee.vue"


export default {
    name:"Explorerlayout",

    props:['Title', 'server', 'selectedItems', 'havepast', 'havedest'],

    data(){
        return{
            drawer:false,            
            message:'',
            dialog:{
                snack:false
            },            
            tree:[],
            Folders:[],
            favoriteDrawer:false,
            themes:[
                {name:'gray', maincolor:'#4A6471'},
                {name:'darkblue', maincolor:'#005E9A'},
                {name:'darkgreen', maincolor:'#3D794C'},
                {name:'darkyellow', maincolor:'#FFD600'},
                {name:'darkambar', maincolor:'#C85700'},
                {name:'vinne', maincolor:'#880E4F'},
                {name:'darkred', maincolor:'#8E1616'}
            ],            
        }
    },

    components:{ 
        Trunquee       
    },

    computed: {
        ...mapGetters([
        'theme', 'FavoritesFolders'
    ]),
        address(){
            if(this.server){
                return `http://${this.server}/`;
            } 
        }
    },

    methods:{

        // saveState(){
        //     this.$store.dispatch('saveState').then((message) =>{
        //         this.message = message
        //         this.dialog.snack = true
        //     })
        // },                

        changeTheme(value){
            this.$store.dispatch('saveAppState', ['currenttheme',value]).then(()=>{                            
                for (const lay in this.theme) {                           
                    this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
                }
            })
        },    

        getDisks(){
            axios.get(`${this.address}disks/`).then((response) =>{                
                this.Folders = response.data
            })
        },

        getChilds(item) {            
            axios.get(`${this.address}?path=${item.path}`)
                .then(response => {                    
                    item.children=(response.data)
                })
                .catch(error => {                                    
            });            
        },  

        performOpen(item){
            if(item.children){
                this.$emit('clearDest')
                this.$emit('open', item)                
            } 
        }
     
    },

    created() {  

        this.$store.dispatch('loadState').then(()=>{            
            for (const lay in this.theme) {                
            this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
            }
        });                              
    },

    mounted(){   
        if(this.server){
            this.getDisks();                      
        }     
    }
}
</script>

<style scoped>
    .disabled *{
        color: rgb(160, 159, 159)!important;        
    }
    .scrollable-x{
        overflow-x: scroll;
    }
</style>