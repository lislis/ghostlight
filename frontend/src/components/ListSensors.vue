<template>
    <div>
        <div class="flex justify-between mbe16 mbs16">
            <button @click="allLight">Toggle color lights</button>
            <label>Threshold all<input type="number"  @change="threshAll" /></label>
            <label>Interval all<input type="number"  @change="interAll" /></label>
        </div>
        <hr />
        <ul v-if="store.byType('sensor').length">
            <li v-for="sensor in store.byType('sensor')">
                <SingleSensor :item="sensor" />
            </li>
        </ul>
        <div v-else>No sensors yet</div>
    </div>
</template>

<script>
 import SingleSensor from '@/components/SingleSensor.vue';
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'ListSensors ',
     components: { SingleSensor },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     inject: ['apiEndpoint', 'socket'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/sensors`).then(d => d.json());
         if (result.message === 'success') {
             this.store.addMore(result.data);
         } else {
             console.log("Error fetching data");
         }
     },
     methods: {
         allLight() {
             this.store.byType('sensor').forEach(v => {
                 let mew;
                 if (v.active) {
                     mew = false;
                     this.resetTrigger(v);
                 } else {
                     mew = true;
                 }
                 //let mew = !this.item.active;
                 let body = this.createBody(v, 'active', mew);
                 this.store.updateSingle(body);
                 this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
             });
         },
         createBody(item, key, value) {
             return { ip: item.ip,
                      deviceID: item.deviceID,
                      value,
                      type: key };
         },
         resetTrigger(item) {
             let body = this.createBody(item, 'trigger', false);
             this.store.updateSingle(body);
         },
         threshAll(ev) {
             this.store.byType('sensor').forEach(v => {
                 let body = this.createBody(v, 'threshold', ev.target.value);
                 this.store.updateSingle(body);
                 this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
             });
         },
         interAll(ev) {
             this.store.byType('sensor').forEach(v => {
                 let body = this.createBody(v, 'interval', ev.target.value);
                 this.store.updateSingle(body);
                 this.socket.send(JSON.stringify({ subject: 'changeSensor', body}));
             });
         }
     }
 }
</script>
