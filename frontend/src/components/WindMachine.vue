<template>
    <div class="flex justify-between items-center p4">
        <DeviceLabel :device="item" />

        <div class="flex justify-between">
             <div class="mie24">
                 <span>RED {{item.channels[1]}}</span><br>
                 <input type="range" name="1" min="0" max="255" steps="50" @change="sendData" />
             </div>
             <div class="mie24">
                 <span>GREEN {{item.channels[2]}}</span><br>
                 <input type="range" name="2" min="0" max="255" steps="50" @change="sendData" />
             </div>
             <div class="mie24">
                 <span>BLUE {{item.channels[3]}}</span><br>
                 <input type="range" name="3" min="0" max="255" steps="50" @change="sendData"/>
             </div>
             <div class="mie24">
                 <span>WIND {{item.channels[4]}}</span><br>
                 <input type="range" name="4" min="0" max="255" steps="50" @change="sendData" />
             </div>
             <div class="mie24">
                 <span>HALLWAY {{item.channels[5]}}</span><br>
                 <input type="range" name="5" min="0" max="255" steps="50" @change="sendData" />
             </div>

        </div>
    </div>
</template>
<script>
 import DeviceLabel from "@/components/DeviceLabel.vue";
 import { useDeviceStore } from '@/stores/devices';
 import StateToggle from "@/components/StateToggle.vue"

 export default {
     name: 'SingleSensor',
     props: ['item'],
     inject: ['socket'],
     components: { DeviceLabel, StateToggle },
     setup() {
         const store = useDeviceStore();
         return { store };
     },
     methods: {
         sendData(ev) {
             console.log(ev.target.name, ev.target.value)
             //console.log(ev.target.value, '---', data);
             let body = this.createBody(ev.target.name, ev.target.value);
             this.store.updateSingle(body);
             this.socket.send(JSON.stringify({ subject: 'sendDmxData', body}));
         },
         createBody(key, value) {
             return { ip: this.item.ip,
                      deviceID: this.item.deviceID,
                      value,
                      type: key };
         }
     }
 }
</script>
