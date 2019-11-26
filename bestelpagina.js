
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

// maak een functie die de tekst achter de komma vooraan plaatst
const keerTekstOm = (string) => {
    if( string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
};

// een winkelwagenobject deze
// 1. toegevoegde items bevat
// 2. een method om data op te halen uit localStorage
// 2. methode om item te voegen
// 3. method om items te verwijderen
// 4. method om items uit te voeren
let winkelwagen = {
    items: [],

    haalItemsOp: function() {
        let bestelling;
        if( localStorage.getItem('besteldeBoeken') == null ) {
            bestelling = [];
        } else {
            bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
        }
        bestelling.forEach( item => {
            this.items.push(item);
        });
        return bestelling;
    },

    toevoegen: function(el) {
        this.items = this.haalItemsOp();
        this.items.push(el);
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
        document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
    },

    //doorloop alle items en als de ean van het item overeenstemt, dit uit de items verwijderen
    verwijderItem: function(ean) {
        this.items.forEach((item,index) => {
            if(item.ean == ean){
                this.items.splice(index,1);
                ean = 4;
            }
        });
        // local storage bijwerken
        localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
        this.uitvoeren();
    }
    ,

    uitvoeren: function() {
        document.getElementById('bestelling').innerHTML = "";
        this.items.forEach( boek => {
            let sectie = document.createElement('sectie');
            sectie.className = 'besteldBoek';

            // cover maken (afbeelding)
            let afbeelding = document.createElement('img');
            afbeelding.className = 'besteldBoek__cover';
            afbeelding.setAttribute('src', boek.cover);
            afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

            //titel maken
            let titel = document.createElement('h3');
            titel.className = 'besteldBoek__titel';
            titel.textContent = keerTekstOm(boek.titel);

            //prijs toevoegen
            let prijs = document.createElement('div');
            prijs.className = 'besteldBoek__prijs';
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: 'currency'});

            // verwijderknop toevoegen
            let verwijder = document.createElement('div');
            verwijder.className = 'besteldBoek__verwijder';
            verwijder.addEventListener('click', () => {
               this.verwijderItem(boek.ean);
            });

            // de element toevoegen
            sectie.appendChild(afbeelding);
            sectie.appendChild(titel);
            sectie.appendChild(prijs);
            sectie.appendChild(verwijder);
            document.getElementById('bestelling').appendChild(sectie);
        });

        // winkelwagen aantal uitvoeren
        if(this.items.length>0){
            document.querySelector('.winkelwagen__aantal').innerHTML = this.items.length;
        } else {
            document.querySelector('.winkelwagen__aantal').innerHTML = "";
        }

    }

};

winkelwagen.haalItemsOp();
winkelwagen.uitvoeren();