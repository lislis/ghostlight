<template>
    <div class="flex justify-between items-center p4">
        <div class="mie24">
            <span>ip: {{ item.ip }}</span><br>
            <span>device: {{ item.deviceID }}</span>
        </div>
        <div class="flex">
            <div class="mis14 mie14">
                <span>Physical switch<br>{{ item.switch }}</span>
            </div>
            <StateToggle label="Light" :stateActive="item.light" @clickedToggle="toggleLight" />
            <StateToggle label="Rumble" :stateActive="item.rumble" @clickedToggle="toggleRumble" />
        </div>
    </div>
</template>
<script>
 import { Switch } from "agnostic-vue";
 import StateToggle from "@/components/StateToggle.vue"

 export default {
     name: 'SingleLight',
     props: ['item'],
     inject: ['apiEndpoint', 'socket'],
     components: { StateToggle },
     methods: {
         async toggleLight() {
             this.socket.emit('changeDevice', { sockedID: this.item.socketID,
                                                 deviceID: this.item.deviceID,
                                                 type: 'light' });

             // do we even need this if we can use socket to communicate the change?
             /*
             let result = await fetch(`${this.apiEndpoint}/light/${this.item.socketID}`).then(d => d.json());
             if (result && result.message === 'success') {
                 // we don't need to manually save here
                 // since the websocket event should take care of that for us
                 console.log('Success toggle light ', this.item.socketID);
             } else {
                 console.log('Something went wrong toggling light ', this.item.socketID);
             }
             */
         },
         async toggleRumble() {
             this.socket.emit('changeDevice', { sockedID: this.item.socketID,
                                                 deviceID: this.item.deviceID,
                                                 type: 'rumble' });

             /*
                let result = await fetch(`${this.apiEndpoint}/rumble/${this.item.socketID}`).then(d => d.json())
                if (result && result.message === 'success') {
                // we don't need to manually save here
                // since the websocket event should take care of that for us
                console.log('Success toggle rumble ', this.item.socketID);
                } else {
                console.log('Something went wrong toggling rumble ', this.item.socketID);
                }
              */
         }
     }
 }
</script>
