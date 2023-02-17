<template>
    <div class="mie24">
        <span>ip: {{ device.ip }}</span><br>
        <span>device: {{ device.deviceID }}</span>
    </div>
</template>
<script>
 export default {
     name: 'DeviceLabel',
     props: ['device'],
 }
</script>
