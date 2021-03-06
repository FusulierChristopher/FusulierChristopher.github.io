window.onload = function () {
 // WMTS-Layer basemap.at - Quelle: http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml
        var layers = {
            geolandbasemap: L.tileLayer("https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapgrau: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmapoverlay: L.tileLayer("https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaphidpi: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            bmaporthofoto30cm: L.tileLayer("https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                attribution: 'Datenquelle: <a href="http://www.basemap.at/">basemap.at</a>'
            }),
            osm: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                subdomains: ['a', 'b', 'c'],
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
        };

        // Karte definieren
        var map = L.map('map', {
            layers: [layers.geolandbasemap],
            center : [47.654, 13.370],
            zoom : 8
        });

        // Maßstab hinzufügen
        L.control.scale({
            maxWidth: 200,
            metric: true,
            imperial: false
        }).addTo(map);
			// Höhenprofil control hinzufügen
		var profileControl = L.control.elevation({
		    position : 'bottomleft',
		    theme : 'purple-theme'
	    });
	    profileControl.addTo(map);
		
		function loadTrack(track) {
		
		// Funktion zum Laden eines Tracks
		function loadTrack(gpxFile) {
		// Etappen Info anzeigen
			console.log("etappeninfo: ", window.ETAPPENINFO);
			console.log("info : ", window.ETAPPENINFO[gpxFile]);
			console.log("Kurztext: ", window.ETAPPENINFO[gpxFile].Kurztext);
			document.getElementById("Kurztext").innerHTML = window.ETAPPENINFO[gpxFile].Kurztext;
			
			
			// bestehenden Track, farbige Linie mit steigendem Profl löschen
			gpxTrackGroup.clearLayers();
			colordLineGroup();
			profileControle.clear();
			};
			
	    // GPX Track laden
	    gpxTrack = omnivore.gpx('Data/'+track).addTo(map);
		console.log(track);
		// nach erfolgreichem Laden Popup hinzufügen, Ausschnitt setzen und Höhenprofil erzeugen
	   gpxTrack.on('ready', function () {
	    // Popup hinzufügen
	   var markup = '<h3>Adlerweg-Etappe 22: Memminger Hütte - Ansbacher Hütte</h3>';
	   markup += '<p>Tobel sind tiefe, schluchtartige Einschnitte in Steilhängen oder stark eingetiefte Täler eines Wildbaches. Man wird solche Tobel bei dieser Etappe öfters passieren, auch hat man wieder Scharten, Jöcher, steile Wiesenflanken und Schuttreisen zu bewältigen, aber dabei immer ein herrliches Panorama vor Augen. Zuerst zieht der Weg in abschüssigem Gelände hinunter ins Parseiertal. Die Höhenmeter macht man wieder wett beim Aufstieg ins Langkar und zur Grießlscharte. Nach dem Winterjöchl führt der Weg hinter dem Stierkopf vorbei und felsig empor zur Kopfscharte. Von hier durch Grashänge in Richtung Süden zur Ansbacher Hütte. </p>'
	               markup += '<li>Ausgangspunkt: Memminger Hütte</li>';
	               markup += '<li>Endpunkt: Ansbacher Hütte</li>';
	               markup += '<li>Höhenmeter bergauf: 1040</li>';
	               markup += '<li>Höhenmeter bergab: 900</li>';
	               markup += '<li>Höchster Punkt: 2620</li>';
	               markup += '<li>Schwierigkeitsgrad: schwierig</li>';
	               markup += '<li>Streckenlänge (in km): 10</li>';
	               markup += '<li>Gehzeit (in Stunden): 6</li>';
	               markup += '<li>Einkehrmöglichkeiten: Memminger Hütte, Ansbacher Hütte</li>';
	               markup += '<li><a href="http://www.tirol.at/reisefuehrer/sport/wandern/wandertouren/a-adlerweg-etappe-22-memminger-huette-ansbacher-huette">Weitere Informationen</a></li>';
	               gpxTrack.bindPopup(markup, { maxWidth : 450 });

	               // Ausschnitt setzen
	               map.fitBounds(gpxTrack.getBounds());

	               // Höhenprofil erzeugen
				   profileControl.clear();
	               gpxTrack.eachLayer(function(layer) {
	                   profileControl.addData(layer.feature);
						//console.log(layer.feature.geometry.coordinates;
						var pts = layer.feature.geometry.coordinates;
					   
						for (var i= 1; i < pts.length; i +=1) {
							//console.log(pts[i]); //aktuelle Punkt
							//console.log(pts[i-1]); //vorhergehender Punkt
							
							// Entfernung bestimmen
							var dist = map.distance (
								[ pts[i][1],pts[i][0] ],
								[ pts[i-1][1],pts[i-1][0] ]
							).toFixed(0);
						//console.log(dist);
						
						var delta = pts[i][2] - pts[i-1][2];
						//console.log(delta, "Höhenmeter auf",dist,"m Strecke");
						
						var rad = Math.atan(delta/dist);
						var deg = (rad * (180 / Math.PI)).toFixed(1);
						//console.log(deg);
						
						//var rot = ["#ab2524", "#a02128", "#a1232b", #8d1d2c", "#701f29", "#5e2028"];
						//var gruen = ["#42EB00", "#38C400", "#288F00", "#195700", "#0A2400"];
						
						//rot http://colorbrewer2.org/?type=sequential&scheme=YlOrRd&n=6['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']
						
						//grün http://colorbrewer2.org/?type=sequential&scheme=YlGn&n=6['#ffffcc','#d9f0a3','#addd8e','#78c679','#31a354','#006837']
						var farbe;
						switch(true) { // checks if condition is true, not for certain values of a variable
							case (deg >= 20) :  farbe = "#bd0026"; break;
							case (deg >= 15) :  farbe = "#f03b20"; break;
							case (deg >= 10) :  farbe = "#fd8d3c"; break;
							case (deg >= 5) :  farbe = "#feb24c"; break;
							case (deg >= 1) :  farbe = "#fed976"; break;
							case (deg >= -1) :  farbe = "yellow"; break;
							case (deg >= -5) :  farbe = "#d9f0a3"; break;
							case (deg >=-10) :  farbe = "#addd8e"; break;
							case (deg >=-15) :  farbe = "#78c679"; break;
							case (deg >= -20) :  farbe = "#31a354"; break;
							case (deg < -20) :  farbe = "#006837"; break;
						}
						//console.log(deg,farbe);
						
						
						 //Linie zeichnen 
						var pointA = new L.LatLng(pts[i][1],pts[i][0]);
						var pointB = new L.LatLng(pts[i-1][1],pts[i-1][0]);
						var pointList = [pointA, pointB];
   
						var firstpolyline = new L.Polyline(pointList, {
							color: farbe,
							weight: 6,
							opacity: 1.0,
							smoothFactor: 1

						});
    
						firstpolyline.addTo(map);
						
						}
	               });
	           });
		}  //end function loadTrack
	 
	 
	   // leaflet-hash aktivieren
	           var hash = new L.Hash(map);
		

	   		var huts = L.icon({
	   			iconUrl: 'icons/cabin-2.png',
	   			iconAnchor: [16, 37]		
	   		});
	   		L.featureGroup([
	   			L.marker ([47.200278, 10.478333], { title: "Memminger Hütte", icon: huts } ),
	   			L.marker ([47.168333, 10.403056], { title: "Ansbacher Hütte", icon: huts} )
	   		]).addTo(map);
		

	   		var start = L.icon({
	   			iconUrl: 'icons/dogs_leash.png',
	   			iconAnchor: [16, 37]
	   		});
	   		L.marker([47.20055, 10.478617], { title: "Start Etappe 22", icon: start}).addTo(map);
		
	   		var end = L.icon({
	   			iconUrl: 'icons/flag-export.png',
	   			iconAnchor: [16, 37]
	   		});
	   		L.marker([47.168333, 10.403333], { title: "Ziel Etappe 22", icon: end}).addTo(map);
		var hutsLayer = L.featureGroup();
		for (var i=0; i<huts.length; i++) {
			hutsLayer.addLayer(huts[i]);
		}
		//hutsLayer.addTo(map);
		map.on("zoomend", function() {
			if (map.getZoom() >= 15) {
				map.addLayer(hutsLayer);
			} else {
				map.removeLayer(hutsLayer);
			}
		});			

        // WMTS-Layer Auswahl hinzufügen
        var layerControl = L.control.layers({
            "basemap.at - STANDARD": layers.geolandbasemap,
            "basemap.at - GRAU": layers.bmapgrau,
            "basemap.at - OVERLAY": layers.bmapoverlay,
            "basemap.at - HIGH-DPI": layers.bmaphidpi,
            "basemap.at - ORTHOFOTO": layers.bmaporthofoto30cm,
            "OpenStreetMap": layers.osm,
        }).addTo(map);
		
		//zwischen den Etappen hin uind her schalten
		var etappenSelektor = document.getElementById("etappen");
		//console.log("Selektor", etappenSelektor);
		etappenSelektor.onchange = function(evt) {
			console.log("Change event:", evt);
			console.log("GPX Track laden", etappenSelektor[etappenSelektor.selectedIndex].value);
			loadTrack(etappenSelektor[etappenSelektor.selectedIndex].value);
		}
		loadTrack("AdlerwegEtappe01.gpx")
};