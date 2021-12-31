<template>
  <v-container fluid fill-height>
        <v-row class="align-center justify-center">
            <v-card v-if="response.active">
                <v-alert :class="response.hasError?'red':'success'" v-model="response.active" dismissible>
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

                    <v-btn color="success" 
                    fab small>
                        <v-icon @click="tryHandshake"
                        color="">
                        mdi-connection
                        </v-icon>
                    </v-btn>                  
                    </v-row>                
                </v-container>              
                </v-card-actions>
          </v-card>
        </v-row>
    </v-container>   
</template>

<script>
import axios from "axios"
export default {
    data: () => ({        
        address:"",
        response:{
            active:false,
            hasError:false,
        }
    }),

    methods:{
        tryHandshake(){
            axios.get(`http://${this.address}:3000/`).then(result => {
                if(result.data.handshake){
                    this.response.active=true;
                    this.response.hasError=false;
                } else {
                    this.response.active=true;
                    this.response.hasError=true;
                }
            }).catch(() => {
                this.response.active=true;
                this.response.hasError=true;
            })
        }
    }
}
</script>