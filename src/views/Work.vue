<template>
    <div>
        <layout
        :Title="'WorkSpacing'"     
        @tabchanged="tabchanged"
        ></layout>                        

        <v-tabs-items v-model="SelectedWS"
        v-if="WKs.size>0">
        <v-tab-item
        v-for="(WK, index) in WKs.wks"
        :key="index">
            <v-container grid-list-xs fluid
            class="Background l1">
            <Base 
            :WK="WK" 
            @closeWC="(arg) => WKs.deleteWC(WK, arg)" />            
            </v-container>          
        </v-tab-item>      
        </v-tabs-items>

            
        
    </div>
</template>

<script>
import WorkLayout from "../components/Work"
import Base from "../components/WorkSpace/Space.vue"
import { mapGetters } from 'vuex';

export default {
    name:'Work',

    data: () =>({
        SelectedWS:-1,        
    }),

    components:{
        layout:WorkLayout,        
        Base
    },

    computed:{
        ...mapGetters([
            'WKs', 'server'
        ])
    },

    methods:{
        tabchanged(index){
            this.SelectedWS = index
        },
    },
    
    created(){
        if(!this.server){
            this.$router.push('/')
        }
    }

}
</script>

<style>
.Background{    
    overflow: hidden;
    height:100vh;
  }
</style>