
let card = {
    
    template:`
    <div class="card">
        <div class="card-description">
            <h2 class="name-beer">{{beer.name}}</h2>
            <p class="color-beer">{{beer.color}}</p>
            <p class="type-beer">{{beer.type}}</p>
            <p class="alcohol-beer">{{beer.alcohol}}</p>
        </div>  
    </div>
    `,
    props:["beer"]
}


export default card
