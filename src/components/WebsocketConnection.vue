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
    </div>
</template>

<script>
export default {
    name: 'WebsocketConnection',
    data: () => ({
        loading: false,
        connected: false,
        ip: 'ws://localhost:9090',
        websocket: null
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
                    this.$emit('error', 'Error connecting to websocket');
                    this.loading = false;
                });

                this.websocket.addEventListener('message', event => {
                    const frame = JSON.parse(event.data);
                    this.$store.commit('addFrame', frame);
                });
            } catch(e) {
                this.loading = false;
                this.$emit('error', e.toString());
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
