<?php
    $languages = [
        'de' => [
            "name" => "Deutsch"
        ],
        'en' => [
            "name" => "English"
        ],
        'sk' => [
            "name" => "Slovenčina"
        ],
        'pl' => [
            "name" => "Polski"
        ],
        'cz' => [
            "name" => "Česki"
        ]
    ];    
    $lang = 'en';

    if(isset($_GET['lang'])){
        if(in_array($_GET['lang'], haystack: array_keys($languages))){
            $lang = $_GET['lang'];
        }
    }

    $json = file_get_contents( __DIR__ . "/assets/json/".$lang.".json");
    $t = json_decode($json, true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/assets/styles/beers.css">
    <link rel="stylesheet" href="/assets/styles/style.css">
    <link rel="stylesheet" href="/assets/styles/responsive.css">
    <title>Beer Finder</title>
    <script>
        sessionStorage.setItem("lang", "<?= $lang ?>");
    </script>
</head>
<body >
    <header>
        <img src="/assets/img/logo.png" alt="logo">
        <div id="nav">
            <a href="#search"><?= $t["header"]["finder"]?></a>
            <a href="footer"><?= $t['header']['contacts']?></a>
            <div id="langMenuBtn" onclick="openLangMenu()"><?= strtoupper($lang)?></div>
            
        </div>
        <div id="langMenu">
                    <form action="" method="GET">
                        <a href="javascript:void(0)" onclick="closeLangMenu()">&times;</a>
                        <label for="lang"><?= $t["header"]["langMenu"]["text"]?></label>
                        <select name="lang" id="lang">
                            <?php foreach($languages as $alias => $language): ?>
                                <option value="<?= $alias?>"
                                <?php if($lang == $alias) echo 'selected="selected"'?>
                                ><?= $language["name"]?></option>
                            <?php endforeach?>
                        </select>
                        <input type="submit" value="<?= $t["header"]["langMenu"]["button"]?>">
                    </form>
        </div>
        <div id="overlay"></div>
    </header>
    <main id="app">
        
        <!-- <div id="finder">
            <forms :translations="translations" lang="<?= $lang?>" post="<?= $_POST ?>"></forms>
        </div> -->

        <?php if(!$_POST['city']): ?>
        <div id="select-beer">
        <form action="/index.php/?lang=<?= $lang ?>" method="POST">
            
            <label for="select-beer"><?= $t["formBeer"]["selectBeer"]?> </label>
            <br>
            <input type="text" 
            id="select-beer" 
            name="select-beer" 
            value="<?= $_POST['select-beer']?>"><br> 
            <?php if(isset($_POST['select-beer'])): ?> 
                <label for="select-beer"><?= $t["what"]["city"]?></label> 
                <input type="text" id="city" name="city" value="<?= $_POST['city']?>"><br> 
            <?php endif?> 
            <input type="submit" value="<?= $t["header"]["langMenu"]["button"]?>"> 
        </form> 
        <button> <p><?= $t["noBeer"]["idk"]?></p> </button>
        </div>
        <?php endif?>

       <searching :translations="translations"></searching> 

        <div class="cards-container">
            <beers v-for="beer in info" :beer="beer" :key="beer.id"></beers>
        </div>


    </main>
    <footer>
   <div class="footer-container">
    <div class="footer-about">
      <h3>BeerFinder</h3>
      <p>Skupina programatorov a milovnikov piva</p> 
    </div>
    <div class="footer-links">
      <h4>Rýchle odkazy</h4>
      <ul>
        <li><a href="#">Domov</a></li>
        <li><a href="#">O nás</a></li>
        <li><a href="#">Služby</a></li>
        <li><a href="#">Kontakt</a></li>
      </ul>
    </div>
    <div class="footer-social">
      <h4>Sleduj nás</h4>
      <div class="social-icons">
        <a href="#"><img src="/img/facebook-icon.png" alt="Facebook"></a>
        <a href="#"><img src="instagram-icon.png" alt="Instagram"></a>
        <a href="#"><img src="twitter-icon.png" alt="Twitter"></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 BeerFinder. Všetky práva vyhradené.</p>
  </div>
    <footer> 
    <script src="/assets/scripts/global.js"></script>
    <script type="module" defer src="/assets/scripts/script.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</body> 

</html>