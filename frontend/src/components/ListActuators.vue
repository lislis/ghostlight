<template>
    <ul v-if="store.byType('dmx-windmachine').length">
        <li v-for="sensor in store.byType('dmx-windmachine')">
            <WindMachine :item="sensor" />
        </li>
    </ul>
    <div v-else>No actuators yet</div>
</template>

<script>
 import WindMachine from '@/components/WindMachine.vue';
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'ListActuators ',
     components: { WindMachine },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/other`).then(d => d.json());
         if (result.message === 'success') {
             this.store.addMore(result.data);
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
