<template>
    <v-container fluid fill-height>
        <v-row class="align-center justify-center" v-if="!loading">
            <v-card v-if="response.active" width="60%">
                <v-alert :class="response.hasError?'red':'success'" v-model="response.active" dismissible class="text-center">
                    {{ response.hasError?'Não foi possível encontrar um servidor com o ip digitado!':'Conexão bem sucedida!' }}
                </v-alert>
            </v-card>
            <v-card color="" outlined height="40vh" width="60%" class="d-flex flex-column justify-space-around">
                <v-card-text class="white--text text-h4 text-center">
                    Digite o endereço ip, ou nome do host, no qual está executando o Jile Server.
                </v-card-text>
            
                <v-card-actions >
                <v-container fluid>
                    <v-row>
                    <v-text-field 
                        class="mr-4"
                        label="xxx.xxx.xxx.xxx"
                        outlined
                        dense                
                        v-model="address"
                    ></v-text-field>                

                    <v-btn color="success" @click="tryHandShake"
                    fab small>
                        <v-icon 
                        color="">
                        mdi-connection
                        </v-icon>
                    </v-btn>                  
                    </v-row>                
                </v-container>              
                </v-card-actions>
        </v-card>
        </v-row>

        <v-row class="align-center justify-center" v-else>
            <v-progress-circular 
            indeterminate
            color="green"
            :size="200"
            ></v-progress-circular>
        </v-row>
    </v-container>   
</template>

<script>
import axios from "axios"
import {mapGetters} from "vuex"
export default {
    computed:{
        ...mapGetters([
            'server'
        ])
    },

    data: () => ({        
        address:"",
        response:{
            active:false,
            hasError:false,
        },
        loading:false
    }),

    methods:{
        tryHandShake(){
            
            axios.get(`http://${this.address}:3000/`).then(result => {
                if(result.data.handshake){
                    this.response.active=true;
                    this.response.hasError=false;
                    this.loading = true;
                    this.$store.dispatch('saveAppState', ['serverConnected', `${this.address}:3000`])                    
                    setTimeout(() => {
                        this.$router.push('Work')
                    }, 5000)
                } else {
                    this.response.active=true;
                    this.response.hasError=true;
                }
            }).catch(() => {
                this.response.active=true;
                this.response.hasError=true;
            })
        }
    },
    
    created(){
        if(this.server){
            this.$router.push('/explorer')
        }
    }
}
</script>