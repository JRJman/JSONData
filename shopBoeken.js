//keuze voorsoteer opties
let kenmerk = document.getElementById('kenmerk');
kenmerk.addEventListener('change', (e) => {
    sorteerBoekObj.kenmerk = e.target.value;
    sorteerBoekObj.voegJSdatumIn();
    sorteerBoekObj.sorteren();
})

//JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
        sorteerBoekObj.data = JSON.parse(this.responseText);
        sorteerBoekObj.voegJSdatumIn();

        // de data moeten ook een eigenschap hebben waarbij de titels in kapitalen staan
        // daarop kan dan gesorteerd worden
        sorteerBoekObj.data.forEach( boek => {
           boek.titelUpper = boek.titel.toUpperCase();
        });
        sorteerBoekObj.sorteren();
    }
};
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

// een tabelkop in markup uitvoeren uit een array
const maakTabelKop = (arr) => {
    let kop = "<table class='boekSelectie' ><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>"
    });
    kop += '</tr>';
    return kop;
}


// functie die een maand-string een nummer maakt
// waarbij januari een 0 geeft
// en december een 11
const geefMaandNummer = (maand) => {
    let nummer;
    switch (maand) {
        case "januari": nummer = 0; break;
        case "februari": nummer = 1; break;
        case "maart": nummer = 2; break;
        case "april": nummer = 3; break;
        case "mei": nummer = 4; break;
        case "juni": nummer = 5; break;
        case "juli": nummer = 6; break;
        case "augustus": nummer = 7; break;
        case "september": nummer = 8; break;
        case "oktober": nummer = 9; break;
        case "november": nummer = 10; break;
        case "december": nummer = 11; break;
        default: nummer = 0;
    }
    return nummer;
}

//functie die een string van maand naar jaar omzet in een data-object
const maakJSdatum = (maandJaar) => {
    let mjArray = maandJaar.split(' ');
    let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
    return datum;
}

const maakOpsomming = (array) => {
    let string = '';
    for(let i=0; i<array.length; i++){
        switch (i){
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + ' en '; break;
            default: string += array[i] + ", ";
        }
    }
    return string;
}

//maak een functie die de tekst achter de komma vooraan plaatst
const keerTekstOm = (string) => {
    if( string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}

// een winkelwagenobject deze
// 1. toegevoegde items bevat
// 2. methode om item te voegen
// 3. method om items te verwijderen
let winkelwagen = {
    items: [],
    toevoegen: function(el) {
        this.items.push(el);
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    }

};

// object dat de boeken uitvoert en sorteert en data bevat
// eigenschappen: data (sorteer)kenmerk
// methods: sorteren() en uitvoere()
let sorteerBoekObj = {
    data: "",       // komt van xmlhttp.onreadystatechange

    kenmerk: 'titel',

    //  sorteervolgorde en factor
    oplopend: 1,

    // een datumObject toevoegen aan this.data uit de string uitgave
    voegJSdatumIn: function() {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave);
        });
    },

    //data sorteren
    sorteren: function(){
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1*this.oplopend);
        this.uitvoeren(this.data);
    },

    //de data in een tabel uitvoeren
    uitvoeren: function(data) {
        document.getElementById('uitvoer').innerHTML = "";
        data.forEach( boek => {
            let sectie = document.createElement('sectie');
            sectie.className = 'boekSelectie';
            // main element met alle info behalve de prijs en afbeelding
            let main = document.createElement('main');
            main.className = 'boekSelectie__main';

            // cover maken (afbeelding)
            let afbeelding = document.createElement('img');
            afbeelding.className = 'boekSelectie__cover';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

            //titel maken
            let titel = document.createElement('h3');
            titel.className = 'boekSelectie__titel';
            titel.textContent = keerTekstOm(boek.titel);

            //auteurs toevoegen
            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteurs';
            //de voor en achternaam van de eerste auteur omdraaien
            boek.auteur[0] = keerTekstOm(boek.auteur[0]);
            //auteurs staan in een array: deze omzetten naar Nederlands string
            auteurs.textContent = maakOpsomming(boek.auteur);

            //overige info toevoegen
            let overig = document.createElement('p');
            overig.className = 'boekSelectie__overig';
            overig.textContent = 'datum: '+boek.uitgave+" | aantal pagina's "+boek.paginas+" | taal: "+boek.taal+" | ean "+boek.ean+" | genre: "+boek.genre;

            //prijs toevoegen
            let prijs = document.createElement('div');
            prijs.className = 'boekSelectie__prijs';
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            //knop toevoegen bij de prijs
            let knop = document.createElement('button');
            knop.className = 'boekSelectie__knop';
            knop.innerHTML = "voeg toe aan<br>winkelwagen";
            knop.addEventListener('click', () => {
                winkelwagen.toevoegen(boek);
            });

            // de element toevoegen
            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main);
            prijs.appendChild(knop);
            sectie.appendChild(prijs);
            document.getElementById('uitvoer').appendChild(sectie);
        })
    }
}

kenmerk.addEventListener('kenmerk', (e) => {
    sorteerBoekObj.kenmerk = e.target.value;
    sorteerBoekObj.sorteren();
})

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e)=> {
        sorteerBoekObj.oplopend = parseInt(e.target.value);
        sorteerBoekObj.sorteren();
    });
})