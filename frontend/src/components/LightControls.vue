<template>
    <div class="flex">
        <StateToggle label="Rumble all"
                     :stateActive="isRumbleAll"
                     @clickedToggle="rumbleAll" />
        <StateToggle label="Blackout all"
                     :stateActive="isBlackoutAll"
                     @clickedToggle="blackoutAll" />
        <StatelessBtn label="Lightup random" @clickedBtn="randomLightup" />
    </div>
</template>
<script>
 import StateToggle from '@/components/StateToggle.vue'
 import StatelessBtn from '@/components/StatelessBtn.vue'

 export default {
     name: 'LightControls',
     inject: ['apiEndpoint', 'socket'],
     components: { StateToggle, StatelessBtn },
     data() {
         return {
             isBlackoutAll: false,
             isRumbleAll: false
         }
     },
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
     methods: {
         async rumbleAll() {
             let result = await fetch(`${this.apiEndpoint}/rumble`, {method: 'POST'})
                 .then(d => d.json());

             if (result && result.message === 'success') {

                 this.isRumbleAll = result.data.active;
             } else {
                 console.log('something went wrong');
             }
         },
         async blackoutAll() {
             //this.socket.emit('makeBlackout');


             let result = await fetch(`${this.apiEndpoint}/blackout`, {method: 'POST'})
                 .then(d => d.json());
             if (result && result.message === 'success') {
                 this.isBlackoutAll = result.data.active;
             } else {
                 console.log('something went wrong');
             }
         },
         async randomLightup() {
             let result = await fetch(`${this.apiEndpoint}/randomLights`, {method: 'POST'})
                 .then(d => d.json());
             if (result && result.message === 'success') {
                 console.log('Random lightup successful');
             } else {
                 console.log('something went wrong');
             }
         }
     }
 }
</script>
