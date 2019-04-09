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
            <Label class="noAccountText" text="Don’t have an account?" horizontalAlignment="center"/>
            
        </StackLayout>
    </Page>

</template>
<script>

import DevicesPage from './DevicesPage';
import {login} from '../controllers/LoginController';

export default {
    data() {
        return {
            username: "",
            password: "",
            busy: false,
        };
    },
    methods: {

        async onLogInTap(){

            this.busy = true;

            await login(this.username, this.password);
            
            this.busy = false;
            console.log("Login completed");
             this.$navigateTo(DevicesPage, {
                 clearHistory: true
             })
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

.form{
    vertical-align: middle;
}

.input-field{

    width: 90%;
    
    margin: 20px;
    padding: 20px;
    font-size: 40px;

    border-width: 1px;
    border-color: $blue-10;
}

.noAccountText{
    margin: 10px;
    color: $blue-50;
}

</style>
