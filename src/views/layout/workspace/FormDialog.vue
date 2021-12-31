<template>  
    <v-dialog
      v-model="dialog"
      persistent 
      max-width="600px"
    >      
        <v-card>

            <v-card-title>
                <span class="text-h5">{{model}}</span>
            </v-card-title>
            
            <!-- Form in WorkSpace Case Start-->
            <v-card-text v-if="model == 'WorkSpace'">
                <v-container>
                    <v-row>                        

                        <v-text-field
                        label="Nome"
                        required v-model="Data.name"
                        ></v-text-field>
                                      
                    </v-row>
                </v-container>          
            </v-card-text>
            <!-- Form in WorkSpace Case End-->

            
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn
                color="red darken-1"
                text @click="close">
                    Cancelar
                </v-btn>

                <v-btn v-if="!isUpdating"
                color="green darken-1"
                text @click="save">
                    Criar
                </v-btn>

                <v-btn v-else
                color="green darken-1"
                text @click="update">
                    Salvar
                </v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>  
</template>

<script>
export default {
    props:['dialog', 'isUpdating', 'model'],

    data(){
        return{
            Data:{}            
        }
    },

    methods:{
        close(){
            this.$emit('close');
        },

        save(){
            this.$emit('save', this.Data);
            this.close();
        },

        update(){
            this.$emit('update', this.Data)
            this.close();
        }
    }
}
</script>