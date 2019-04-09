<template>
    <Page class="page">

        <StackLayout class="card">

            <label class="h1" :text="device.name" horizontalAlignment="center"/>

            <StackLayout class="imgContainer">
            </StackLayout>
                        
            <Button class="mainBtn">Connect</Button>

        </StackLayout>

    </Page>
</template>
<script>

export default {
    data() {
        return {
        status: "nicht-verbunden"
        };
    },
    props: ['device'],
    async mounted(){
        
    },
    methods: {
        
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.imgContainer{
    background-color: $blue-dark;
    width: 270px;
    height: 270px;
    border-radius: 100%;

    margin-top: 40px;
    margin-bottom: 100px;
}

</style>
