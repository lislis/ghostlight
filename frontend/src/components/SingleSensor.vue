<template>
    <div class="flex justify-between items-center p4">
        <div class="mie24">
            <span>socket: {{ item.socketID }}</span><br>
            <span>device: {{ item.deviceID }}</span>
        </div>
        <div class="flex justify-between">
            <div class="" >
                <span>Resistance value</span><br>
                <input :value="item.value" type="number" readonly />
            </div>
            <div>
                <span>Threshold {{ item.threshold }}</span><br>
                <input :value="item.threshold" type="number" @change="changeTheshold" />
            </div>
        </div>
    </div>
</template>
<script>
 export default {
     name: 'SingleSensor',
     props: ['item'],
     inject: ['apiEndpoint', 'socket'],
     mouted() {
         this.socket.on('sensorValueChanged', (data) => {
             if (data.socketID === this.item.socketID) {
                 this.item.value = data.value;
             }
         });
     },
     methods: {
         changeTheshold(ev) {
             console.log(ev.target.value);
             this.socket.emit('changeSensorThreshold', { socketID: this.item.socketID,
                                                         deviceID: this.item.deviceID,
                                                         value: ev.target.value })
         }
     }
 }
</script>
