function datenHolen(URL){ // JSON von URL holen (Luftdaten.info)

  function Get(url){ //Funktion: Daten von URL holen
    var Httpreq = new XMLHttpRequest();
    Httpreq.open("GET",url,false);
    Httpreq.send(null);
    return Httpreq.responseText;
  }

  var luftdatenJSON = Get(URL); //LuftdatenMD holen und in Variable speichern
  var JSONtoObj = JSON.parse(luftdatenJSON); //GeoJSON String in Objekt umwandeln
  return JSONtoObj;
}

function welcheSensoren(ausObjekt){ // Welche Sensorentrypen sind in dem Objekt (Luftdaten.info Daten) enthalten?
  var sensortypen = []; // Liste "sensortypen" erstellen
  for (i = 0; i < ausObjekt.length; i++){ // Über Objekt iterieren
    if (i == 0){
      sensortypen.push(ausObjekt[i].sensor.sensor_type.name); // Beim ersten Schleifendurchlauf Typ- Namen speichern
    } else {
      var vorhanden = false; // Variable "vorhanden" bei jedem Schleifendurchlauf, nach dem ersten, definieren/auf false setzen
      for (j = 0; j < sensortypen.length; j++){ // Über bisher gespeicherte Sensortypen iterieren
        if(ausObjekt[i].sensor.sensor_type.name == sensortypen[j]){ // Wenn aktueller Sensortyp- Name einem der bisher gespeicherten entspricht ...
          vorhanden = true; // ... Variable "vorhanden" auf true setzen
        }
      }
      if (!vorhanden){ // Wenn Sensortyp- Name nich (!) "vorhanden" ist (false)...
        sensortypen.push(ausObjekt[i].sensor.sensor_type.name); // ... die Liste sensortypen mit aktuellen Sensortyp- Namen erweitern
      }
    }
  }
    //alert(sensortypen); //Sensortypen anzeigen lassen
    return sensortypen;
}

