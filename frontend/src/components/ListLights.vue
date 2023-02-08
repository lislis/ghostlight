<template>
    <ul v-if="lights.length">
        <li v-for="light in lights">
            <SingleLight :light="light" />
        </li>
    </ul>
    <div v-else>No lights yet</div>
</template>

<script>
 import SingleLight from '@/components/SingleLight';

 export default {
     name: 'ListLights',
     components: { SingleLight },
     data() {
         return {
             lights: []
         }
     },
     inject: ['apiEndpoint'],
     async created() {
         console.log(this.$socket)

         let result = await fetch(`${this.apiEndpoint}/devices`).then(d => d.json());
         if (result.message === 'success') {
             this.lights = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
