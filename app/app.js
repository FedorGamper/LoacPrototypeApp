import Vue from "nativescript-vue";

import LoginPage from "./components/LoginPage";

Vue.config.silent = true;

new Vue({

    template: `
        <Frame>
            <LoginPage />
        </Frame>`,

    components: {
        LoginPage
    }

}).$start();
