<template>
    <Page class="page">
        <StackLayout >
            
            <label class="title" text="Devices" />


            <Button text="Refresh" @tap="onButtonTap"/>
            <StackLayout class="card" v-for="d in devices" v-bind:key="d.name" orientation="horizontal" @tap="onDeviceTap(d)" verticalAlignment="center">

                <StackLayout class="imgContainer">
                </StackLayout>

                <StackLayout class="descContainer">
                    <Label class="h2" :text="d.name" />"
                </StackLayout>

            </StackLayout>
        </StackLayout>
    </Page>
</template>
<script>
import {loadDevices} from '../apiBindings';
import DeviceDetailPage from './DeviceDetailPage'

export default {
    components: {
        DeviceDetailPage
    },
    data() {
        return {
        devices: []
        };
    },
    async mounted(){
        await this.onButtonTap();
    },
    methods: {
        async onButtonTap() {

            this.devices = [];

            console.log("Start loading devices");
            let devices = await loadDevices();
            console.log(devices.length +  " devices loaded.");

            this.devices = devices;
        },
        onDeviceTap(device){

            console.log("DeviceTap: " + device.name)

            // On success navigate to page
            var options = {
                props: {
                    device: device,
                }
            }

            this.$navigateTo(DeviceDetailPage, options);
        }
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.imgContainer{
    background-color: $blue-dark;
    width: 100px;
    height: 100px;
    border-radius: 100px;
}

.descContainer{
    margin-left: 20px;
}

</style>
