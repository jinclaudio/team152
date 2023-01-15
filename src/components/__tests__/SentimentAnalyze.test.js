
import { mount } from '@vue/test-utils'

// import {render, fireEvent} from '@testing-library/vue'
import SentimentAnalyze from "../SentimentAnalyze.vue";
test('1 = 1', () =>{
    expect(1+1).toBe(2)
})

test('Return tweet ids using search', async ()=> {
    const wrapper = mount(SentimentAnalyze, {
        props: {
            tweetdata: "this is a very nice day"
        }
    })
    await wrapper.trigger('click')
    expect(SentimentAnalyze.data().analysis).toStrictEqual([
        {value: 0, name: "Positive"},
        {value: 0, name: "Neuter"},
        {value: 0, name: "Negative"},
    ])

})