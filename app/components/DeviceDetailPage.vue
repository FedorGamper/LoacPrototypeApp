<template>
    <Page class="page">

        <ActionBar :title="device.name">
            <ActionItem @tap="onTapShare"
                ios.systemIcon="9" ios.position="right"
                android.systemIcon="ic_menu_share" android.position="actionBar" />
        </ActionBar>

        <StackLayout>

            <StackLayout class="imgContainer">
                <Image :src="device.imageUrl" stretch="aspectFill" />
            </StackLayout>

            <StackLayout>
                <Label v-if="isSearching" text="Searching..." horizontalAlignment="center"/>
                <ActivityIndicator :busy="isSearching"></ActivityIndicator>
                <button v-if="notFound" text="Search again" @tap="onSearchAgain"/>
            </StackLayout>
                
            <StackLayout v-if="isConnected">
                <ActivityIndicator :busy="isAccessing"></ActivityIndicator>
                <Label v-if="isConnected" text="Connected" horizontalAlignment="center"/>

                <StackLayout v-for="btn in device.buttons" v-bind:key="btn.command">
                    <Button :text="btn.text" class="mainBtn" @tap="onOpenTap(btn.command)"/>
                </StackLayout>

            </StackLayout>
            
                    
        </StackLayout>

    </Page>
</template>
<script>
import {searchAndConnect, access, disconnectDevice, debugAccessRequest} from '../controllers/AccessController';
import DelegatePageVue from './DelegatePage.vue';


export default {
    data() {
        return {

            isSearching: false,
            isConnected: false,
            isAccessing: false,
            notFound: false,
            deviceUuid: "null"
        };
    },
    props: ['device'],
    async mounted(){

        console.log("Device detail component mounted: " + this.device.name);
        await this.search();

        await debugAccessRequest(this.device, "foobar");
        
    },
    async destroyed(){

        console.log("Device detail component destroyed");
        disconnectDevice(this.deviceUuid);

    },
    methods: {
        
        async search(){

            this.isSearching = true;
            this.notFound = false;

            let result = await searchAndConnect(this.device);

            this.isSearching = false;
            console.log(result);
            if(result.success)
            {
                this.isConnected = true;
                this.deviceUuid = result.uuid;
            }   
            else
            {
                this.notFound = true;
            }
        },

        async onSearchAgain(){

            await this.search();
        },

        async onOpenTap(command){

            this.isAccessing = true;
            await access(this.device, this.deviceUuid, command);
            this.isAccessing = false;
        },

        async onTapShare(){

            var options = {
                props: {
                    device: this.device,
                }
            }

            this.$navigateTo(DelegatePageVue, options);

        }
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.h1{
    margin: 20px;
}

.imgContainer{

    border-color: $blue-dark;
    border-width: 4px;
    border-style: solid;

    background-color: $blue-dark;
    width: 270px;
    height: 270px;
    border-radius: 100%;

    margin-top: 40px;
    margin-bottom: 100px;
}

Button{
    margin-bottom: 20px;
}

</style>
