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
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/devices`).then(d => d.json());
         if (result.message === 'success') {
             //console.log(result.data)
             this.store.addMore(result.data);
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
