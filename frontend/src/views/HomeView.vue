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
                    <LightControls />
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
 import SocketioService from "@/services/SocketioService.js";
 import { generateRandomString } from '@/utils'

 export default {
     name: 'HomeView',
     components: { ListSensors, ListLights, LightControls, NeutralList },
     data() {
         return {
             socket: null,
         };
     },
     provide() {
         return {
             socket: this.socket
         }
     },
     inject: ['deviceID'],
     mounted() {
         const socket = SocketioService.setupSocketConnection();

         socket.on("connect", (data) => {
             socket.emit("register", { id: this.deviceID, type: 'webclient', socketID: socket.id });

            // socket.emit("register", { id: generateRandomString(8), type: 'flashlight', socketID: socket.id });

            // socket.emit("register", { id: generateRandomString(8), type: 'sensor', socketID: socket.id });
         })

         socket.on("blackout", (data) => {
             console.log('received balckoput event')

             console.log(this.$q)
         });
     },
 }
</script>
