<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />
        <div class="flex justify-between">
            <div class="" >
                <span>Resistance value</span><br>
                <input :value="item.value" type="number" readonly />
            </div>
            <div>
                <span>Threshold {{ item.threshold }}</span><br>
                <input :value="item.threshold" type="number" @change="changeTheshold" />
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
         changeTheshold(ev) {
             //console.log('change', ev.target.value);
             let body = { ip: this.item.ip,
                          deviceID: this.item.deviceID,
                          value: ev.target.value,
                          type: 'threshold' };
             this.store.updateSingle(body);
             this.socket.emit(JSON.stringify({ subject: 'changeSensor', body}));
         }
     }
 }
</script>
