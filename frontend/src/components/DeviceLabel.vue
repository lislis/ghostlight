<template>
    <div class="mie24">
        <span>{{ device.deviceID }}</span><br>
        <small><Tag shape="round" is-uppercase >{{ device.ip }}</Tag></small>
    </div>
</template>
<script>
 import { Tag } from "agnostic-vue";

 export default {
     name: 'DeviceLabel',
     props: ['device'],
 }
</script>
