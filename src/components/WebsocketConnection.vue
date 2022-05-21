<template>
    <div class="d-flex align-center justify-center">
        <v-form class="d-flex align-center flex-column" action="javascript:void(0);">
            <v-text-field outlined
                          class="ma-2"
                          filled
                          hide-details
                          v-model="ip"
                          placeholder="Robot IP"/>
            <v-btn v-if="!connected" :loading="loading" color="success" @click="connect" type="submit">
                Connect
            </v-btn>
            <v-btn v-if="connected" color="error" @click="disconnect">
                Disconnect
            </v-btn>
        </v-form>


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
    </div>
</template>

<script>
export default {
    name: 'WebsocketConnection',
    data: () => ({
        loading: false,
        connected: false,
        ip: 'ws://localhost:9090',
        websocket: null,

        errorSnackbar: false,
        error: ''
    }),
    methods: {
        connect() {
            try {
                this.websocket = new WebSocket(this.ip);
                this.loading = true;

                this.websocket.addEventListener('open', () => {
                    this.loading = false;
                    this.connected = true;
                    console.log('Opened!');
                }, {once: true});

                this.websocket.addEventListener('close', event => {
                    this.loading = false;
                    this.connected = false;
                    console.log(`Websocket closed with code ${event.code}`);
                }, {once: true});

                this.websocket.addEventListener('error', error => {
                    console.error('Websocket error: ', error);
                    this.errorSnackbar = true;
                    this.loading = false;
                    this.error = error;
                });

                this.websocket.addEventListener('message', event => {
                    const frame = JSON.parse(event.data);
                    this.$store.commit('addFrame', frame);
                });
            } catch(e) {
                this.errorSnackbar = true;
                this.loading = false;
                this.error = e.toString();
                console.error(e);
            }
        },
        disconnect() {
            this.loading = false;
            this.websocket.close();
        }
    }
}
</script>

<style scoped>

</style>
