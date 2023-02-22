<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />

        <div class="flex justify-between">
            <div class="mie24">
                <span>Level</span><br>
                <input class="p4" :value="parseInt(item.level, 10)" type="number" readonly />
            </div>


        </div>
    </div>
</template>
<script>
 import DeviceLabel from "@/components/DeviceLabel.vue";
 import { useDeviceStore } from '@/stores/devices';
 import StateToggle from "@/components/StateToggle.vue"

 export default {
     name: 'SingleSensor',
     props: ['item'],
     inject: ['socket'],
     components: { DeviceLabel, StateToggle },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     methods: {
         changeInterval(ev) {
             let body = createBody('interval', ev.target.value);
             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         },
         createBody(key, value) {
             return { ip: this.item.ip,
                      deviceID: this.item.deviceID,
                      value,
                      type: key };
         }
     }
 }
</script>
