<template>
  <div>
        <layout 
        :Title="'Jile Client'"
        :server="server"        
        />
        <!-- :Cells="items"
        :getChilds="getChilds" -->
        <!-- @takeMeChilds="getChilds" -->

        <v-container fluid fill-height
        class="Background l1">
            <v-row class="fill-height pb-10 justify-center">
                <!-- <v-col cols="3" class="pb-12">
                    <v-card height="100%">
                    </v-card>   
                </v-col> -->
                <v-col cols="10" class="pb-10">
                    <v-card height="100%"
                    class="l5 pa-1" elevation="0">
                        <v-card height="100%" elevation="0"
                        class="i1">                        
                        </v-card>   
                    </v-card>
                </v-col>
            </v-row>
                
        </v-container>
  </div>
</template>

<script>
import ExplorerLayot from "./layout/explorer"

import {mapGetters} from "vuex"

export default {

    data: () => ({        
        selectedDisk:0,
        
    }),

    components:{
        layout:ExplorerLayot
    },    

    computed:{
        ...mapGetters([
            'server'
        ]),        
    },

    methods:{        
        // getDisks(){
        //     axios.get(`http://${this.server}/disks/`).then((response) =>{
        //         console.log(response.data)
        //         this.items = response.data
        //     })
        // },

        // getChilds(item) {              
            
        //     // console.log(item)
        //     return new Promise((resolve, reject) => {
        //         axios.get(`http://${this.server}/?path=${item.path}`)
        //             .then(response => {
        //                 item.children.push(...response.data)
        //                 resolve(response)
        //             })
        //             .catch(error => {                
        //                 reject(error)
        //         });
        //     })
        // },
    },

    created(){
        if(!this.server){
            this.$router.push('/')
        }              
    },

    mounted(){
        // this.getDisks();  
    }
}
</script>
