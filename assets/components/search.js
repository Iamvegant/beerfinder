import card from "./card.js"

let search = {

    template: `
    <div id="search">
        <input id="searchbar" type="text" name="searchbar" :placeholder="translations.search_placeholder">
        <button id="search-bt"><img id="mag-glass" src="/assets/img/magnifying_glass.png" alt="magnifying_glass"></button>
    </div>

    `,
    props: ["translations"]
}

export default search