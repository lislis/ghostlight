<template>
    <div class="stateless-btn mis14 mie14">
        <div>
            <span>{{ label }}</span>
        </div>
        <button class="pie8 pis8 pbs2" type="button" @click="$emit('clickedBtn')">
            <span>Do it!</span>
        </button>
    </div>
</template>
<script>
 export default {
     name: 'StatelessBtn',
     props: ['label'],
 }
</script>
