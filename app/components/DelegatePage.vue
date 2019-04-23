<template>
    <Page class="page">

        <ActionBar title="Delegation">
            
        </ActionBar>

        <StackLayout>
        
            <StackLayout class="imgContainer">
                <Image :src="device.imageUrl" stretch="aspectFill" />
            </StackLayout>


            <StackLayout v-if="encodedDevice == null">
                <StackLayout class="input-field">
                    <TextField v-model="username" class="input" hint="Receiver username" keyboardType="email" autocorrect="false" autocapitalizationType="none"></TextField>
                </StackLayout>
                <Button :isEnabled="username!=null" text="Delegate Access Rights" class="mainBtn" @tap="onSaveTab"></Button>
            </StackLayout>
            <StackLayout v-else>
                <Label>
                    <FormattedString>
                        <Span text="Copy the following text and send it to " ></Span>
                        <Span :text="username" fontAttributes="Bold"></Span>
                    </FormattedString>
                </Label>
                <TextView editable="false" v-model="encodedDevice" />
            </StackLayout>
        </StackLayout>

    </Page>
</template>
<script>
import {delegateAccessRights} from '../controllers/DelegationController';

export default {
    data() {
        return {
            username: null,
            encodedDevice: null
        };
    },
    props: ['device'],
    async mounted(){
        
    },
    methods: {
        async onSaveTab(){
            
            this.encodedDevice = await delegateAccessRights(this.device, this.username);
        }
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

TextView{
    background-color: $background-dark;
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
