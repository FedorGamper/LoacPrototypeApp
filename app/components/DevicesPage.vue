<template>
    <Page class="page">

        <ActionBar title="Devices">
                <ActionItem @tap="onTapAdd"
                ios.systemIcon="4" ios.position="right"
                android.systemIcon="ic_menu_add" android.position="actionBar" />
        </ActionBar>

        <StackLayout >

            <button text="Logout" @tap="onLogout"/>

            <PullToRefresh @refresh="refreshList">
                <ListView for="d in devices">
                    <v-template>
                        <GridLayout class="card"  rows="150, 40, 60" @tap="onDeviceTap(d)">
                            
                            <Image row="0" col="0" :src="d.imageUrl" stretch="aspectFill" />
                            

                            <StackLayout row="1" col="0" class="titleContainer">
                                <Label class="h2 titleLbl" :text="d.name" horizontalAlignment="center" verticalAlignment="center"/>
                            </StackLayout>

                            <StackLayout row="2" col="0" class="detailContainer">
                                
                                <Label v-if="d.delegatedBy != null" horizontalAlignment="center">
                                    <FormattedString>
                                        <Span text="Delegated by " ></Span>
                                        <Span :text="d.delegatedBy" fontAttributes="Bold"></Span>
                                    </FormattedString>
                                </Label>

                                <Label class="detailLbl" :text="d.description" horizontalAlignment="center" verticalAlignment="center"/>
                            </StackLayout>
                        </GridLayout>
                    </v-template>
                </ListView>
            </PullToRefresh>

        </StackLayout>
    </Page>
</template>
<script>
import {loadDevices} from '../controllers/ApiController';
import DeviceDetailPage from './DeviceDetailPage'
import { logout, loadDevicesFromServer } from '~/controllers/LoginController';
import LoginPage from './LoginPage';
import { unpackReceivedAccessRights } from '~/controllers/DelegationController';
import { logUncatched } from '~/utils';

var dialogs = require("tns-core-modules/ui/dialogs");

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

            await this.updateList();
            
        },
        async refreshList(args) {

            var pullRefresh = args.object;
            
            await this.updateList();
            pullRefresh.refreshing = false;
        },
        async updateList(){

            let devices = await loadDevicesFromServer();
            this.devices = devices;
        },
        async onTapAdd(){

            const t = this;

            dialogs.prompt("Enter token", "").then(async function (r) {

                try{

                        if(r.result){
                        var result = await unpackReceivedAccessRights(r.text);
                        
                        console.log(result);
                        
                        if(result.success)
                        {
                            t.devices = t.devices.concat([result.device]);
                            console.log("Updated devices list with " + t.devices.length + " devices");
                        }
                        else{
                            
                            dialogs.alert(result.message).then(function() {
                                console.log("Dialog closed!");
                            });
                        }
                    }
                }
                catch(err)
                {
                    logUncatched(err);
                }
            });
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
    height: 100%;
}

.card{

    background-color: $blue-10;
    border-width: 4px;
    border-color: $blue-10;
    border-radius: 40px;
    margin: 20px;
}

.imgContainer{
    background-color: $blue-dark;
}

.titleContainer{

    background-color: $background-dark;

}

.detailContainer{

    background-color: $background-light;
}

.detailLbl, .titleLbl{

    margin: 10px;

}
</style>
