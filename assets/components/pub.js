let pub = {
    template: `
<div class="pub">

    <div class="left">
        <div class="name">{{ data.name }}</div>
        <div class="adress">{{ data.address }}</div>
    </div>

    <div class="right">
        <div class="beer">Čapované pivo:</div>
        <ul>
            <li v-for="beer in data.beers" :key="beer">{{ beer }}</li>
        </ul>
    </div>

    <div class="price">Priemerná cena: {{ data.price }}</div>

    <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(data.address)"
       target="_blank"
       class="map-button">
        Navigovať
    </a>

</div>
<br>
`,
    props: ["data"]
}

export default pub