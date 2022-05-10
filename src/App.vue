<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark
        >
            <div class="d-flex align-center">
                <h2>Mobile Robotics Lab</h2>
            </div>

            <v-spacer></v-spacer>

            <WebsocketConnection/>
        </v-app-bar>

        <v-main>
            <HelloWorld/>
        </v-main>
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import WebsocketConnection from "@/components/WebsocketConnection";

export default {
    name: 'App',

    components: {
        WebsocketConnection,
        HelloWorld,
    },

    data: () => ({
        //
    }),
};
</script>
