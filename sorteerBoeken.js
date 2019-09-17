//JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if(this.readyState==4 && this.status == 200){
        sorteerBoekObj.data = JSON.parse(this.responseText);
        sorteerBoekObj.sorteren();
    }
}
xmlhttp.open('GET', 'boeken.json', true);
xmlhttp.send();

let sorteerBoekObj = {
    data: "",

    sorteren: function(){
        this.data.sort( (a,b) => a.titel > b.titel ? 1 : -1);
        this.uitvoeren();
    },

    uitvoeren: function() {
        let uitvoer = "<table><tr class='table_head'><td>Titel</td><td>Cover</td><td>Auther</td><td>Uitgave</td><td>Paginas</td><td>Taal</td><td>Ean</td><td>Price</td><td>Genre</td></tr>";
        for( let i=0; i<this.data.length; i++){
            uitvoer += '<tr>';
            uitvoer += '<td>' + this.data[i].titel + '</td>';
            uitvoer += '<td><img src=' + this.data[i].cover + ' alt=cover ></td>';
            uitvoer += '<td>' + this.data[i].auteur[0] + '</td>';
            uitvoer += '<td>' + this.data[i].uitgave + '</td>';
            uitvoer += '<td>' + this.data[i].paginas + '</td>';
            uitvoer += '<td>' + this.data[i].taal + '</td>';
            uitvoer += '<td>' + this.data[i].ean + '</td>';
            uitvoer += '<td>' + this.data[i].price + '</td>';
            uitvoer += '<td>' + this.data[i].genre + '</td>';
            uitvoer += '</tr>';
        }
        uitvoer += '</table>';
        document.getElementById('uitvoer').innerHTML = uitvoer;
    }
}
