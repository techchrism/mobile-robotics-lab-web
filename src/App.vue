<template>
    <v-app>
        <v-app-bar
            app
            color="primary"
            dark
            clipped-left
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <div class="d-flex align-center">
                <h2>Mobile Robotics Lab Telemetry</h2>
            </div>

            <v-spacer></v-spacer>

            <WebsocketConnection/>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" absolute clipped>
            <FrameSidebar/>
        </v-navigation-drawer>

        <v-main>
            <HelloWorld/>
        </v-main>
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import WebsocketConnection from "@/components/WebsocketConnection";
import FrameSidebar from "@/components/FrameSidebar";

export default {
    name: 'App',

    components: {
        FrameSidebar,
        WebsocketConnection,
        HelloWorld,
    },

    data: () => ({
        drawer: null
    }),
};
</script>
