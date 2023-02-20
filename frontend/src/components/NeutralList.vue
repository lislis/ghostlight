<template>
    <ul v-if="store.byType(type).length">
        <li v-for="item in store.byType(type)">
            <div class="flex">
            <DeviceLabel :device="item" />
            <Tag shape="round" is-uppercase >{{ item.type }}</Tag>
            </div>
        </li>
    </ul>
    <div v-else>No {{ label }} yet</div>
</template>
<script>
 import DeviceLabel from "@/components/DeviceLabel.vue"
 import { useDeviceStore } from '@/stores/devices';
 import { Tag } from "agnostic-vue";

 export default {
     name: 'NeutralList',
     props: ['label', 'path', 'type'],
     components: { DeviceLabel, Tag },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/${this.path}`).then(d => d.json());
         if (result.message === 'success') {
             this.store.addMore(result.data);
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
