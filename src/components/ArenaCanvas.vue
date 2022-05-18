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
            ctx.scale(this.size / 1000, this.size / 1000);

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
        }
    }
}
</script>

<style scoped>

</style>
