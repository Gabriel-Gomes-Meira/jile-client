<template>
    <div>
        
        <v-app-bar        
        dense class="elevation-0 l3"
        @contextmenu="show"
        >        
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-tabs
            optional            
            v-model="tabSelected"

            align-with-title>
                <v-tab 
                v-for="Tab in WKs.wks"
                :key="'tab_'+Tab.name">
                    {{Tab.name}}
                </v-tab>
            </v-tabs>
            <v-spacer></v-spacer>

            <v-btn icon disabled >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <v-btn icon  
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
              
            <v-btn icon 
            :disabled="!havepast"
            @click="$emit('back')">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-btn icon 
            :disabled="!havedest"
            @click="$emit('front')">
                <v-icon>mdi-arrow-right</v-icon>
            </v-btn>

            <v-btn icon 
            @click="favoriteDrawer = !favoriteDrawer"
            >
                <v-icon>mdi-folder-star-multiple</v-icon>
            </v-btn>

            <!-- 
                <v-toolbar-title class="ml-6">
                {{selectedItems>0?
                `${selectedItems} mídias selecionadas...`
                :Title}}
            </v-toolbar-title>                                   -->
            <v-toolbar-title v-text="Title" />
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
                
                <v-list-item            
                @click="$store.dispatch('saveWorkState')">
                    <v-list-item-icon>
                    <v-icon>mdi-content-save-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Salvar</v-list-item-title>
                </v-list-item>                
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

        <menu-tab
        :isShowing="showMenu.active"
        :x="showMenu.x"
        :y="showMenu.y"
        :tabSelected="tabSelected"
        @close="showMenu.active = false"
        @create="creteWork"
        @edited="renameWork"
        @delete="deleteWork">
        </menu-tab>                                
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from "axios"
import menu from "./Menutab.vue"



export default {
    name:"Explorerlayout",

    props:['Title', 'server', 'havepast', 'havedest', 'SelectedTab', 'Folders'],

    data(){
        return{
            drawer:false,
            tree:[],
            // Folders:[],
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
            showMenu: {
                active:false,
                x:0,
                y:0,                
            }         
        }
    },

    components:{ 
        MenuTab :menu   
    },

    computed: {
        ...mapGetters([
            'theme', 'FavoritesFolders', 'WKs'
        ]),
        address(){
            if(this.server){
                return `http://${this.server}/`;
            } 
        },
        tabSelected:{
            get(){
                return this.SelectedTab;
            },
            set(value){
                // console.log(value)
                this.$emit('tabchanged', value)
            }
        }
    },

    methods:{                  

        changeTheme(value){
            this.$store.dispatch('saveAppState', ['currenttheme',value]).then(()=>{                            
                for (const lay in this.theme) {                           
                    this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
                }
            })
        },    

        // getDisks(){
        //     axios.get(`${this.address}disks/`).then((response) =>{                
        //         this.Folders = response.data
        //     })
        // },

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
        },

        show (e) {
            e.preventDefault()
            this.showMenu.active = false
            this.showMenu.x = e.clientX
            this.showMenu.y = e.clientY
            this.$nextTick(() => {
                this.showMenu.active = true
            })
        },

        creteWork(){
            this.WKs.createWS(
                'WorkSpace '+(this.WKs.size+1)
            )
            this.tabSelected = this.WKs.size-1
        },

        renameWork(name){
            this.WKs.renameWS(name, this.tabSelected) 
        },

        deleteWork(){
            this.WKs.deleteWS(this.tabSelected)
        }
     
    },

    created() {  

        this.$store.dispatch('loadState').then(()=>{            
            for (const lay in this.theme) {                
            this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
            }
        });                              
    },

    // mounted(){   
    //     if(this.server){
    //         this.getDisks();                      
    //     }     
    // }
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