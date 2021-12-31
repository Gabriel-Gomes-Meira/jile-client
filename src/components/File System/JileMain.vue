<template>
    
  <v-row class="justify-center align-center "
  >
    <v-card
      class="mx-autos scrollable"
      height="92vh"
      width="100%"
      
    >
      <v-toolbar
        color="light-blue"
        dark
        dense
      >        

        <v-toolbar-title>My files</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon disabled>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon disabled>
          <v-icon>mdi-view-module</v-icon>
        </v-btn>

        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close-thick</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list        
        subheader
        two-line
      >
        <v-subheader inset>Folders</v-subheader>

        <v-list-item
          v-for="(folder, index) in folders"
          :key="index+'a'"
          @click="getMap(folder.path)"
        >          
            <v-list-item-avatar>
              <v-icon
                class="grey lighten-1"
                dark
              >
                mdi-folder
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="folder.name"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          
        </v-list-item>

        <v-divider inset></v-divider>

        <v-subheader inset>Files</v-subheader>

        <v-list-item
          v-for="(file, index) in files"
          :key="index"
        >          
          <!-- @click="$emit('openFile',file)" -->
            <v-list-item-avatar>
              <v-icon
                class="blue"
                dark
                v-text="'mdi-file'"
              ></v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="file.name"></v-list-item-title>

            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon>
                <v-icon color="grey lighten-1">mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>          
        </v-list-item>
      </v-list>
    </v-card>
  </v-row>         
  
</template>

<script>
import axios from 'axios'

export default {
  name:'Jile',

  props:{
    
    caminho: {
      type: String,
      default: '/'
    },

    filter: {
      type: Array,
      default(){
        return []
      }
    },
  },

  data(){
    return{
      folders: Array(),
      files: Array(),
    }
  },

  computed: {
  },

  methods:{
    getMap(path){
      this.folders = []
      this.files = []        

      axios.get("http://10.0.0.107:3000/?path="+path).then(resp =>{          
        for (let element in resp.data.listagem) {
          if(resp.data.listagem[element].tipo){
            if(this.filter.findIndex(ele == resp.data.listagem[element].tipo)  == -1){
              this.files.push(resp.data.listagem[element])
            }
          } else{
            this.folders.push(resp.data.listagem[element])
          }
        }

        this.folders.sort()
        this.files.sort()
      })                
    }
  },

  created(){
    this.getMap(this.caminho)
  }
}
</script>

<style>
  .scrollable{
    overflow: auto;
  }
</style>