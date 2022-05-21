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
            <v-divider class="ma-3"/>
            <div class="d-flex align-center justify-center flex-column">
                <p>{{frameCount}} frames</p>
                <v-btn @click="saveFrames" class="mb-3">
                    <v-icon left>mdi-cloud-download</v-icon>
                    Save Frame Data
                </v-btn>

                <input type="file" hidden ref="fileInput" @change="fileChange"/>
                <v-btn @click="loadFrames">
                    <v-icon left>mdi-cloud-upload</v-icon>
                    Load Frame Data
                </v-btn>
            </div>

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
import { saveAs } from 'file-saver';

// From https://stackoverflow.com/a/66387148
async function fileToJSON(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = event => resolve(JSON.parse(event.target.result));
        fileReader.onerror = error => reject(error);
        fileReader.readAsText(file);
    });
}

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
    computed: {
        frameCount() {
            return this.$store.state.frames.length;
        }
    },
    methods: {
        async fileChange(event) {
            const data = await fileToJSON(event.target.files[0]);
            console.log(data);
            this.$store.commit('loadState', data);
        },
        saveFrames() {
            const stateStr = JSON.stringify(this.$store.state);
            const bytes = new TextEncoder().encode(stateStr);
            const blob = new Blob([bytes], {
                type: 'application/json;charset=utf-8'
            });

            saveAs(blob, 'frames.json');
        },
        loadFrames() {
            this.$refs.fileInput.click();
        }
    }
};
</script>
