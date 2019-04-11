<template>
    <Page class="page">
        <StackLayout >
            
            <label class="h1" text="Devices" />

            <button text="Logout" @tap="onLogout"/>

            <ListView for="d in devices" @itemTap="onItemTap">
                <v-template>
                    <GridLayout class="card"  rows="150, 40, 60" @tap="onDeviceTap(d)">
                        
                        <Image row="0" col="0" :src="d.imageUrl" stretch="aspectFill" />
                        

                        <StackLayout row="1" col="0" class="titleContainer">
                            <Label class="h2 titleLbl" :text="d.name" horizontalAlignment="center" verticalAlignment="center"/>
                        </StackLayout>

                        <StackLayout row="2" col="0" class="detailContainer">
                            <label class="detailLbl" :text="d.description" horizontalAlignment="center" verticalAlignment="center"/>
                        </StackLayout>
                    </GridLayout>
                </v-template>
            </ListView>

        </StackLayout>
    </Page>
</template>
<script>
import {loadDevices} from '../apiBindings';
import DeviceDetailPage from './DeviceDetailPage'
import { logout } from '~/controllers/LoginController';
import LoginPage from './LoginPage';


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
        },
        onLogout(){

            var success = logout();
            if(success)
            {
                this.$navigateTo(LoginPage, {
                    clearHistory: true
                });
            }
        }
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.h1{
    margin: 20px;
}

ListView{
    background-color: $background-dark;
    height: 80%;
}

.card{

    background-color: $blue-10;
    border-width: 2px;
    border-color: $blue-10;
    border-radius: 40px;
    margin: 20px;
}

.imgContainer{
    background-color: $blue-dark;
}

.titleContainer{

    background-color: $blue-20;

}

.detailContainer{

    background-color: $blue-10;
}

.detailLbl, .titleLbl{

    margin: 10px;

}

</style>
