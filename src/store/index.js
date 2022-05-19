import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        frames: []
    },
    mutations: {
        addFrame(state, frame) {
            state.frames.push(frame);
            if(state.frames.length > 10) {
                state.frames.shift();
            }
        }
    },
    actions: {},
    modules: {},
    getters: {
        selectedFrame(state) {
            return state.frames[state.frames.length - 1];
        }
    }
})
