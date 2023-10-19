<template>
    <main class="m24">
        <h1> 👻 🔦  Network</h1>
        <div class="mbs36">
            <div>
                <section id="sensors" class="mbe36 mbs16">
                    <h2>Sensors</h2>
                    <hr>
                    <ListSensors />
                </section>
            </div>
        </div>
        <div class="flex">
            <div class="flex-grow-1 mie36">
                <section id="actuators"  class="mbe36">
                    <h2>Actuators</h2>
                    <hr>
                    <ListActuators />
                </section>


                <section id="other" class="mbe36">
                    <h2>Other</h2>
                    <hr>
                    <NeutralList label="Other" path="other" type="webclient" />

                </section>

            </div>
            <div class="mis32">
                <section id="flashlights" class="">
                    <div class="flex items-end justify-between">
                        <h2>Flashlights</h2>
                        <LightControls @rumbleAll="sendRumbleAll"
                                       @blackoutAll="sendBlackoutAll"
                                       @randomLightup="sendRandomLightup"
                                       :isBlackoutAll="isBlackoutAll"
                                       :isRumbleAll="isRumbleAll" />

                    </div>
                    <hr>
                    <ListLights />
                </section>
            </div>
        </div>
    </main>
</template>
<script>
 import ListLights from '@/components/ListLights.vue'
 import LightControls from '@/components/LightControls.vue';
 import ListSensors from '@/components/ListSensors.vue';
 import ListActuators from '@/components/ListActuators.vue';
 import NeutralList from '@/components/NeutralList.vue';
 import { generateRandomString } from '@/utils';
 import { useDeviceStore } from '@/stores/devices';
 import { computed } from 'vue'


 export default {
     name: 'HomeView',
     components: { ListSensors, ListLights, LightControls,
                   NeutralList, ListActuators },
     data() {
         return {
             isBlackoutAll: false,
             isRumbleAll: false
         };
     },
     inject: ['socketServer', 'apiEndpoint', 'socket'],
     async created() {
         const rumble = fetch(`${this.apiEndpoint}/state/rumble`)
             .then(d => d.json());
         const blackout = fetch(`${this.apiEndpoint}/state/blackout`)
             .then(d => d.json());
         const states = await Promise.all([rumble, blackout]);
         if (states.length === 2) {
             this.isBlackoutAll = states[1].data.active;
             this.isRumbleAll = states[0].data.active;
         } else {
             console.log('error fetching states');
         }

     },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     mounted() {
         //this.socket =  new WebSocket(this.socketServer);
         console.log(this.socket)

         this.socket.onopen = (e) => {
             this.socket.send(`this-is-webclient___${generateRandomString(6)}`);
         }

         this.socket.onmessage = (e) => {
             //console.log(e.data)
             if (!e.data.includes('server-says')) {
                 let data = JSON.parse(e.data);

                 switch(data.subject) {
                     case 'new-light':
                         console.log(data.body);
                         this.store.addMore([data.body]);
                         break;
                     case 'new-sensor':
                         console.log(data.body);
                         this.store.addMore([data.body]);
                         break;
                     case 'new-actuator':
                         console.log(data.body);
                         this.store.addMore([data.body]);
                         break;
                     case 'rumbleAll':
                         this.isRumbleAll = data.body.active
                         break;
                     case 'blackout':
                         this.isBlackoutAll = data.body.active
                         break;
                     case 'change-single-device':
                         this.store.toggleSingle(data.body);
                         break;
                     case 'sensorReading':
                         this.store.updateSingle(data.body);
                         break;
                     case 'sensorTriggered':
                         this.store.updateSingle(data.body)
                         break;
                     case 'dmx-updated':
                         this.store.updateDMX(data.body);
                         break;
                     default:
                         console.log('Dont know this ditty')
                 }
             }

         }
     },
     methods: {
         sendRumbleAll() {
             this.genericSend('requestRumbleAll');
         },
         sendBlackoutAll() {
             this.genericSend('requestBlackoutAll');
         },
         sendRandomLightup() {
             this.genericSend('requestRandomLightup');
         },
         genericSend(subject) {
             if (this.socket) {
                 let s = { subject,
                           body: { //p: this.ip,
                               type: 'webclient' }};
                 this.socket.send(JSON.stringify(s));
             }
         },

     }
 }
</script>
