<template>
<ul v-if="collection.length">
    <li v-for="item in collection">
        {{ item }}
    </li>
</ul>
<div v-else>No {{ label }} yet</div>
</template>
<script>
export default {
     name: 'NeutralList',
     props: ['label', 'path'],
     data() {
         return {
             collection: []
         }
     },
     inject: ['apiEndpoint'],
     async created() {
         let result = await fetch(`${this.apiEndpoint}/${this.path}`).then(d => d.json());
         if (result.message === 'success') {
             this.collection = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
}
</script>
