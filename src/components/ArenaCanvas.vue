<template>
    <v-container fluid ref="container" v-resize="onResize" class="d-flex justify-center">
        <canvas class="elevation-2" ref="canvas"></canvas>
    </v-container>
</template>

<script>
const arenaHeightMM = 4 * 1000;
const arenaWidthMM = arenaHeightMM;
const robotRadiusMM = 140;
const ultrasonicMaxRangeMM = 1700;

export default {
    name: 'ArenaCanvas',
    data: () => ({
        size: 0
    }),
    mounted() {
        setTimeout(() => {
            this.onResize();
        }, 1);
    },
    computed: {
        frame() {
            return this.$store.getters.selectedFrame;
        }
    },
    watch: {
        frame() {
            this.draw();
        },
        '$vuetify.theme.dark': function() {
            this.draw();
        }
    },
    methods: {
        onResize() {
            const computed = getComputedStyle(this.$refs.container);
            const containerWidth = this.$refs.container.offsetWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight);
            this.size = Math.min(window.innerHeight - 100, containerWidth);

            this.$refs.canvas.width = this.size;
            this.$refs.canvas.height = this.size;
            this.draw();
        },
        draw() {
            const ctx = this.$refs.canvas.getContext('2d');
            ctx.save();

            const palette = {
                background: this.$vuetify.theme.dark ? '#121212' : '#FFFFFF',
                backgroundLine: this.$vuetify.theme.dark ? '#d5d5d5de' : '#121212',
                bot: this.$vuetify.theme.dark ? 'deepskyblue' : 'blue',
                ultrasonic: 'red',
                customLine: 'purple',
                customDot: 'purple',
                goal: this.$vuetify.theme.dark ? 'lightgreen' : 'green'
            };

            try {
                ctx.scale(this.size / arenaWidthMM, this.size / arenaHeightMM);
                ctx.clearRect(0, 0, arenaWidthMM, arenaHeightMM);


                // Outer border
                ctx.fillStyle = palette.backgroundLine;
                ctx.fillRect(0, 0, arenaWidthMM, arenaHeightMM);
                ctx.fillStyle = palette.background;
                const borderRadius = 10;
                ctx.fillRect(borderRadius, borderRadius, arenaWidthMM - (borderRadius * 2), arenaHeightMM - (borderRadius * 2));

                // Center lines
                ctx.fillStyle = palette.backgroundLine;
                const lineWidth = 8;
                ctx.fillRect((arenaWidthMM / 2) - (lineWidth / 2), 0, lineWidth, arenaWidthMM);
                ctx.fillRect(0, (arenaHeightMM / 2) - (lineWidth / 2), arenaHeightMM, lineWidth);

                const frame = this.frame;
                if(frame) {
                    // Robot position, angle, and ultrasonics
                    if(frame.hasOwnProperty('pos') && frame.hasOwnProperty('angle')) {
                        ctx.save();
                        const botX = (frame.pos[0] * 1000);
                        const botY = (frame.pos[1] * 1000);
                        ctx.translate(botX + (arenaWidthMM / 2), (botY * -1) + (arenaHeightMM / 2));
                        ctx.rotate(frame.angle);

                        ctx.beginPath();

                        const robotWidth = 10;
                        ctx.lineWidth = robotWidth;
                        ctx.strokeStyle = palette.bot;
                        ctx.arc(0, 0, robotRadiusMM, 0, Math.PI * 2, true);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.lineWidth = 20;
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, robotRadiusMM * -1);
                        ctx.stroke();

                        // Draw ultrasonics

                        if (frame.hasOwnProperty('ultrasonic')) {
                            const ultrasonicWidth = 10;
                            for (let i = 0; i < frame.ultrasonic.length; i++) {
                                ctx.save();
                                const angle = (-0.5 * Math.PI) + (Math.PI * (i / (frame.ultrasonic.length - 1)));

                                ctx.rotate(angle);
                                ctx.translate(0, -1 * (robotRadiusMM + (robotWidth /2)));
                                ctx.fillStyle = palette.ultrasonic;
                                ctx.fillRect(-1 * (ultrasonicWidth / 2), 0, ultrasonicWidth, -1 * Math.min(frame.ultrasonic[i] * 10, ultrasonicMaxRangeMM));

                                ctx.restore();
                            }
                        }

                        ctx.restore();
                    }

                    // Additional lines
                    if(frame.hasOwnProperty('lines')) {
                        for(const line of frame.lines) {
                            ctx.beginPath();
                            ctx.lineWidth = 10;
                            ctx.strokeStyle = palette.customLine;
                            ctx.moveTo(line[0][0] + (arenaWidthMM / 2), (line[0][1] * -1) + (arenaHeightMM / 2));
                            ctx.lineTo(line[1][0] + (arenaWidthMM / 2), (line[1][1] * -1) + (arenaHeightMM / 2));
                            ctx.stroke();
                        }
                    }

                    // Dots
                    if(frame.hasOwnProperty('dots')) {
                        for(const dot of frame.dots) {
                            ctx.beginPath();
                            ctx.lineWidth = 10;
                            ctx.strokeStyle = palette.customDot;
                            ctx.arc(dot[0] + (arenaWidthMM / 2), (dot[1] * -1) + (arenaHeightMM / 2), 10, 0, Math.PI * 2, true);
                            ctx.stroke();
                        }
                    }

                    if(frame.hasOwnProperty('goal')) {
                        ctx.beginPath();
                        ctx.lineWidth = 20;
                        ctx.fillStyle = palette.goal;
                        ctx.arc((frame.goal[0] * 1000) + (arenaWidthMM / 2), (frame.goal[1] * -1000) + (arenaHeightMM / 2), 30, 0, Math.PI * 2, true);
                        ctx.fill();
                    }
                }
            }
            catch(e) {
                console.error(e);
            }
            ctx.restore();
        }
    }
}
</script>

<style scoped>

</style>
