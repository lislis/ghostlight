<template>
    <div class="state-toggle mis14 mie14">
        <div>
            <span v-if="stateActive">✅ </span>
            <span v-else>🚫 </span>
            <span>{{ label }}</span>
        </div>
        <button class="pie8 pis8  pbs2" type="button" @click="$emit('clickedToggle')">
            <span v-if="stateActive">Deactivate</span>
            <span v-else>Activate</span>
        </button>
    </div>
</template>
<script>
 export default {
     name: 'StateToggle',
     props: ['label', 'stateActive'],
 }
</script>
