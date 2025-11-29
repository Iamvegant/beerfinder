<?php

require_once "./utils.php";

$OPENAI_KEY = 'replace_me';

function ask_ai($text)
{
    global $OPENAI_KEY;
    $data = [
        "model" => "gpt-4.1-mini",
        "messages" => [
            ["role" => "user", "content" => $text]
        ]
    ];


    $ch = curl_init();

    curl_setopt_array($ch, [
        CURLOPT_URL => "https://api.openai.com/v1/chat/completions",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer $OPENAI_KEY"
        ],
        CURLOPT_POSTFIELDS => json_encode($data)
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $response = json_decode($response, true);

    $response = $response["choices"][0]["message"]["content"];

    return $response;
}

function recommend_beer($user_preference, $lang = "english", $pubs_json_src = "./beers.json") {
    $pubs_json = file_get_contents($pubs_json_src);
    $prompt = <<<EOT
You are given a JSON array of pubs with their beer lists. Each pub object has this structure:

{
    "name_of_pub": "",
    "address": "",
    "beers": [
        {
        "name": "",
        "color": "",
        "type": "",
        "alcohol_amount": "",
        "price_per_500ml": ""
        }
    ]
}

A user will provide a beer preference (e.g., "I want a strong lager" or "I want a cheap beer"). Your task is to select beers that match the user's preference and return a JSON array of objects with this structure:

{
    "name_of_pub": "name of the pub where the beer is available",
    "address": "pub address",
    "beer": {
        "name": "beer name",
        "color": "beer color",
        "type": "beer type",
        "alcohol_amount": "alcohol amount",
        "price_per_500ml": "price"
    }
}

Rules:

Return an array of matching beers, max 5 objects.
If no beer matches, return an empty array: [].
Do not include any extra text, comments, or formatting.
Output must be valid JSON only.
translate the values in each field to $lang language
User preference: "$user_preference"
Input JSON: $pubs_json
EOT;

    return ask_ai($prompt);
}

function html_to_beer_json($url) {
    $html = html_from_url($url);

    $prompt = <<<EOT
You are given HTML content from a pub's drink list. Extract and return only a single JSON object with this structure:

{
    "name_of_pub": "string (or empty if unknown)",
    "address": "string (or empty if unknown)",
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

HTML content: $html
EOT;

    return ask_ai($prompt);
}

$URLS = [
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

function create_json_of_pub_bears($urls) {
    $results = [];

    foreach ($urls as $index => $url) {
        $json = html_to_beer_json($url);

        echo $index + 1 . " of " . count($urls) . "\n";

        //echo "\n" . $json . "\n";

        $decoded = json_decode($json, true);

        if ($decoded !== null) {
            $results[] = $decoded;
        }
    }

    echo "==================================================================";
    $result_json = json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    echo $result_json;
    file_put_contents("beers.json", $result_json);
}

//create_json_of_pub_bears($URLS);

echo recommend_beer("chcem lacne tmave pivo v kosiciach", "slovak");