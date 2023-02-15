<template>
    <ul v-if="lights.length" class="mbs32">
        <li v-for="light in lights">
            <SingleLight :item="light" />
        </li>
    </ul>
    <div v-else>No lights yet</div>
</template>

<script>
 import SingleLight from '@/components/SingleLight.vue';

 export default {
     name: 'ListLights',
     components: { SingleLight },
     data() {
         return {
             lights: ['light']
         }
     },
     inject: ['apiEndpoint'],
     async created() {
         console.log(this.$socket)


         let result = await fetch(`${this.apiEndpoint}/devices`).then(d => d.json());
         if (result.message === 'success') {
             console.log(result.data)
             this.lights = result.data;
         } else {
             console.log("Error fetching data");
         }
     }
 }
</script>
