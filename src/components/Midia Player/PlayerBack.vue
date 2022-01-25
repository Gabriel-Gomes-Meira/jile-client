<template>
    <div >
        <video 
        :id="'player_'+player_id" 
        @click="$emit('togglePlay')" @loadedmetadata="initializePlayer" 
        @timeupdate="$emit('updateProgress')"
        @ended="$emit('finish')"
        preload="metadata">
            <source :src="`http://${server}/files/?path=${Midia.path}`"
            :type="'video/'+type"
            media="(min-width: 1024px)">            
        </video>
        
        <!-- <audio v-if="Midia.midiaType == 'audio'" 
        :id="'player_'+player_id" 
        @click="$emit('togglePlay')" @loadedmetadata="initializePlayer" 
        @timeupdate="$emit('updateProgress')"
        @ended="$emit('finish')"
        preload="metadata"
        :src="'http://10.0.0.107:3000/files/?path='+Midia.src"></audio> -->
    </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
    props:['player_id', 'Midia'],
    
    data: () => ({
        midiaPlayer:{}    
    }),

    computed:{
        ...mapGetters([
            'server'
        ]),
        type(){
            console.log(this.Midia)
            var tipo = this.Midia.extension.split(".")            
            return tipo[1]
        }
    },

    mounted(){
        this.midiaPlayer = document.getElementById('player_'+this.player_id)
    },


    methods:{        

        initializePlayer(){			
            this.$emit('initialized', this.midiaPlayer)						
		},

        
    }
}
</script>

<style>

</style>