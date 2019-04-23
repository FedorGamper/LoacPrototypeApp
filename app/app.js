import Vue from "nativescript-vue";

import LoginPage from "./components/LoginPage";

Vue.config.silent = true;

Vue.registerElement(
    'PullToRefresh',
    () => require('nativescript-pulltorefresh').PullToRefresh
);


new Vue({

    template: `
        <Frame>
            <LoginPage />
        </Frame>`,

    components: {
        LoginPage
    }

}).$start();
