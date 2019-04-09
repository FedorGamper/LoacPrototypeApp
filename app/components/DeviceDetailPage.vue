<template>
    <Page class="page">

        <StackLayout>

            <label class="h1" :text="device.name" horizontalAlignment="center"/>

            <StackLayout class="imgContainer">
            </StackLayout>

            <StackLayout v-if="isSearching">
                <Label text="Searching..." horizontalAlignment="center"/>
                <ActivityIndicator :busy="isSearching"></ActivityIndicator>
            </StackLayout>
            <StackLayout v-else>
                <Label text="Connected" horizontalAlignment="center"/>
            </StackLayout>

            
            <StackLayout v-if="isConnected">
                <Button class="mainBtn">Open</Button>
            </StackLayout>
            
                    
        </StackLayout>

    </Page>
</template>
<script>
import {searchAndConnect} from '../controllers/AccessController';


export default {
    data() {
        return {

            isSearching: false,
            isConnected: false
        };
    },
    props: ['device'],
    async mounted(){

        console.log("Device detail mounted: " + this.device.name);

        this.isSearching = true;

        await searchAndConnect(this.device);
        this.isSearching = false;
        this.isConnected = true;
    },
    methods: {
        
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.h1{
    margin: 20px;
}

.imgContainer{
    background-color: $blue-dark;
    width: 270px;
    height: 270px;
    border-radius: 100%;

    margin-top: 40px;
    margin-bottom: 100px;
}

</style>
