<template>
    <ul v-if="sensors.length">
        <li v-for="sensor in sensors">
            <SingleSensor :item="sensor" />
        </li>
    </ul>
    <div v-else>No sensors yet</div>
</template>

<script>
 import SingleSensor from '@/components/SingleSensor.vue';
 
 export default {
     name: 'ListSensors ',
     components: { SingleSensor },
     data() {
         return {
             sensors: []
         }
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/sensors`).then(d => d.json());
         if (result.message === 'success') {
             this.sensors = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
