<template>
    <ul v-if="store.byType('light').length" class="mbs32">
        <li v-for="light in store.byType('light')">
            <SingleLight :item="light" />
        </li>
    </ul>
    <div v-else>No lights yet</div>
</template>

<script>
 import SingleLight from '@/components/SingleLight.vue';
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'ListLights',
     components: { SingleLight },
     data() {
         return {
             //lights: ['light']
         }
     },
     setup() {
         const store = useDeviceStore();
         //console.log(store)
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         //console.log(this.$socket)

         let result = await fetch(`${this.apiEndpoint}/devices`).then(d => d.json());
         if (result.message === 'success') {
             console.log(result.data)
             this.store.addMore(result.data);
             //this.lights = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
