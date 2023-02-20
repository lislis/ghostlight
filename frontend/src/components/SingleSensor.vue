<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />
        <div class="flex justify-between">
            <div class="mie24">
                <span v-if="item.trigger">🚨</span><span v-else>🦗</span> Trigger<br>
                <button class="p4" @click="resetTrigger">reset trigger</button>
            </div>
            <div class="mie24">
                <span>Reading</span><br>
                <input class="p4" :value="parseInt(item.reading, 10)" type="number" readonly />
            </div>
            <div>
                <span>Threshold {{ item.threshold }}</span><br>
                <input class="p4" :value="item.threshold" type="number" @change="changeTheshold" />
            </div>
        </div>
    </div>
</template>
<script>
 import DeviceLabel from "@/components/DeviceLabel.vue";
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'SingleSensor',
     props: ['item'],
     inject: ['socket'],
     components: { DeviceLabel },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     methods: {
         resetTrigger() {
             let body = { ip: this.item.ip,
                          deviceID: this.item.deviceID,
                          value: false,
                          type: 'trigger' };
             this.store.updateSingle(body);
         },
         changeTheshold(ev) {
             //console.log('change', ev.target.value);
             let body = { ip: this.item.ip,
                          deviceID: this.item.deviceID,
                          value: ev.target.value,
                          type: 'threshold' };
             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         }
     }
 }
</script>
