<template>
    <div>
        <v-menu
        left>
            <template v-slot:activator="{ on: menu, attrs }">
                <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }"
                >
                    <v-btn
                    color="white"
                    dark
                    v-bind="attrs"
                    v-on="{ ...tooltip, ...menu }"
                    icon
                    >
                        <v-icon size="32"
                        v-text="'mdi-collage'"/>
                    </v-btn>
                </template>
                <span>Criar Células</span>
                </v-tooltip>
            </template>

            <v-sheet class="backcard" outlined rounded=""
                width="160px"
                height="154px"
                style="overflow:hidden">
                <v-card class="l5 ">
                    <v-row class="pa-2 justify-center">
                        <v-col v-for="item in items" :key="item.icon"
                        cols="6"                        
                        >
                            <v-btn :color="item.color" fab                            
                            elevation="0"
                            @click="$emit('createCell', item.type)">
                                <v-icon v-text="item.icon" />
                            </v-btn>
                        </v-col>
                    </v-row>                           
                </v-card>
            </v-sheet>        
        </v-menu>   
    </div>
</template>

<script>
export default {
    name:'MenuWork',       
    data(){
        return{
            items:[{
                    color:"video",
                    icon:"mdi-television-play",
                    type:"Player"                
                },{
                    color:"image",
                    type:"Image",
                    icon:"mdi-image",                    
                },{
                    color:"audio",
                    type:"Player",
                    icon:"mdi-music-note",                            
                },{
                    color:"text",                    
                    icon:"mdi-book",
                    type:"Text"                
            }],            
            showDialog:false,                      
        }
    },

    computed:{
        // active:{
        //     get(){
        //         return this.isShowing
        //     },
        //     set(value){
        //         if(!value){
        //             this.$emit('close');
        //         }
        //     }
        // }
    },

    methods:{        
    }
}
</script>

<style>

</style>