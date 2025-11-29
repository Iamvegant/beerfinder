let pubs = {
    template: `
        <div class="pub-container">
            <my-component v-for="bar in bars" :key="bar.id" :data="bar"></my-component>
        </div>
`,
    props: ["bars"]
}

export default pubs