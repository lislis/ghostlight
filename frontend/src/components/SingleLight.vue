<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />
        <div class="flex">
            <StateToggle label="Light" :stateActive="item.light" @clickedToggle="toggleLight" />
            <StateToggle label="Rumble" :stateActive="item.rumble" @clickedToggle="toggleRumble" />
        </div>
    </div>
</template>
<script>
 import { Switch } from "agnostic-vue";
 import StateToggle from "@/components/StateToggle.vue"
 import DeviceLabel from "@/components/DeviceLabel.vue"

 export default {
     name: 'SingleLight',
     props: ['item'],
     inject: ['socket'],
     components: { StateToggle, DeviceLabel },
     methods: {
         toggleLight() {
             let body = { ip: this.item.ip,
                          deviceID: this.item.deviceID,
                          type: 'light' };
             console.log(this.socket)
             this.socket.send(JSON.stringify({ subject: 'changeDevice', body }));
         },
         toggleRumble() {
             let body = { ip: this.item.ip,
                          deviceID: this.item.deviceID,
                          type: 'rumble' };
             this.socket.send(JSON.stringify({ subject: 'changeDevice', body }));
         }
     }
 }
</script>
