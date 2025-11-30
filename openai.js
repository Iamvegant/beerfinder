import fs from 'fs/promises';
import https from 'https';

// Configuration - set your OpenAI API key here or in environment variable
const OPENAI_KEY = process.env.OPENAI_KEY || 'your-api-key-here';

/**
 * Fetches HTML content from a URL
 */
async function htmlFromUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Makes a request to OpenAI API
 */
async function askAI(text) {
    const data = JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
            { role: "user", content: text }
        ]
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.openai.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed.choices[0].message.content);
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Recommends pubs based on a specific beer
 */
async function recommendPub(beerJson, lang = "slovak", pubsJsonSrc = "./beers.json") {
    const pubsJson = await fs.readFile(pubsJsonSrc, 'utf-8');
    
    const prompt = `You are given a JSON array of pubs with their beer lists. Each pub object has this structure:

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

1. Return an array of matching pubs, maximum 5 objects.
2. If no pub matches, return an empty array: [].
3. Do not include any extra text, comments, or formatting.
4. Output must be valid JSON only.
5. Translate the values in each field to ${lang} language.

Input beer JSON: ${beerJson}
Input pubs JSON: ${pubsJson}`;

    return await askAI(prompt);
}

/**
 * Recommends beers based on user preference
 */
async function recommendBeer(userPreference, lang = "english", pubsJsonSrc = "./beers.json") {
    const pubsJson = await fs.readFile(pubsJsonSrc, 'utf-8');
    
    const prompt = `You are given a JSON array of pubs with their beer lists. Each pub object has this structure:

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


A user will provide a beer preference (e.g., "I want a strong lager" or "I want a cheap beer"). Your task is to select beers that match the user's preference and return a JSON array of objects with this structure:

{
    "name": "beer name",
    "color": "beer color",
    "type": "beer type",
    "alcohol_amount": "amount of alcohol"
}

Rules:

Return an array of matching beers, max 5 objects.
If no beer matches, return an empty array: [].
Do not include any extra text, comments, or formatting.
Output must be valid JSON only.
translate the values in each field to ${lang} language
User preference: "${userPreference}"
Input JSON: ${pubsJson}`;

    return await askAI(prompt);
}

/**
 * Converts HTML from a pub website to structured beer JSON
 */
async function htmlToBeerJson(url) {
    const html = await htmlFromUrl(url);
    
    const prompt = `You are given HTML content from a pub's drink list. Extract and return only a single JSON object with this structure:

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

Rules:

Always return exactly one JSON object, never an array.
Do not add any text before or after the JSON.
If pub name or address is missing, leave as empty strings.
Extract all beers with their names, colors, alcohol amounts, types, and prices.
If the price is not for 500ml, convert if possible; otherwise leave empty.
Output must be valid JSON only, no backticks or code formatting.
Try to leave as few places empty as posible.

HTML content: ${html}`;

    return await askAI(prompt);
}

const URLS = [
    "https://www.geronimogrill.sk/napojovy-listok",
    "https://riderspub.sk/?utm_source=chatgpt.com",
    "https://www.pivovarhostinec.sk/nase-piva/",
    "https://www.centralpubkosice.sk/-napojovy-listok",
    "https://www.krcma-letna.sk/napojovy-listok/",
    "https://www.pilsnerurquellpub.sk/kosice/napojovy-listok/capovane-pivo#region-menu",
    "https://www.goldenroyal.sk/napojovy-listok/",
    "https://vicolo.sk/napojovy-listok/",
    "https://www.pivarenbokovka.sk/napojovy-listok/",
    "https://bancodelperu.sk/napojovy-listok/",
    "https://restauraciabojnice.sk/napojovy-listok/",
    "https://yuza.sk/napojovy-listok/",
    "https://restauraciabenvenuti.sk/napojovy-listok/",
    "https://www.mmpub.sk/restauracia/napojovy-listok",
    "https://www.restauraciasramek.sk/napojovy-listok/",
    "https://www.cactus.sk/restauracia-grill/napojovy-listok",
    "https://www.paparazzirestaurant.sk/napojovy-listok/",
    "https://bereknz.sk/napojovy-listok/",
    "https://restaurant.brixhotel.sk/napojovy-listok/",
    "https://www.daniels.sk/napojovy-listok-daniels-pub-restaurant/",
    "https://www.galaxyrestauracia.sk/napojovy-listok/",
    "https://savagebistro.sk/napojovy-listok/"
];

/**
 * Scrapes all pub URLs and creates a JSON file with beer data
 */
async function createJsonOfPubBeers(urls) {
    const results = [];

    for (let i = 0; i < urls.length; i++) {
        try {
            const json = await htmlToBeerJson(urls[i]);
            console.log(`${i + 1} of ${urls.length}`);
            
            const decoded = JSON.parse(json);
            results.push(decoded);
        } catch (err) {
            console.error(`Error processing ${urls[i]}:`, err.message);
        }
    }

    console.log("==================================================================");
    const resultJson = JSON.stringify(results, null, 2);
    console.log(resultJson);
    await fs.writeFile("beers.json", resultJson, 'utf-8');
}

// Example usage
async function main() {
    try {
        // Uncomment to scrape pubs and create beers.json
        // await createJsonOfPubBeers(URLS);
        
        // Example: Recommend dark beer
        const result = await recommendBeer("chcem tmave pivo");
        console.log(result);
        
        // Example: Recommend pub for specific beer
        // const pubResult = await recommendPub(JSON.stringify({
        //     name: "Šariš tmavý",
        //     city: "Košice"
        // }));
        // console.log(pubResult);
    } catch (err) {
        console.error('Error:', err);
    }
}

// Run the main function
main();

// Export functions for use as a module
export {
    askAI,
    recommendPub,
    recommendBeer,
    htmlToBeerJson,
    createJsonOfPubBeers,
    URLS
};