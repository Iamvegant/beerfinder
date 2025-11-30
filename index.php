<?php
    require_once "./openai.php";

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
        <?php if(isset($_POST['searchbar'])): ?>sessionStorage.setItem("searchbar", "<?= $_POST['searchbar'] ?>"); <?php endif ?>
    </script>

    <script>
        window.beers = <?= json_encode(recommend_beer("daco cierne"), JSON_UNESCAPED_UNICODE) ?>;
    </script>
</head>
<body >
    <header>
        <img src="/assets/img/logo.png" alt="logo">
        <div id="nav">
            <a href="#search"><?= $t["header"]["finder"]?></a>
            <a href="#footer"><?= $t['header']['contacts']?></a>
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
            <forms :translations="translations" lang="<?= $lang?>" post="<?= $_POST ?>"></forms    >
        </div> -->

        <?php if(!$_POST['city']    ): ?>
            <div id="select-beer">
                <form action="/index.php/?lang=<?= $lang ?>" method="POST">
                    
                    <label for="select-beer"><?= $t["formBeer"]["selectBeer"]?> </label>
                        <br>
                    <input type="text" 
                    id="select-beer2" 
                    name="select-beer2" 
                    value="<?= $_POST['select-beer2']?>"><br> 
                      <?php if(isset($_POST['select-beer2'])): ?> 
                        <label for="select-beer2"><?= $t["what"]["city"]?></label> 
                         <input type="text" id="city" name="city" value="<?= $_POST['city']?>"><br> 
                    <?php endif?> 
                        <input id="sent" type="submit" value="<?= $t["header"]["langMenu"]["button"]   ?>"> 
                </form>
            <?php if(!isset($_POST['select-beer2'])): ?>
                <button @click="toggleSearchBar"> <p><?= $t["noBeer"]["idk"]?></p> </button>
            <?php endif ?>
            </div>
        <?php endif?>

        <?php if(!isset($_POST[ 'select-beer2']) ): ?>
            <div id="show">
                <div id="searchbarr">
                    <searching v-if="showSearch" :translations="translations"></searching>
                </div>
                <div class="cards-container">
                    <beers
                        v-for="beer in beers"
                        :beer="beer"
                        :key="beer.id"
                        @select-beer="fillBeerInput"
                    ></beers>

                </div>
            </div>
            <script>document.getElementById("show").style.display = "none";</script>
        <?php endif ?>

    </main>
    <footer id="footer">
   <div class="footer-container">
    <div class="footer-about">
      <h3>BeerFinder</h3>
      <p><?= $t['footer']['footer-about']?></p> 
    </div>
    <div class="footer-links">
      <h4>Rýchle odkazy</h4>
      <ul>
        <li><a href="#"><?= $t['footer']['footer-links']['home']?></a></li>
        <li><a href="#"><?= $t['footer']['footer-links']['about']?></a></li>
        <li><a href="#"><?= $t['footer']['footer-links']['finder']?></a></li>
        <li><a href="#"><?= $t['footer']['footer-links']['a']?></a></li>
      </ul>
    </div>
    <div class="footer-social">
      <h4><?= $t['footer']['footer-social']?></h4>
      <div class="social-icons">
        <a href="https://www.facebook.com/slovenska.sporitelna.3?locale=sk_SK"><img src="/assets/img/facebook-icon.png" alt="Facebook"></a>
        <a href="https://www.instagram.com/p/DRnXnbFCeGd/"><img src="/assets/img/instagram-icon.png" alt="Instagram"></a>
        <a href="https://x.com/RobertFicoSVK"><img src="/assets/img/twitter-icon.png" alt="Twitter"></a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 BeerFinder. <?= $t['footer']['footer-bottom']?></p>
  </div>
    <footer> 
    <script src="/assets/scripts/global.js"></script>
    <script type="module" defer src="/assets/scripts/script.js"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</body> 

</html>