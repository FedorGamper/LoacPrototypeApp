<template>
    <Page class="page">

        <StackLayout>

            <label class="h1" :text="device.name" horizontalAlignment="center"/>

            <StackLayout class="imgContainer">
                <Image :src="device.imageUrl" stretch="aspectFill" />
            </StackLayout>

            <StackLayout v-if="isSearching">
                <Label text="Searching..." horizontalAlignment="center"/>
                <ActivityIndicator :busy="isSearching"></ActivityIndicator>
            </StackLayout>
            <StackLayout v-else>
                <Label text="Connected" horizontalAlignment="center"/>
            </StackLayout>

            <StackLayout v-if="isConnected">
                <ActivityIndicator :busy="isAccessing"></ActivityIndicator>
                <Button class="mainBtn" @tap="onOpenTap">Open</Button>
            </StackLayout>
            
                    
        </StackLayout>

    </Page>
</template>
<script>
import {searchAndConnect, access, disconnectDevice} from '../controllers/AccessController';


export default {
    data() {
        return {

            isSearching: false,
            isConnected: false,
            isAccessing: false
        };
    },
    props: ['device'],
    async mounted(){

        console.log("Device detail component mounted: " + this.device.name);

        this.isSearching = true;

        await searchAndConnect(this.device);
        this.isSearching = false;
        this.isConnected = true;
    },
    async destroyed(){

        console.log("Device detail component destroyed");
        disconnectDevice(this.device);

    },
    methods: {
        
        async onOpenTap(){

            this.isAccessing = true;
            await access(this.device);
            this.isAccessing = false;
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

</style>
