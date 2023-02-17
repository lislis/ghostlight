<template>
    <ul v-if="store.byType('sensor').length">
        <li v-for="sensor in store.byType('sensor')">
            <SingleSensor :item="sensor" />
        </li>
    </ul>
    <div v-else>No sensors yet</div>
</template>

<script>
 import SingleSensor from '@/components/SingleSensor.vue';
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'ListSensors ',
     components: { SingleSensor },
     data() {
         return {
             //sensors: []
         }
     },
     setup() {
         const store = useDeviceStore();
         //console.log(store)
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/sensors`).then(d => d.json());
         if (result.message === 'success') {
             //this.sensors = result.data;
             this.store.addMore(result.data);
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
