import urllib.request, json


features = []
locations = []

#URL luftdaten.info für Daten von Magdeburg in als Zeichenkette in Variable url speichern
#json datein vom Speicherort der in url gepseichert ist laden und decodieren (Ergebnis ist eine Liste)
with urllib.request.urlopen('http://api.luftdaten.info/v1/filter/area=52.124886,11.634044,18') as url:
    daten = json.loads(url.read().decode())

# Über die Liste in daten itereieren und mit jedem Schleifendurchlauf Daten-Liste mit feature Dictionary ertweitern
for i in range(len(daten)):
    vorhanden = 0
    if daten[i]['sensor']['sensor_type']['name'] == "SDS011":
        feature = {
                    'type': 'Feature',
                    'geometry' : {
                        'type' : 'Point',
                        'coordinates': [float(daten[i]['location']['longitude']), float(daten[i]['location']['latitude'])]
                    },
                    'properties': {
                        'id' : int(daten[i]['location']['id']),
                        'timestamp' : str(daten[i]['timestamp']),
                        'P1' : float(daten[i]['sensordatavalues'][0]['value']),
                        'P2' : float(daten[i]['sensordatavalues'][1]['value'])
                    }
        }
        for j in range(len(locations)):
            if i == 0:
                features.append(feature)
                locations.append(feature['properties']['id'])
            elif feature['properties']['id'] == locations[j]:
                vorhanden = 1
        if vorhanden == 0:
            features.append(feature)
            locations.append(feature['properties']['id'])

#print(locations)

#Variable geoJSON erstellen (dict)
geoJSON = {
               'type' : 'Featurecollection',
               'features' : features
          }

#luftdatenMD.geojson öffnen/erstellen, variable geoJSON formatiert schreiben und (Schreib-)Zugriff beenden.
datei = open('luftdatenMD.geojson', 'w')
json.dump(geoJSON, datei, indent=4)
datei.close()
