<template>
    <v-app>
        <v-app-bar app color="primary" dark clipped-left>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <div class="d-flex align-center">
                <h2>Lab Telemetry</h2>
            </div>
            <v-spacer></v-spacer>
            <DarkButton/>
        </v-app-bar>

        <v-navigation-drawer app v-model="drawer" clipped>
            <WebsocketConnection @error="onError"/>
            <v-divider class="ma-3"/>
            <div class="d-flex align-center justify-center flex-column">
                <p>{{frameCount}} frames</p>
                <v-btn @click="saveFrames" class="mb-3">
                    <v-icon left>mdi-cloud-download</v-icon>
                    Save Frame Data
                </v-btn>

                <input type="file" hidden ref="fileInput" @change="fileChange"/>
                <v-btn @click="loadFrames" class="mb-3">
                    <v-icon left>mdi-cloud-upload</v-icon>
                    Load Frame Data
                </v-btn>

                <FramePlayback/>
            </div>

        </v-navigation-drawer>

        <v-main>
            <v-snackbar v-model="errorSnackbar" color="error" bottom>
                {{error}}
                <template v-slot:action="{ attrs }">
                    <v-btn
                        text
                        v-bind="attrs"
                        @click="errorSnackbar = false"
                    >
                        Close
                    </v-btn>
                </template>
            </v-snackbar>

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
import FramePlayback from "@/components/FramePlayback";
import DarkButton from "@/components/DarkButton";

// From https://stackoverflow.com/a/66387148
async function fileToJSON(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                resolve(JSON.parse(event.target.result));
            } catch(e) {
                reject(e);
            }
        }
        fileReader.onerror = error => reject(error);
        fileReader.readAsText(file);
    });
}

export default {
    name: 'App',
    components: {
        DarkButton,
        FramePlayback,
        FrameInfo,
        ArenaCanvas,
        FrameSidebar,
        WebsocketConnection
    },
    data: () => ({
        drawer: null,
        errorSnackbar: false,
        error: ''
    }),
    computed: {
        frameCount() {
            return this.$store.state.frames.length;
        }
    },
    methods: {
        async fileChange(event) {
            try {
                const data = await fileToJSON(event.target.files[0]);
                this.$store.commit('loadState', data);
                this.$store.commit('selectFrame', 0);
            } catch(e) {
                console.error(e);
                this.onError(e.toString());
            }
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
        },
        onError(error) {
            this.errorSnackbar = true;
            this.error = error;
        }
    }
};
</script>
