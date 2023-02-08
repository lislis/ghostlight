<script setup>
 import { RouterLink, RouterView } from 'vue-router'
 import { Header, HeaderNav, HeaderNavItem } from "agnostic-vue";
</script>

<template>
    <Header>
        <template v-slot:logoleft>
            <RouterLink to="/">Home</RouterLink>
        </template>
        <template v-slot:headernav>
            <HeaderNav>
                <HeaderNavItem>
                    <RouterLink to="/about">About</RouterLink>
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
