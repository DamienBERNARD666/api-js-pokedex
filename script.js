$("form").submit(function(e) {
    e.preventDefault();
    //Retire la vue prècédente 
    $('#liste').empty();
    $('#img-pokemon').empty();

    //Récupére la valeur saisie par l'utilisateur
    let id = e.currentTarget.pokemon.value;

    //Gére les cas d'erreurs et empêche le traitement
    if(!id) {
        alert("Entrer un id");

        return
    } else if(id>807) {
        alert("Entrer un id inférieur à 807");
        return
    } else if(id<1) {
        alert("Veuillez saisir un ID supérieur ou égal à 1");
        return
    }

    //Effectue la requête API
    getPokemonById(id).then(result => {
            //Crée la div pour stocker les informations reçues
            var card = $('<div>', { class: "card"}).appendTo('#liste');

            //Modifie la couleur de la bordure de Bootstrap en fonction de la coleur du Pokémon saisi
            $(card).css('border-color', result.color.name);

            //Crée la div contenant les informations sur le Pokémon
            var pokemon = $('<div>', { class: "pokemon-info"}).appendTo(card);
            var text = $('<div>', { class: "card-body"}).appendTo(pokemon);

            //Parcoure les noms reçus de l'API afin de trouver la traduction française
            result.names.forEach(name => {
                if(name.language.name === "fr") {
                    $('<p>', { text: name.name, id: "title" }).appendTo(text);

                    //Modifie la coleur du titre en fonction de la couleur du Pokémon
                    $('#title').css('color', result.color.name);
                }
            })
           
            //Récupère le taux de capture
            $('<p>', { text: "Taux de capture: " + result.capture_rate + " %" }).appendTo(text);

            //Récupère la traduction française du type du Pokémon
            result.genera.forEach(groups => {
                if(groups.language.name === "fr") {
                    var types = $('<div>', { class: "types" }).appendTo(text);
                    $('<span>', { text: groups.genus + ""}).appendTo(types);
                }
               
            });

            //Récupére toutes les traduction françaises de la description du Pokémon et les affichent avec la version concernée
            result.flavor_text_entries.forEach(description => {
                if(description.language.name === "fr") {
                    var des = $('<div>', { class: "description"}).appendTo(text);
                    $('<span>', { text: "Version: " + description.version.name }).appendTo(des);
                    $('<br>').appendTo(des);
                    $('<span>', {text: description.flavor_text}).appendTo(des);                    
                }
            })

    })
    //Effectue la requête pour récupérer l'image du Pokémon concerné
    getPokemonImgById(id).then(result => {
        //Crée une div contenant la photo
        var cardImg = $('<div>', {class: "card"}).appendTo('#img-pokemon');

        //Crée l'image du Pokémon grâce au lien récupèré
        $('<img>', { src: result.sprites.back_default, class: "card-img-top"}).appendTo(cardImg);
    })



})


async function getPokemon() {
    //Effectue la requête à l'API
    const response = await fetch(`https://pokeapi.co/api/v2/pokedex/1/`);

    //Transforme la réponse de l'API en format JSON
    const data = await response.json();

    //Retourne le résultat
    return data;
}

async function getPokemonById(id) {

    //Effectue la requête à l'API
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    //Transforme la réponse en JSON
    const data = await response.json();

    //Retourne la réponse
    return data;
}


async function getPokemonImgById(id) {
    const response = await  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data
}