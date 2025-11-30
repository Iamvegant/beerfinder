let card = {
    
    template:`
    <div @click="selectBeer" class="card">
        <div class="card-description">
            <h2 class="name-beer">{{beer.name}}</h2>
            <p class="color-beer">{{beer.color}}</p>
            <p class="type-beer">{{beer.type}}</p>
            <p class="alcohol-beer">{{beer.alcohol}}</p>
        </div>  
    </div>
    `,
    props:["beer"],
    methods: {
        selectBeer() {
            this.$emit('select-beer', this.beer.name);
        }
    }
}

export default card
