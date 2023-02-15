<script>
 import { RouterLink, RouterView } from 'vue-router'
 import { Header, HeaderNav, HeaderNavItem } from "agnostic-vue";

 export default {
     name: 'App',
 }
</script>

<template>
    <Header>
        <template v-slot:logoleft>
            <RouterLink to="/">Home</RouterLink>
        </template>
        <template v-slot:headernav>
            <HeaderNav>
                <HeaderNavItem>
                    <RouterLink to="/radio">Radio</RouterLink>
                </HeaderNavItem>
            </HeaderNav>
        </template>
        <template v-slot:logoright>
            free space
        </template>
    </Header>

    <RouterView />
</template>

<style scoped>
</style>
