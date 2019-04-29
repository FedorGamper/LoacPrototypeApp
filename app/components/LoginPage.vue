<template>
  
    <Page class="page">
        <StackLayout class="form card" verticalAlignment="center">

            <label class="h1" text="LOAC" horizontalAlignment="center"/>

            <StackLayout class="input-field">
                <TextField v-model="username" class="input" hint="Username" keyboardType="email" autocorrect="false" autocapitalizationType="none"></TextField>
            </StackLayout>

            <StackLayout class="input-field">
                <TextField v-model="password" class="input" hint="Password" keyboardType="text" autocorrect="false" autocapitalizationType="none" secure="true"></TextField>
            </StackLayout>

            <ActivityIndicator :busy="busy"></ActivityIndicator>

            <Button text="Log In" class="mainBtn" @tap="onLogInTap"></Button>
            <label class="error" v-if="isFailed" text="Login Error" horizontalAlignment="center"/>

        </StackLayout>
    </Page>

</template>
<script>

import DevicesPage from './DevicesPage';
import {login, isLogedIn} from '../controllers/LoginController';

export default {
    data() {
        return {
            username: "batman",
            password: "password",
            busy: false,
            isFailed: false
        };
    },
    async mounted() {

        let alreadyLogenId = await isLogedIn();
        if(alreadyLogenId)
        {
            navigateToDevices(); 
        }
        
    },
    methods: {

        navigateToDevices(){

            console.log("Login success");
                this.$navigateTo(DevicesPage, {
                    clearHistory: true
                });
        },

        async onLogInTap(){

            this.busy = true;
            let success = await login(this.username, this.password);
            this.busy = false;


            if(success)
            {    
                this.navigateToDevices();
            }
            else
            {
                console.log("Login error");
                this.isFailed = true;
            }
        }
    }
};
</script>
<style scoped lang="scss">
@import '../app-variables';

.title{
    margin-bottom: 60px;
}

Button{

    margin-top: 60px;
}

.error{
    margin: 10px;
    color: $blue-50;
}

</style>
