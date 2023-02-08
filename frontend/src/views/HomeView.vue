<script setup>
import ListLights from '@/components/ListLights.vue'
</script>

<template>
    <main class="flex m24">
        <div class="mie32 ">
            <ul>
                <li><a href="#flashlights">Flashlights</a></li>
                <li><a href="#sensors">Sensors</a></li>
                <li><a href="#actuators">Actuators</a></li>
            </ul>
        </div>
        <div class="flex-grow-1 mis32">
            <h1>Network</h1>

            <section id="flashlights">
                <h2>Flashlights</h2>
                <ListLights />
            </section>
            <section id="sensors">
                <h2>Sensors</h2>

            </section>
            <section id="actuators">
                <h2>Actuators</h2>

            </section>
        </div>
    </main>
</template>
