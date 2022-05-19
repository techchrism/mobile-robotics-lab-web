<template>
    <v-app>
        <v-app-bar app color="primary" dark clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <div class="d-flex align-center">
                <h2>Lab Telemetry</h2>
            </div>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" absolute clipped>
            <WebsocketConnection/>
        </v-navigation-drawer>

        <v-main>
            <ArenaCanvas/>
        </v-main>
    </v-app>
</template>

<script>
import WebsocketConnection from "@/components/WebsocketConnection";
import FrameSidebar from "@/components/FrameSidebar";
import ArenaCanvas from "@/components/ArenaCanvas";

export default {
    name: 'App',

    components: {
        ArenaCanvas,
        FrameSidebar,
        WebsocketConnection
    },

    data: () => ({
        drawer: null
    }),
};
</script>
