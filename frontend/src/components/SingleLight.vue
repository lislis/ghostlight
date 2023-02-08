<template>
    <div class="flex">
        <span>{{ light }}</span>
        <div class="flex">
            <span>Switch</span>
            <span>Light</span>
            <span>Rumble</span>
        </div>
    </div>
</template>
<script>
 import { Switch } from "agnostic-vue";

 export default {
     name: 'SingleLight',
     props: ['light'],
     inject: ['apiEndpoint']
     methods: {

     }
 }
</script>
