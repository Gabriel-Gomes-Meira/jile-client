<template>    
        <v-dialog v-model="dialog" 
        persistent max-width="500px"
        :overflow="true">
            
            <v-card>
                <v-card-title>
                    <span class="headline">{{Action.title}}</span>
                </v-card-title>

                <v-card-text>
                    <p>
                        Deseja mesmo {{ Action.summarize }} {{ Action.target }} ?
                    </p>
                    
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="info" outlined @click.prevent="$emit('close')">Cancelar</v-btn>
                    <v-btn color="red" outlined @click.prevent="agree">Continuar</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>    
</template>

<script>
export default {
    props:['dialog', 'Action'],

    methods:{

        agree(){
            this.$emit('agree');
            this.$emit('close');
        }
    }
}
</script>