<template>
    <v-container fluid ref="container" v-resize="onResize">
        <canvas ref="canvas"></canvas>
    </v-container>
</template>

<script>
export default {
    name: 'ArenaCanvas',
    data: () => ({
        size: 0
    }),
    mounted() {

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
            this.size = Math.min(window.innerHeight, containerWidth);

            this.$refs.canvas.width = this.size;
            this.$refs.canvas.height = this.size;
            this.draw();
        },
        draw() {
            const ctx = this.$refs.canvas.getContext('2d');
            ctx.save();
            try {
                ctx.scale(this.size / 1000, this.size / 1000);
                ctx.clearRect(0, 0, 1000, 1000);

                // Outer border
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, 1000, 1000);
                ctx.fillStyle = 'white';
                const borderRadius = 5;
                ctx.fillRect(borderRadius, borderRadius, 1000 - (borderRadius * 2), 1000 - (borderRadius * 2));

                // Center lines
                ctx.fillStyle = 'black';
                ctx.fillRect(499, 0, 2, 1000);
                ctx.fillRect(0, 499, 1000, 2);

                const frame = this.frame;
                if(frame.hasOwnProperty('pos') && frame.hasOwnProperty('angle')) {
                    ctx.save();
                    ctx.translate(frame.pos[0] + 500, (frame.pos[1] * -1) + 500);
                    ctx.rotate(frame.angle);

                    const robotRadius = 50;

                    ctx.beginPath();

                    ctx.lineWidth = 5;
                    ctx.strokeStyle = 'blue';
                    ctx.arc(0, 0 , robotRadius, 0, Math.PI * 2, true);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.lineWidth = 10;
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, robotRadius * -1);
                    ctx.stroke();

                    // Draw ultrasonics
                    if(frame.hasOwnProperty('ultrasonic')) {
                        for(let i = 0; i < frame.ultrasonic.length; i++) {
                            ctx.save();
                            const angle = (-0.5 * Math.PI) + (Math.PI * (i / (frame.ultrasonic.length - 1)));

                            ctx.rotate(angle);
                            ctx.translate(0, -1 * robotRadius);
                            ctx.fillStyle = 'red';
                            ctx.fillRect(-3, 0, 6, -1 * Math.min(frame.ultrasonic[i], 50));

                            ctx.restore();
                        }
                    }

                    ctx.restore();
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
