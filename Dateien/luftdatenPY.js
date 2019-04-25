function Luftdaten(){
  var URL='https://api.myjson.com/bins/15i0s0'; //LuftdatenMD geoJSON URL

  function Get(url){ //Funktion: Daten von URL holen
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
  }

  var luftdatenJSON = Get(URL); //LuftdatenMD holen und in Variable speichern
  var JSONtoObj = JSON.parse(luftdatenJSON); //GeoJSON Strin in Objekt umwandeln

/*var JSONString = JSON.stringify(JSONtoObj.features);
  alert(JSONString);*/

  return JSONtoObj.features;
}
