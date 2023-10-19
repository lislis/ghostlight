<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />
        <div class="flex flex-grow-1 justify-between items-end">
               <div class="mie24">
                <button class="p4" v-if="item.trigger" @click="resetTrigger">reset trigger</button>
                <h1 v-if="item.trigger">🚨</h1><h1 v-else>🦗</h1>
            </div>

            <StateToggle label="Active" :stateActive="item.active" @clickedToggle="toggleActive" />

            <div class="mie24">
                <span>Reading</span><br>
                <span>{{ item.reading }}</span>
            </div>
            <div  class="mie24">
                <span>Threshold {{ item.threshold }}</span><br>
                <input class="p4" :value="item.threshold" type="number" @change="changeThreshold" />
            </div>

            <div  class="mie24">
                <span>Interval {{ item.interval }}</span><br>
                <input class="p4" :value="item.interval" type="number" @change="changeInterval" />
            </div>

            <div class="mie24">
                <button @click="flashy" class="pie8 pis8 pbs4">Disco</button>
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
               ev.preventDefault();
             let body = this.createBody('threshold', ev.target.value);

             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         },
         changeInterval(ev) {
             let body = this.createBody('interval', ev.target.value);
             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
         },
         flashy(ev) {
             this.toggleActive();
             setTimeout(this.toggleActive, 500);
         },
         toggleActive() {
             let mew;
             if (this.item.active) {
                 mew = false;
                 this.resetTrigger();
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
