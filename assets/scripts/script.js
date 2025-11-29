const { createApp, ref, reactive } = Vue

import form from "/assets/components/form.js"
import search from "/assets/components/search.js"
import card from "/assets/components/card.js"

createApp({
    components: {
        beers: card,
        searching: search,
        forms: form
    },
    setup() {
        let translations = ref({})
        let info = ref([])

        fetch(`/assets/json/${sessionStorage.getItem("lang")}.json`)
            .then(request => request.json())
            .then(data => {
                info.value = data.beers;
                translations.value = data;
            })

        console.log(info);

        return {
            info,
            translations
        }
    }
}).mount("#app")