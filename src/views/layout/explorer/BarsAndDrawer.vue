<template>
    <div>
        
        <v-app-bar        
        dense class="l3 elevation-0">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-tabs
        v-model="SelectedTab"
        align-with-title
        right        
        @change="$emit('tabchanged', SelectedTab)">
            <v-tabs-slider color="l6"></v-tabs-slider>

            <v-tab
            v-for="(Tab, index) in WKs.wks"
            :key="'tab_'+index"        
            @keydown="checkKey"            
            >                                        
            <template>            
                <span class="white--text">
                    {{ Tab.name }}
                </span>
            </template>      
            </v-tab>
        </v-tabs>
        
        <v-toolbar-title>{{Title}}</v-toolbar-title>
        </v-app-bar>

        
        <v-navigation-drawer v-model="drawer"
        absolute temporary       
        class="l3">
        <v-list nav
        dense>
            <v-list-item-group
            active-class="white--text text--accent-4"            
            >
            <!-- class="l6--text" -->

            <v-list-item
            @click="dialog.WS=true">
                <v-list-item-icon>
                <v-icon>mdi-table-network</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Nova Área</v-list-item-title>
            </v-list-item>

            <v-list-item
            @click="$emit('openExplorer')">
                <v-list-item-icon>
                <v-icon>mdi-server</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Arquivos</v-list-item-title>
            </v-list-item>
            
            <v-list-group
            :disabled="SelectedTab==-1?true:false"
            no-action
            :class="SelectedTab==-1?'disabled':''"
            >            
                <template v-slot:activator
                color="grey">                
                    <v-list-item-icon>
                        <v-icon>mdi-shape-square-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Nova Célula</v-list-item-title>
                </template>
                                
                <v-list-item v-for="(cell, index) in Cells"
                @click="WKs.createWC(SelectedTab, cell.type)" :key="index+'cell'">                                           
                    <v-list-item-title> 
                        {{cell.label}}
                    </v-list-item-title>
                    <v-list-item-icon>
                        <v-icon v-text="cell.icon"></v-icon>
                    </v-list-item-icon>                    
                </v-list-item>                
            </v-list-group>

            <v-expansion-panels focusable flat>
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
            @click="saveState">
                <v-list-item-icon>
                <v-icon>mdi-content-save-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Salvar</v-list-item-title>
            </v-list-item>

            </v-list-item-group>
        </v-list>
        </v-navigation-drawer>

        <form-dialog v-if="dialog.WS" :dialog="dialog.WS"
        @close="dialog.WS=false" @save="(arg) => WKs.createWS(arg)"  
        :isUpdating="dialog.WSU"
        @update="(arg) => WKs.renameWS(arg)"  
        :model="'WorkSpace'"></form-dialog>

        

        <confirm-dialog v-if="dialog.WSD"
        @close="dialog.WSD=false" @agree="deleteWS"
        :dialog="dialog.WSD"
        :Action="{
        title:'Deletar Workspace',
        summarize: 'deletar',
        target: 'o Workspace: '+WKs[SelectedTab].name
        }"></confirm-dialog>
        
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

import FormDialog from '../workspace/FormDialog.vue';
import ConfirmDialog from '../workspace/ConfirmDialog.vue';

// IPC para comunicar com o systembar
// import { ipcRenderer } from "electron"

export default {
    name:"Explorer-layout",

    props:['Title'],

    data(){
        return{
            drawer:false,
            SelectedTab:-1,
            message:'',
            dialog:{
                WS:false,                
                WSU:false,
                WSD:false,
                snack:false
            },
            // isMaximized:false,
            themes:[
                {name:'gray', maincolor:'#4A6471'},
                {name:'darkblue', maincolor:'#005E9A'},
                {name:'darkgreen', maincolor:'#3D794C'},
                {name:'darkyellow', maincolor:'#FFD600'},
                {name:'darkambar', maincolor:'#C85700'},
                {name:'vinne', maincolor:'#880E4F'},
                {name:'darkred', maincolor:'#8E1616'}
            ],
            Cells:[
                {
                    label:'Image Viewer',
                    icon:'mdi-image',
                    type:'Image'
                },
                {
                    label:'Video Player',
                    icon:'mdi-video',
                    type:'Player'
                },
                {
                    label:'Text Reader',
                    icon:'mdi-text',
                    type:'Text'
                },                
            ]
        }
    },

    components:{
        FormDialog,
        ConfirmDialog
    },

    computed: {
        ...mapGetters([
        'WKs', 'theme'
    ])},

    methods:{
        //vou trocar pra menu context
        checkKey(event) {            
            if(event.key=="F2"){
                this.dialog.WS=true
                this.dialog.WSU=true
            } else if(event.key=="Delete"){
                this.dialog.WSD=true
            }
        },

        saveState(){
            this.$store.dispatch('saveState').then((message) =>{
                this.message = message
                this.dialog.snack = true
            })
        },                

        changeTheme(value){
            this.$store.dispatch('changeTheme', value).then(()=>{                            
                for (const lay in this.theme) {  
                    // console.log(this.$vuetify)              
                    this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
                }
            })
        },        
     
    },

    created() {               
        this.$store.dispatch('loadState').then(()=>{            
            for (const lay in this.theme) {                
            this.$vuetify.theme.themes.dark[lay] = this.theme[lay];
            }
        });      
                
        
    },
}
</script>

<style scoped>
    .disabled *{
        color: rgb(160, 159, 159)!important;        
    }
</style>