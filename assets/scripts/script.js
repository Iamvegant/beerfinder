const { createApp, ref, reactive } = Vue

import form from "/assets/components/form.js"
import search from "/assets/components/search.js"
import card from "/assets/components/card.js"

import { recommend_beer } from "/openai.js";

async function runAI(userPref) {
    const result = await recommend_beer(userPref, sessionStorage.getItem("lang"));
    
    try {
        const beers = JSON.parse(result);
        info.value = beers;   
    } catch (e) {
        console.error("AI returned invalid JSON:", result);
    }
}

createApp({
    components: {
        beers: card,
        searching: search,
        forms: form
    },
    setup() {
    let translations = ref({})
    let info = ref([])
    const showSearch = ref(false)

    function toggleSearchBar() {
        showSearch.value = !showSearch.value;
        if (!showSearch.value) {
            document.getElementById("show").style.display = "none";
        } else {
            document.getElementById("show").style.display = "block";
        }
    }

    fetch(`/assets/json/${sessionStorage.getItem("lang")}.json`)
        .then(request => request.json())
        .then(data => {
            info.value = data.beers
            translations.value = data
        })

    function fillBeerInput(beerName) {
        const input = document.getElementById("select-beer2")
        if (input) input.value = beerName
    }

    async function runAI(userPref) {
        const result = await recommend_beer(userPref, sessionStorage.getItem("lang"))

        try {
            const beers = JSON.parse(result)
            info.value = beers      
        } catch (e) {
            console.error("AI returned invalid JSON:", result)
        }
    }

    return {
        showSearch,
        toggleSearchBar,
        info,
        translations,
        fillBeerInput,
        runAI
    }
}

}).mount("#app")