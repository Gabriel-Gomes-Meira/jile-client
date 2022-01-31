<template>
    <v-dialog
    v-model="show"
    scrollable         
    width="80vw"
    transition="dialog-transition"
    persistent
    > 
        
        <v-card height="80vh"
        color="l1">
            <v-container >
                <v-row>
                    <v-toolbar color="l2" dense>
                    
                    <v-spacer></v-spacer>
                    <v-btn color="" icon
                    large @click="$emit('close')">
                        <v-icon>
                            mdi-close-thick
                        </v-icon>
                    </v-btn>
                </v-toolbar>
                </v-row>            
            </v-container>            
        </v-card>
    </v-dialog>
</template>

<script>
import explorer from "./vexplorer.vue"

export default {
    // name:'dialogexplorer'
    props:['show'],
    data: () => ({

    }),

    components:{
        explorer
    }
}
</script>

<style>

</style>