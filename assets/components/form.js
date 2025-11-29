let form = {
    template: `
    <form v-if="translations.formBeer" :action="'/index.php/?lang=' + lang" method="POST">
        <label for="select-beer">{{ translations.formBeer.selectBeer }}</label>
        <input 
            type="text"
            id="select-beer"
            name="select-beer"
            :value="post['select-beer'] || ''"
        ><br>

        <div v-if="post['select-beer']">
            <label for="city">{{ translations.what.city }}</label>
            <input 
                type="text"
                id="city"
                name="city"
                :value="post['city'] || ''"
            ><br>
        </div>

        <input type="submit" :value="translations.header.langMenu.button">
    </form>

    <button>{{ translations.noBeer.idk }}</button>
    `,
    props: {
        translations: { type: Object, required: true },
        post: { type: Object, default: () => ({}) },
        lang: { type: String, required: true }
    }
};

export default form;