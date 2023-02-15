<template>
    <main class="flex m24">
        <div class="mie32 ">
            <ul>
                <li><a href="#flashlights">Flashlights</a></li>
                <li><a href="#sensors">Sensors</a></li>
                <li><a href="#actuators">Actuators</a></li>
            </ul>
        </div>
        <div class="flex-grow-1 mis32">
            <h1>Network</h1>

            <section id="flashlights" class="mbe36">
                <div class="flex items-end justify-between">
                    <h2>Flashlights</h2>
                    <LightControls @rumbleAll="sendRumbleAll"
                                   @blackoutAll="sendBlackoutAll"
                                   @randomLightup="sendRandomLightup"
                                   :isBlackoutAll="isBlackoutAll"
                                   :isRumbleAll="isRumbleAll" />
                </div>
                <ListLights />
            </section>
            <section id="sensors" class="mbe36">
                <h2>Sensors</h2>
                <ListSensors />

            </section>
            <section id="other" class="mbe36">
                <h2>Other</h2>
                <NeutralList label="Other" path="other" />

            </section>

            <section id="actuators" class="mbe36">
                <h2>Actuators</h2>

            </section>
        </div>
    </main>
</template>
<script>
 import ListLights from '@/components/ListLights.vue'
 import LightControls from '@/components/LightControls.vue';
 import ListSensors from '@/components/ListSensors.vue';
 import NeutralList from '@/components/NeutralList.vue';
 import { generateRandomString } from '@/utils';

 export default {
     name: 'HomeView',
     components: { ListSensors, ListLights, LightControls, NeutralList },
     data() {
         return {
             socket: null,
             isBlackoutAll: false,
             isRumbleAll: false
         };
     },
     inject: ['deviceID'],
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
     mounted() {
         console.log(this.deviceID);
         let socket = new WebSocket("ws://127.0.0.1:3000");
         this.socket = socket;
         let self = this;

         this.socket.onmessage = function(e){
             console.log(e)


             let data = JSON.parse(e.data);

             switch(data.subject) {
                 case 'register-pls':
                     console.log(data)

                     let s = { subject: 'registration',
                               body: {
                                   ip: data.body.ip,
                                   deviceID: generateRandomString(6),
                                   type: 'webclient'
                               }
                     };
                     socket.send(JSON.stringify(s));
                     break;
                 case 'rumbleAll':
                     self.isRumbleAll = data.body.active
                     break;
                 case 'blackout':
                     self.isBlackoutAll = data.body.active
                     break;
                 case 'lightup':
                     console.log(`lighting up this client: ${data.body.client}`)
                     break;
                 default:
                     console.log('Dont know this ditty')
             }
         }
     },
     methods: {
         sendRumbleAll() {
             this.genericSend('requestRumbleAll');
         },
         sendBlackoutAll() {
             this.genericSend( 'requestBlackoutAll');
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
         }
     }
 }
</script>
