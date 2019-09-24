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

const maakTabelRij = (arr, accent) => {
    let rij = "";
    if(accent == false){
        rij = "<tr class='boekSelectie__rij--accent'>"
    } else {
        rij = "<tr class='boekSelectie__rij'>"
    }

    arr.forEach((item) => {
        rij += "<td class='boekSelectie__data--cel'>" + item + "</td>"
    });
    rij += '</tr>';
    return rij;
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

// object dat de boeken uitvoert en sorteert en data bevat
// eigenschappen: data (sorteer)kenmerk
// methods: sorteren() en uitvoere()
let sorteerBoekObj = {
    data: "",       //komt van xmlhttp.onreadystatechange

    kenmerk: 'titel',

    //sorteervolgorde en factor
    oplopend: 1,

    // een datumObject toevoegen aan this.data uit de string uitgave
    voegJSdatumIn: function() {
        this.data.forEach((item) => {
            item.jsDatum = maakJSdatum(item.uitgave);
        });
    },

    //data sorteren
    sorteren: function(){
        this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function(data) {
        let uitvoer = maakTabelKop(
            ['titel',
                'cover',
                'auteur(s)',
                'uitgave',
                'paginas',
                'taal',
                'ean',
                'price',
                'genre']);
        for(let i=0; i<this.data.length; i++){
            let accent = false;
            i%2 == 1 ? accent = true : accent = false;
            let imgElement =
                '<img src="'
                + this.data[i].cover
                + '" class="boekSelectie__cover" alt="'
                + data[i].titel
                + '" >';
            let auteurs = maakOpsomming(data[i].auteur);
            uitvoer += maakTabelRij(
                [data[i].titel,
                    auteurs,
                    imgElement ,
                    data[i].uitgave,
                    data[i].paginas,
                    data[i].taal,
                    data[i].ean,
                    data[i].price,
                    data[i].genre], accent);
        }

        document.getElementById('uitvoer').innerHTML = uitvoer;

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