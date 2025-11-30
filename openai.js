import fs from "fs";

const OPENAI_KEY = "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"; // or: const OPENAI_KEY = "YOUR_KEY";

async function html_from_url(url) {
    const res = await fetch(url);
    return await res.text();
}

async function ask_ai(text) {
    const data = {
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: text }]
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    return json.choices[0].message.content;
}

async function recomend_pub(beer_json, lang = "slovak", pubs_json_src = "./beers.json") {
    const pubs_json = fs.readFileSync(pubs_json_src, "utf8");

    const prompt = `
You are given a JSON array of pubs with their beer lists. Each pub object has this structure:

{
    "name_of_pub": "string (or empty if unknown)",
    "address": "string (or empty if unknown)",
    "city": "city from the address"
    "beers": [
        {
        "name": "string (or empty if unknown)",
        "color": "light or dark,
        "alcohol_amount": "string (usually in name but multiply it by 0.5) if not given try to find out, just put the number or empty string, if in name it has nealko put 0",
        "type": "Ale, Lager, Dark lager, Non-alcoholic, Alcoholic or empty if you are not 100% sure",
        "price_per_500ml": "string (convert if possible, otherwise empty)"
        }
    ]
}

A user will provide a single beer JSON object in this structure, if some field is empty interpret it as any value could be in it, if it is not in english you can translate it to english:

{
    "name": "beer name",
    "city": "city of pub in which it is"
}

Your task is to select pubs that serve a beer matching the provided beer JSON. Matching should be done primarily by beer name, but type and color may also be considered for similarity. Return a JSON array of objects with this structure:

{
    "name_of_pub": "",
    "address": ""
    "city": "",
    "price_per_500ml": "price of said beer in different locations"
    "alternatives": ["array of strings of other beers"]
}

Rules:
1. Return an array of matching pubs, maximum 5.
2. If none, return [].
3. No extra text.
4. Valid JSON only.
5. Translate values to ${lang}.

Input beer JSON: ${beer_json}
Input pubs JSON: ${pubs_json}
`;

    return await ask_ai(prompt);
}

async function recommend_beer(user_preference, lang = "english", pubs_json_src = "./beers.json") {
    const pubs_json = fs.readFileSync(pubs_json_src, "utf8");

    const prompt = `
You are given a JSON array of pubs with their beer lists. Each pub object has this structure:

{
    "name_of_pub": "string (or empty if unknown)",
    "address": "string (or empty if unknown)",
    "city": "city from the address"
    "beers": [
        {
        "name": "string (or empty if unknown)",
        "color": "light or dark,
        "alcohol_amount": "string (usually in name but multiply it by 0.5) if not given try to find out, just put the number or empty string, if in name it has nealko put 0",
        "type": "Ale, Lager, Dark lager, Non-alcoholic, Alcoholic or empty if you are not 100% sure",
        "price_per_500ml": "string (convert if possible, otherwise empty)"
        }
    ]
}

A user will provide a beer preference (e.g., "I want a strong lager").  
Return a JSON array:

{
    "name": "",
    "color": "",
    "type": "",
    "alcohol_amount": ""
}

Rules:
- Max 5 objects.
- If none, return [].
- Valid JSON only.
- Translate values to ${lang}.

User preference: "${user_preference}"
Input JSON: ${pubs_json}
`;

    return await ask_ai(prompt);
}

async function html_to_beer_json(url) {
    const html = await html_from_url(url);

    const prompt = `
You are given HTML from a pub's drink list. Extract and return one JSON object:

{
    "name_of_pub": "",
    "address": "",
    "city": "",
    "beers": [
        {
            "name": "",
            "color": "",
            "alcohol_amount": "",
            "type": "",
            "price_per_500ml": ""
        }
    ]
}

Rules:
- Always return exactly ONE JSON object.
- No extra text.
- Fill as many fields as possible.
- Convert prices to 500ml if possible.
- Valid JSON only.

HTML content: ${html}
`;

    return await ask_ai(prompt);
}
async function create_json_of_pub_beers(urls) {
    const results = [];

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const json = await html_to_beer_json(url);

        console.log(`${i + 1} of ${urls.length}`);

        try {
            const decoded = JSON.parse(json);
            results.push(decoded);
        } catch (e) {
            console.error("Invalid JSON from AI:", json);
        }
    }

    const output = JSON.stringify(results, null, 2);
    fs.writeFileSync("beers.json", output);

    console.log("===============================================");
    console.log(output);
}

(async () => {
    console.log(
        await recommend_beer("chcem tmave pivo")
    );

    // Example:
    /*
    console.log(await recomend_pub(`{
        "name": "Šariš tmavý",
        "city": "Košice"
    }`));
    */

    // To generate beers.json:
    // await create_json_of_pub_beers(URLS);
})();
