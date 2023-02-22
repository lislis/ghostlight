import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('devices', {
    state: () => ({
        devices: [],
    }),
    getters: {
        all(state) {
            return state.devices;
        },
        byType: (state) => {
            return (type) => state.devices.filter(x => x.type === type);
        },
    },
    actions: {
        reset() {
            this.devices = [];
        },
        init(devices) {
            this.devices = devices;
        },
        addMore(devices) {
            devices.forEach((v, i) => {
                if (v && v.ip) {
                    let index = this.devices.findIndex(x => x.ip === v.ip);
                    if (index === -1) {
                        this.devices.push(v);
                    } else {
                        this.devices.splice(index, 1, v);
                    }
                } else {
                    console.log('error', v);
                }

            });
        },
        toggleSingle(socketObj) {
            let index = this.devices.findIndex(x => x.ip === socketObj.ip
                                               && x.deviceID === socketObj.deviceID);
            if (index === -1) {
                console.log('error device not found, mismatch server-client data??');
            } else {
                this.devices[index][socketObj.type] = socketObj.active;
            }
        },
        updateSingle(obj) {
            let index = this.devices.findIndex(x => x.ip === obj.ip
                                               && x.deviceID === obj.deviceID);
            if (index === -1) {
                console.log('error device not found, mismatch server-client data??');
            } else {
                this.devices[index][obj.type] = obj.value;
            }
        }
    }
});
