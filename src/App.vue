<template>
    <v-app>
        <v-app-bar app color="primary" dark clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <div class="d-flex align-center">
                <h2>Lab Telemetry</h2>
            </div>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" clipped>
            <WebsocketConnection/>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid>
                <v-row>
                    <v-col cols="12" md="6">
                        <ArenaCanvas/>
                    </v-col>
                    <v-col cols="12" md="6">
                        <FrameInfo/>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import WebsocketConnection from "@/components/WebsocketConnection";
import FrameSidebar from "@/components/FrameSidebar";
import ArenaCanvas from "@/components/ArenaCanvas";
import FrameInfo from "@/components/FrameInfo";

export default {
    name: 'App',

    components: {
        FrameInfo,
        ArenaCanvas,
        FrameSidebar,
        WebsocketConnection
    },

    data: () => ({
        drawer: null
    }),
};
</script>
