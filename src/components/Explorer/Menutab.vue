<template>
    <div>

    <v-menu
    v-model="active"
    :position-x="x"
    :position-y="y"
    absolute        
    :close-on-content-click="false"
    offset-y>
        <v-sheet color="backcard" outlined rounded="">
            <v-list class="px-1 pb-0 pt-1"
            dense rounded
            color="l4">            
                <v-list-item
                dense                
                @click="$emit('create')"
                class="py-0 px-2">
                    <v-list-item-icon class="mx-0"> 
                        <v-icon 
                        size="20"
                        v-text="'mdi-plus-circle-outline'" />
                    </v-list-item-icon>
                    <v-list-item-title
                    class="pa-0 text-center">
                        Novo
                    </v-list-item-title>
                </v-list-item>
                <v-divider class="backcard"></v-divider>

                <v-list-item
                dense
                :disabled="tabSelected || tabSelected>=0?false:true"                
                @click="isEditing = true"
                class="py-0 px-2"
                v-if="!isEditing">
                    <v-list-item-icon class="mx-0"> 
                        <v-icon 
                        size="20"
                        v-text="'mdi-rename-box'" />
                    </v-list-item-icon>
                    <v-list-item-title
                    class="pa-0 text-center">
                        Renomear
                    </v-list-item-title>
                </v-list-item>
                

                <v-text-field v-else             
                color="white" v-model="NewName"
                >
                    <template v-slot:prepend>
                        <v-btn color="red"
                        icon @click="isEditing=false">
                            <v-icon
                            >
                                mdi-cancel
                            </v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:append-outer>
                        <v-btn color="i1"
                        icon @click="performEdit">
                            <v-icon
                            >
                                mdi-send
                            </v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
                <v-divider class="backcard"></v-divider>

                <v-list-item
                dense                
                @click="showDialog = true"
                :disabled="tabSelected || tabSelected>=0?false:true"      
                class="py-0 px-2">
                    <v-list-item-icon class="mx-0"> 
                        <v-icon 
                        size="20"
                        v-text="'mdi-trash-can'" />
                    </v-list-item-icon>
                    <v-list-item-title
                    class="pa-0 text-center">
                        Excluir
                    </v-list-item-title>
                </v-list-item>                            
            </v-list>
        </v-sheet>
        
        <v-dialog
        v-model="showDialog"
        scrollable         
        width="300px"
        transition="dialog-transition"
        >          
            <v-card height="200 pt-3">
                <v-card-text 
                class="text-center text-h5 pa-4">
                    Certeza de que pretende deletar o Workspace selecionado?
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="red" @click="showDialog = false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="performDelete">
                        <v-icon>mdi-check-bold</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>          
        </v-dialog>
    </v-menu>   
    </div>
</template>

<script>
export default {
    name:'Menutab',
    props:["tabSelected", 'x', 'y', 'isShowing'],
    data(){
        return{
            isEditing:false,
            NewName:'',  
            showDialog:false,                      
        }
    },

    computed:{
        active:{
            get(){
                return this.isShowing
            },
            set(value){
                if(!value){
                    this.$emit('close');
                }
            }
        }
    },

    methods:{
        performEdit(){
            this.$emit('edited', this.NewName);
            this.isEditing = false;
            this.active = false;
        },
        performDelete(){
            this.$emit('delete');
            this.showDialog = false;
            this.active = false;
        }
    }
}
</script>

<style>

</style>