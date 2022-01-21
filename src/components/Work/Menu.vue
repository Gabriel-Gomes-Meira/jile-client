<template>
    <v-menu  absolute allow-overflow>        
        <v-list>
            <v-list-item v-for="item in handle" :key="item.name" @click="$emit(item.callback)">
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
export default {
    name:'Menu',
    props:['handle', 'active']
}
</script>