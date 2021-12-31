<template>
  
  <v-dialog
    v-model="active"
    transition="dialog-top-transition"
    fullscreen 
  >
    <!-- <v-container grid-list-xs fluid>
      <v-row class="justify-center align-center "
      > -->
        <v-card
          class="scrollable"
          height="100vh"
              
        >
          <v-toolbar
            :color="selectedItems.length>0?'black':'light-blue'"
            dark
          >        

            <v-toolbar-title>{{selectedItems.length>0?
              `${selectedItems.length} mídias selecionadas...`
              :'My files'}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn icon disabled v-if="!selectedItems.length>0">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-menu offset-y>
              <template v-slot:activator="{on}">
                <v-btn icon  v-if="!selectedItems.length>0"
                  v-on="on">
                  <v-icon>mdi-view-module</v-icon>
                </v-btn>                
              </template>
              <v-card>
              <v-btn v-for="i in 4" :key="i+'b'" @click="cols=i"
              small>
                {{i}}
              </v-btn>                
              </v-card>
            </v-menu>
              

            <v-btn icon @click="getBack" v-if="!selectedItems.length>0"
              :disabled="!havePath">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-btn icon v-else @click="submit">
              <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
            </v-btn>

            <v-btn icon @click="$emit('close')">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </v-toolbar>

          <v-item-group multiple v-model="selectedItems">
          <v-container class="" fluid>
            <v-row class="pa-2" >
              <v-col :cols="cols" v-for="(f,index) in folders" :key="index+'a'"
              style="height:100px" class="mt-2">
                <v-card height="80px" outlined class="d-flex align-center justify-center pa-0 rounded-b-0"
                @click="getMap(f.path)"
                >
                  <v-icon size="80">mdi-folder</v-icon>
                </v-card> 
                <v-card outlined height="20" class="rounded-t-0 text-truncate text-caption text-center">                  
                  {{f.name}}                              
                </v-card>
              </v-col>   

                  <v-col :cols="cols" v-for="(f,index) in files" :key="index"
                  style="height:100px" class="mt-2">
                    <v-item v-item v-slot="{ active, toggle }">
                      <v-card height="80px" outlined class="d-flex align-center justify-center pa-0 rounded-b-0"        
                      @click="toggle"        
                      :color="active?'primary':'blackcard'"
                      >
                        <v-badge right :color="f.tipo.substring(1)" overlap tile
                        offset-x="70"
                        offset-y="70">
                          <span slot="badge">{{f.tipo}}</span>
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
          </v-container>
          </v-item-group>
          <!-- <v-list        
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

            <v-list-item-group
            v-model="selectedItems"
            multiple                        
            >
              <v-list-item
                v-for="(file, index) in files"
                :key="index"
              >          
                
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
            </v-list-item-group>
          </v-list> -->
        </v-card>
      <!-- </v-row>       
    </v-container> -->
  </v-dialog>
  
</template>

<script>
import axios from 'axios'

export default {
  name:'Jialog',

  props:{
    caminho: {
      type: String,
      default: ''
    },
    filter: {
      type: Array,
      default(){
        return []
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  },

  data(){
    return{
      folders: Array(),
      files: Array(),
      selectedItems:[],
      cols:2      
    }
  },

  computed: {
    
    path:{
      get(){
        return this.caminho
      },
      set(value){
        this.$emit("changePath", value)  
        console.log(value)    
      }
    },
    
    havePath(){
      return this.path.split(/\\/).length>1
    }
  },

  methods:{
    getMap(path){
      this.folders = []
      this.files = []        
      this.path = path      
      axios.get("http://10.0.0.107:3000/?path="+path).then(resp =>{          
        for (let element in resp.data.listagem) {
          if(resp.data.listagem[element].tipo){
            if(this.filter.findIndex(ele => ele == resp.data.listagem[element].tipo)  != -1){
              this.files.push(resp.data.listagem[element])
            }
          } else{
            this.folders.push(resp.data.listagem[element])
          }
        }

        this.folders.sort()
        this.files.sort()        
      })                
    },

    getBack(){      
      var past = this.caminho.split(/\\/)
      past.pop()            
      if(past.length != 1){
        this.getMap(past.join('\\'))
      } else{
        this.getMap('\\')
      }

      // console.log('\\')
    },

    submit(){
      var response = []
      this.selectedItems.forEach(element => {
        response.push(this.files[element])
      });            
      this.$emit('submit', response)
      this.$emit('close')
    },    

  },

  created(){
    this.getMap(this.path)
  }
}
</script>

<style>
  .scrollable{
    overflow: auto;
  }
</style>