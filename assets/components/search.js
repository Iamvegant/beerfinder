import card from "./card.js"

let search = {
    template: `
    <div id="search">
        <input id="searchbar" type="text" name="searchbar" :placeholder="translations.search_placeholder">
        <button id="search-bt" @click="doSearch">
            <img id="mag-glass" src="/assets/img/magnifying_glass.png">
        </button>

    </div>
    `,
    props: ["translations"],

    methods: {
        doSearch() {
            const text = document.getElementById("searchbar").value;
            this.$emit("search", text);
        }
    }

}

export default search
