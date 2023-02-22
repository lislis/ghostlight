<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />
        <div class="flex justify-between">
            <StateToggle label="Active" :stateActive="item.active" @clickedToggle="toggleActive" />

            <div>
                <span>Interval {{ item.interval }}</span><br>
                <input class="p4" :value="item.interval" type="number" @change="changeInterval" />
            </div>
            <div class="mie24">
                <span>Reading</span><br>
                <input class="p4" :value="parseInt(item.reading, 10)" type="number" readonly />
            </div>
            <div>
                <span>Threshold {{ item.threshold }}</span><br>
                <input class="p4" :value="item.threshold" type="number" @change="changeThreshold" />
            </div>
            <div class="mie24">
                <span v-if="item.trigger">🚨</span><span v-else>🦗</span> Trigger<br>
                <button class="p4" v-if="item.trigger" @click="resetTrigger">reset trigger</button>
            </div>

        </div>
    </div>
</template>
<script>
 import DeviceLabel from "@/components/DeviceLabel.vue";
 import { useDeviceStore } from '@/stores/devices';
 import StateToggle from "@/components/StateToggle.vue";

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
         resetTrigger() {
             let body = this.createBody('trigger', false);
             this.store.updateSingle(body);
         },
         changeThreshold(ev) {
             let body = this.createBody('threshold', ev.target.value);

             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         },
         changeInterval(ev) {
             let body = this.createBody('interval', ev.target.value);
             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         },
         toggleActive() {
             let mew;
             if (this.item.active) {
                 mew = false;
             } else {
                 mew = true;
             }
             //let mew = !this.item.active;
             let body = this.createBody('active', mew);
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
