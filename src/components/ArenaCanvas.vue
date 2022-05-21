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
            try {
                ctx.scale(this.size / arenaWidthMM, this.size / arenaHeightMM);
                ctx.clearRect(0, 0, arenaWidthMM, arenaHeightMM);

                // Outer border
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, arenaWidthMM, arenaHeightMM);
                ctx.fillStyle = 'white';
                const borderRadius = 5;
                ctx.fillRect(borderRadius, borderRadius, arenaWidthMM - (borderRadius * 2), arenaHeightMM - (borderRadius * 2));

                // Center lines
                ctx.fillStyle = 'black';
                ctx.fillRect((arenaWidthMM / 2) - 1, 0, 2, arenaWidthMM);
                ctx.fillRect(0, (arenaHeightMM / 2) - 1, arenaHeightMM, 2);

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

                        ctx.lineWidth = 5;
                        ctx.strokeStyle = 'blue';
                        ctx.arc(0, 0, robotRadiusMM, 0, Math.PI * 2, true);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.lineWidth = 10;
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, robotRadiusMM * -1);
                        ctx.stroke();

                        // Draw ultrasonics
                        if (frame.hasOwnProperty('ultrasonic')) {
                            for (let i = 0; i < frame.ultrasonic.length; i++) {
                                ctx.save();
                                const angle = (-0.5 * Math.PI) + (Math.PI * (i / (frame.ultrasonic.length - 1)));

                                ctx.rotate(angle);
                                ctx.translate(0, -1 * robotRadiusMM);
                                ctx.fillStyle = 'red';
                                ctx.fillRect(-3, 0, 6, -1 * Math.min(frame.ultrasonic[i] * 10, ultrasonicMaxRangeMM));

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
                            ctx.strokeStyle = 'purple';
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
                            ctx.strokeStyle = 'purple';
                            ctx.arc(dot[0] + (arenaWidthMM / 2), (dot[1] * -1) + (arenaHeightMM / 2), 10, 0, Math.PI * 2, true);
                            ctx.stroke();
                        }
                    }

                    if(frame.hasOwnProperty('goal')) {
                        ctx.beginPath();
                        ctx.lineWidth = 20;
                        ctx.fillStyle = 'green';
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
