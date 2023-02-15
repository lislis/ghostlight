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
     props: ['isBlackoutAll', 'isRumbleAll'],
     components: { StateToggle, StatelessBtn },
     methods: {
         async rumbleAll() {
             this.$emit('rumbleAll');
             /*
             let result = await fetch(`${this.apiEndpoint}/rumble`, {method: 'POST'})
                 .then(d => d.json());

             if (result && result.message === 'success') {

                 this.isRumbleAll = result.data.active;
             } else {
                 console.log('something went wrong');
             }
             */
         },
         async blackoutAll() {
             this.$emit('blackoutAll');

             /*
             let result = await fetch(`${this.apiEndpoint}/blackout`, {method: 'POST'})
                 .then(d => d.json());
             if (result && result.message === 'success') {
                 this.isBlackoutAll = result.data.active;
             } else {
                 console.log('something went wrong');
             }
             */
         },
         async randomLightup() {
             this.$emit('randomLightup');
             /*
             let result = await fetch(`${this.apiEndpoint}/randomLights`, {method: 'POST'})
                 .then(d => d.json());
             if (result && result.message === 'success') {
                 console.log('Random lightup successful');
             } else {
                 console.log('something went wrong');
             }
             */
         }
     }
 }
</script>