function LuftdatentoGeoJSON(ausObjekt){ // Funktion für das Umwandeln der Luftdaten.info JSON- Syntax in GeoJSON- Syntax für Mapbox (GL)
  var UmweltFeaturesSDS011 = new Object(); // Neues JS Objekt "UmweltFeaturesSDS011" erstellen
  UmweltFeaturesSDS011 = []; // Objekttyp ist Liste ("[]")
  var UmweltFeaturesDHT22_11 = new Object();
  UmweltFeaturesDHT22_11 = [];
  var UmweltFeaturesBME280 = new Object();
  UmweltFeaturesBME280 = [];
  var UmweltFtMerged = new Object();
  UmweltFtMerged = [];

  for (i = 0; i < ausObjekt.length; i++) { // Über JSON Objekt iterieren
    var vorhanden = false;
    var element = 0;
    var newFeature = { // GeoJSON ...
      "type": "Feature", // Feature- Syntax erstellen ...
      "geometry": {
        "type": "Point", // ... für Punkte ...
        "coordinates": [Number(ausObjekt[i].location.longitude), Number(ausObjekt[i].location.latitude)] //... mit Koordinaten
      }
    };

    var vorNull = " ";

    var timestamp = String(ausObjekt[i].timestamp).split(/[- :]/);
    if ((Number(timestamp[3]) + 2) < 10){
      vorNull = " 0";
    }
    var newTimestamp = String(timestamp[2] + "." + timestamp[1] + "." + timestamp[0] + vorNull + String(Number(timestamp[3]) + 2) + ":" + timestamp[4] + ":" + timestamp[5]);
    //if (i == 0) {alert (newTimestamp);}

    if (ausObjekt[i].sensor.sensor_type.name == "SDS011"){ // Wenn Sensortyp- Name des aktuellen Objektelementes ("i") "SDS011" ist ...
      newFeature["properties"] ={ // Variable "newFeature" mit Objekt "properties" (Eigenschafte) erweitern ...
        "SensorID": Math.floor(ausObjekt[i].id/1000),
        "SDS011": true,
        "Sensortyp": ausObjekt[i].sensor.sensor_type.name, // ... mit GeoJSON- Feature- properties- Syntax
        "locationID": Number(ausObjekt[i].location.id), // Eigenschaft "locationID" erzeugen und den entsprechenden Wert aus dem Objekt (Luftdaten.info) zuweisen
        "timestamp": newTimestamp, // Eigenschaft "timestamp" erzeugen und den entsprechenden Wert aus dem Objekt (Luftdaten.info) zuweisen
        "P1": Number(ausObjekt[i].sensordatavalues[0].value), // Eigenschaft "P1" erzeugen und den entsprechenden Wert aus dem Objekt (Luftdaten.info) zuweisen
        "P2": Number(ausObjekt[i].sensordatavalues[1].value) // Eigenschaft "P2" erzeugen und den entsprechenden Wert aus dem Objekt (Luftdaten.info) zuweisen
      };
      if (UmweltFeaturesSDS011.length == 0){ // Wenn noch keine Elemente in der (Feature-) Liste für den Sensor SDS011 vorhanden sind, UmweltFeaturesSDS011- Liste mit ...
        UmweltFeaturesSDS011.push(newFeature); // ... übernommenen Werten für SDS011- Sensor (in Variable "newFeature") erweitern
      } else {
          for (j = 0; j < UmweltFeaturesSDS011.length ; j++){ // Wenn bereits Elemente in der UmweltFeaturesSDS011- Liste vorhanden sind, übder diese Liste itrerieren
            if (newFeature.properties.locationID == UmweltFeaturesSDS011[j].properties.locationID){ // Ist die aktuelle ("newFeature.properties.locationID") locationID bereits in dem UmweltFeaturesSDS011- Listenelement "j" vorhanden ...
              vorhanden = true; // ... Variable "vorhanden" auf true setzen und ...
              element = j; // ... Listenindex in "element" speichern (= Elementindex -> 1 ... n)
            }
          }
          if (vorhanden){ // Wenn die locationID bereits "vorhanden" (true) ist ...
            UmweltFeaturesSDS011[element] = newFeature; // ... das alte UmweltFeaturesSDS011- Listenelement ("UmweltFeaturesSDS011[element]") durch aktuelles ("newFeature") ersetzen. So hat man immer die aktuellsten Werte, da bei Luftdaten.info immer mehrere Werte in chronologischer Reihenfolge gespeichert werden.
          } else { // Ansonsten (wenn die locationID nicht bereits "vorhanden" (true) ist) ...
            UmweltFeaturesSDS011.push(newFeature); // ... UmweltFeaturesSDS011- Liste mit übernommenen Werten für SDS011- Sensor (in Variable "newFeature") erweitern
          }
      }
    } else if (ausObjekt[i].sensor.sensor_type.name == "DHT22" || ausObjekt[i].sensor.sensor_type.name == "DHT11"){ // folgende zwei Feature- Definitionen und Schleifen wie vorige, nur für die Sensortypen "DHT22", "DHT11" und "BME280"
      newFeature["properties"] ={
        "SensorID": Math.floor(ausObjekt[i].id/1000),
        "Sensortyp": ausObjekt[i].sensor.sensor_type.name,
        "locationID": Number(ausObjekt[i].location.id),
        "timestamp": newTimestamp
      };
        if (ausObjekt[i].sensordatavalues[0].value_type == "humidity"){
          newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[0].value);
          newFeature.properties.Temperatur = Number(ausObjekt[i].sensordatavalues[1].value);
      } else if (ausObjekt[i].sensordatavalues[0].value_type == "temperature") {
        newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[0].value);
        newFeature.properties.Temperatur = Number(ausObjekt[i].sensordatavalues[1].value);
      }
      if (UmweltFeaturesDHT22_11.length == null){
        UmweltFeaturesDHT22_11.push(newFeature);
      } else {
          for (j = 0; j < UmweltFeaturesDHT22_11.length ; j++){
            if (newFeature.properties.locationID == UmweltFeaturesDHT22_11[j].properties.locationID){
              vorhanden = true;
              element = j;
            }
          }
          if (vorhanden){
            UmweltFeaturesDHT22_11[element] = newFeature;
          } else {
            UmweltFeaturesDHT22_11.push(newFeature);
          }
      }
    } else if (ausObjekt[i].sensor.sensor_type.name == "BME280"){
      newFeature["properties"] ={
        "SensorID": Math.floor(ausObjekt[i].id/1000),
        "Sensortyp": ausObjekt[i].sensor.sensor_type.name,
        "locationID": Number(ausObjekt[i].location.id),
        "timestamp": newTimestamp
      };
      if (ausObjekt[i].sensordatavalues[0].value_type == "temperature"){
        newFeature.properties.Temperatur = Number(ausObjekt[i].sensordatavalues[0].value);
        if (ausObjekt[i].sensordatavalues[1].value_type == "humidity") {
          newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[1].value);
          if (ausObjekt[i].sensordatavalues[2].value_type == "pressure") {
            newFeature.properties.Luftdruck = Number(ausObjekt[i].sensordatavalues[2].value);
          }
        } else if (ausObjekt[i].sensordatavalues[1].value_type == "pressure") {
          newFeature.properties.Luftdruck = Number(ausObjekt[i].sensordatavalues[1].value);
          if (ausObjekt[i].sensordatavalues[2].value_type == "humidity") {
            newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[2].value);
          }
        }
      } else if (ausObjekt[i].sensordatavalues[0].value_type == "humidity") {
        newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[0].value);
        if (ausObjekt[i].sensordatavalues[1].value_type == "humidity") {
          newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[1].value);
          if (ausObjekt[i].sensordatavalues[2].value_type == "pressure") {
            newFeature.properties.Luftdruck = Number(ausObjekt[i].sensordatavalues[2].value);
          }
        }
      }if (ausObjekt[i].sensordatavalues[0].value_type == "humidity"){
        newFeature.properties.Luftfeuchtigkeit = Number(ausObjekt[i].sensordatavalues[0].value);
        if (ausObjekt[i].sensordatavalues[1].value_type == "pressure") {
          newFeature.properties.Luftdruck = Number(ausObjekt[i].sensordatavalues[1].value);
          if (ausObjekt[i].sensordatavalues[2].value_type == "temperature") {
            newFeature.properties.Temperatur = Number(ausObjekt[i].sensordatavalues[2].value);
          }
        } else if (ausObjekt[i].sensordatavalues[1].value_type == "temperature") {
          newFeature.properties.Temperatur = Number(ausObjekt[i].sensordatavalues[1].value);
          if (ausObjekt[i].sensordatavalues[2].value_type == "pressure") {
            newFeature.properties.Luftdruck = Number(ausObjekt[i].sensordatavalues[2].value);
          }
        }
      }

      if (UmweltFeaturesBME280.length == 0){
        UmweltFeaturesBME280.push(newFeature);
      } else {
          for (j = 0; j < UmweltFeaturesBME280.length; j++){
            if (newFeature.properties.locationID == UmweltFeaturesBME280[j].properties.locationID){
              vorhanden = true;
              element = j;
            }
          }
          if (vorhanden){
            UmweltFeaturesBME280[element] = newFeature;
          } else {
            UmweltFeaturesBME280.push(newFeature);
          }
      }
    }
  }

  UmweltFtMerged = UmweltFeaturesSDS011;
  for (i = 0; i < UmweltFtMerged.length; i++){
    if (UmweltFeaturesDHT22_11.length > 0) {
      for (j = 0; j < UmweltFeaturesDHT22_11.length; j++){
        if (UmweltFtMerged[i].properties.locationID == UmweltFeaturesDHT22_11[j].properties.locationID){
        Object.assign(UmweltFtMerged[i].properties, UmweltFeaturesDHT22_11[j].properties);
        }
      }
    }
    if (UmweltFeaturesBME280.length > 0) {
    	for (k = 0; k < UmweltFeaturesBME280.length; k++){
    	  if (UmweltFtMerged[i].properties.locationID == UmweltFeaturesBME280[k].properties.locationID){
    		Object.assign(UmweltFtMerged[i].properties, UmweltFeaturesBME280[k].properties);
    	  }
    	}
    }
  }

  var UmweltdatenGeoJSON = new Object();
    UmweltdatenGeoJSON["type"] = "FeatureCollection";
    UmweltdatenGeoJSON["features"] = UmweltFtMerged;

  var JSONString = JSON.stringify(UmweltFtMerged);
  //console.log(JSONString);

  return UmweltdatenGeoJSON.features;
}
