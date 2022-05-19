<template>
    <v-card class="ma-3">
        <v-card-title>Frame Info</v-card-title>
        <v-card-text>
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Value
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="item in tableData"
                        :key="item.name"
                    >
                        <td>{{ item.name }}</td>
                        <td>{{ item.value }}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'FrameInfo',
    computed: {
        tableData() {
            const frame = this.$store.getters.selectedFrame;
            if(!frame) {
                return [];
            }

            const items = [];
            if(frame.hasOwnProperty('state')) {
                items.push({name: 'State', value: frame.state});
            }
            if(frame.hasOwnProperty('pos')) {
                items.push({name: 'X', value: Math.round(frame.pos[0] * 100) / 100});
                items.push({name: 'Y', value: Math.round(frame.pos[1] * 100) / 100});
            }
            if(frame.hasOwnProperty('angle')) {
                items.push({name: 'Angle', value: `${(Math.round((frame.angle * (180/Math.PI)) * 100) / 100)}°`});
            }
            if(frame.hasOwnProperty('goal_distance')) {
                items.push({name: 'Goal Distance', value: Math.round(frame.goal_distance * 100) / 100});
            }
            return items;
        }
    }
}
</script>

<style scoped>

</style>
