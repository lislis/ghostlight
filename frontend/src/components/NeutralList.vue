<template>
    <ul v-if="store.byType(type).length">
    <li v-for="item in store.byType(type)">
        {{item.deviceID}} {{item.type}}<br>{{ item.ip }}
    </li>
</ul>
<div v-else>No {{ label }} yet</div>
</template>
<script>
 import { useDeviceStore } from '@/stores/devices';

 export default {
     name: 'NeutralList',
     props: ['label', 'path', 'type'],
     data() {
         return {
            // collection: []
         }
     },
     setup() {
         const store = useDeviceStore();
         //console.log(store)
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/${this.path}`).then(d => d.json());
         if (result.message === 'success') {
             this.store.addMore(result.data);
//             this.collection = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
