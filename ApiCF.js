/* SEUTIN Jeffrey
 * Compagine Fiduciaire: Exercice de développement
 */

/* Choix du langage: JavaScript. Je pense que le serveur Apache que j'utilise 
 * n'autorise pas PHP à accéder à la ressource, alors que les cURL fonctionnent
 * parfaitement. Comme je ne suis pas admin (il s'agit du serveur de 
 * l'université) je ne peux pas ouvrir de port, alors je le fais en dépit en JS.
 */

//Inverse l'ordre des années, mois et jours pour comparer les dates comme des 
//strings (similaire à strcmp). 
function compareDate(date1, date2){
    let date1_splited = date1.split("/");
    let date2_splited = date2.split("/");
    let new_date1 = "", new_date2 = "";
    for (var i = date2_splited.length - 1; i >= 0; i--) {
      new_date1 += date1_splited[i];
      new_date2 += date2_splited[i];
    }
    return new_date1 < new_date2 ? -1 : ( new_date1 > new_date2 ? 1 : 0);
  }

//Classe demandé pour le test
class ApiCF {
  //note: url = "https://agrcf.lib.id/exercice@dev/"
  constructor(url) {
    this.url = url;
  }

  //méthode 1)
  getDataFromRIB(rib, date_min, date_max){
    //Lectures des datas JSON
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', this.url, true);
    //Interactions avec ces datas
    req.onload  = function() {
      //parsing en array
      var jsonResponse = JSON.parse(req.responseText);
      var ul = document.getElementById("list");

      document.getElementById("all").innerHTML = rib;
      //Triage par date des opérations
      var sorted_op = jsonResponse.operations.sort(
        function(a, b) {return compareDate(a.Date, b.Date)}
        );
      //parcours de l'array contenant les opérations
      sorted_op.forEach(function(operation) {
        if(operation.RIB == rib && compareDate(date_min, 
          operation.Date) <= 0 && compareDate(operation.Date, date_max) 
          <= 0) 
        {
          var li = document.createElement("li");
          //IIFE pour la création de Recette
          var recette = (function() {
            return (parseInt(operation.Montant, 10) > 0 ? operation.Montant 
              : 0)})();
          //IIFE pour la création de Dépense
          var depense = (function() {
            return (parseInt(operation.Montant, 10) < 0 ? 
              operation.Montant.substring(1) : 0)})();

          li.appendChild(document.createTextNode("Date: "+operation.Date
            +" | Libelle: "+operation.Libelle+" | Montant: "
            +operation.Montant+" | Devise: "+operation.Devise
            +" | Recette: "+ recette+" | Dépense: "+ depense));

          ul.appendChild(li);
        }
       
     });


    };
    req.send(null);
  }
  //méthode 2)
  computeSoldFromRIB(rib, date_min, date_max){
    //Lectures des datas JSON
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', this.url, true);
    //Interactions avec ces datas
    req.onload  = function() {
      //parsing en array
      var jsonResponse = JSON.parse(req.responseText);
      var solde = 0;
      //parcours de l'array contenant les opérations
      jsonResponse.operations.forEach(function(operation) {
        if(operation.RIB == rib && compareDate(date_min, 
          operation.Date) <= 0 && compareDate(operation.Date, date_max) 
          <= 0) 
        {
          //note: les virgules ne permettent pas de faire un float via le 
          //parseFloat, il faut un point
          solde += parseFloat(operation.Montant.replace(",","."));
        }
       
     });
      //note: permet un affichage à 2 décimales         vvvvvvvvvv
     document.getElementById("solde").innerHTML = solde.toFixed(2); 

    };
    req.send(null);
  }


}
//L'url en paramètre est l'accès à l'API.
const data = new ApiCF("https://agrcf.lib.id/exercice@dev/");
//getDataFromRIB(rib, date_min, date_max)
data.getDataFromRIB("18206002105487266700217", "01/01/2017", "01/07/2017");
//computeSoldFromRIB(rib, date_min, date_max)
data.computeSoldFromRIB("18206002105487266700217", "01/01/2017", "01/07/2017")

