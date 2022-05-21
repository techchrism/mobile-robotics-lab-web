<template>
    <div>
        <div class="d-flex align-center justify-center">
            <v-btn :disabled="atStart" @click="goToStart">
                <v-icon>mdi-rewind</v-icon>
            </v-btn>

            <v-btn color="success" :disabled="atLatest" v-if="paused" @click="play">
                <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn color="warning" :disabled="atLatest" v-if="!paused" @click="pause">
                <v-icon>mdi-pause</v-icon>
            </v-btn>

            <v-btn :disabled="atLatest" @click="goToEnd">
                <v-icon>mdi-fast-forward</v-icon>
            </v-btn>
        </div>

        <p class="text-center">Current frame: {{currentFrame}}</p>

        <label for="playback-speed">Playback Speed</label>
        <v-slider thumb-label step="0.1" max="10" min="0.1" v-model="speed">
            <template v-slot:append>
                <v-text-field
                    id="playback-speed"
                    v-model="speed"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                    style="width: 60px"
                ></v-text-field>
            </template>
        </v-slider>
    </div>
</template>

<script>
export default {
    name: 'FramePlayback',
    data: () => ({
        paused: true,
        nextTimeoutID: -1,
        speed: 1.0
    }),
    computed: {
        atLatest() {
            return this.$store.state.selected === -1 || this.$store.state.selected === this.$store.state.frames.length - 1;
        },
        currentFrame() {
            const selected = this.$store.state.selected;
            if(selected === -1) {
                return this.$store.state.frames.length - 1;
            }
            return selected;
        },
        atStart() {
            return this.currentFrame === 0 || this.$store.state.frames.length === 0;
        }
    },
    methods: {
        goToStart() {
            this.$store.commit('selectFrame', 0);
            if(!this.paused) {
                this.pause();
            }
        },
        goToEnd() {
            this.$store.commit('selectFrame', -1);
            if(!this.paused) {
                this.pause();
            }
        },
        play() {
            this.paused = false;
            this.nextFrame();
        },
        pause() {
            this.paused = true;
            if(this.nextTimeoutID !== -1) {
                clearTimeout(this.nextTimeoutID);
            }
        },
        nextFrame() {
            if(this.$store.state.selected >= this.$store.state.frames.length - 1) {
                this.nextTimeoutID = -1;
                this.pause();
                return;
            }
            const next = this.$store.state.frames[this.$store.state.selected + 1];
            const timeDiff = next['sent_time'] - this.$store.getters.selectedFrame['sent_time'];
            this.$store.commit('selectFrame', this.$store.state.selected + 1);

            this.nextTimeoutID = setTimeout(() => {
                this.nextFrame();
            }, timeDiff * (1 / this.speed));
        }
    }
}
</script>

<style scoped>

</style>
