<template>
    <div class="flex justify-between items-end p4">
        <DeviceLabel :device="item" />
        <div class="flex flex-grow-1 justify-between items-end">
            <div class="mie24 flex items-center">
                <h1 v-if="item.trigger" class="mie6">🚨</h1><h1 v-else>🦗</h1>
                   <button class="pis8 pie8 pbs2" v-if="item.trigger" @click="resetTrigger">Reset</button>
               </div>

            <StateToggle label="Active" :stateActive="item.active" @clickedToggle="toggleActive" />

            <div class="mie24">
                <span>Reading</span><br>
                <span>{{ item.reading }}</span>
            </div>
            <div  class="mie24">
                <span>Threshold</span><br>
                <span class="mie8">{{item.threshold}}</span>
                <input class="p4" type="number" @change="changeThreshold" />
            </div>

            <div  class="mie24">
                <span>Interval</span><br>
                <span class="mie8">{{item.interval}}</span>
                <input class="p4" type="number" @change="changeInterval" />
            </div>

            <div class="mie24">
                <button v-if="!disco" @click="flashy" class="pie8 pis8 pbs4">Disco</button>
                <button v-else @click="noflashy" class="pie8 pis8 pbs4">Stop</button>
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
     data() {
         return {
             disco: false,
             intervalId: null
         }
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
             this.disco = true;
             this.toggleActive();
             this.intervalId = setInterval(this.toggleActive, 1000);
         },
         noflashy(ev) {
             this.disco = false;
             this.toggleActive();
             clearInterval(this.intervalId);
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
