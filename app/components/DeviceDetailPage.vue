<template>
    <Page class="page">

        <StackLayout>

            <label class="h1" :text="device.name" horizontalAlignment="center"/>

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
            isAccessing: false,
            notFound: false
        };
    },
    props: ['device'],
    async mounted(){

        console.log("Device detail component mounted: " + this.device.name);
        await this.search();
        
    },
    async destroyed(){

        console.log("Device detail component destroyed");
        disconnectDevice(this.device);

    },
    methods: {
        
        async search(){

            this.isSearching = true;
            this.notFound = false;

            let success = await searchAndConnect(this.device);

            this.isSearching = false;

            if(success)
                this.isConnected = true;
            else
                this.notFound = true;
        },

        async onSearchAgain(){

            await this.search();
        },

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
