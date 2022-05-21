import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        frames: [],
        selected: -1
    },
    mutations: {
        addFrame(state, frame) {
            state.frames.push(frame);
        },
        loadState(state, newState) {
            state.frames = newState.frames;
            state.selected = -1;
        },
        selectFrame(state, frameID) {
            if(frameID < state.frames.length) {
                state.selected = frameID;
            }
        },
        unselectFrame(state) {
            state.selected = -1;
        }
    },
    actions: {},
    modules: {},
    getters: {
        selectedFrame(state) {
            if(state.selected === -1) {
                return state.frames[state.frames.length - 1];
            } else {
                return state.frames[state.selected];
            }
        }
    }
})
