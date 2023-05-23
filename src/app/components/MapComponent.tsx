import React, { useEffect, useMemo, useRef, useState } from 'react';
import 'ol/ol.css';
import * as ol from 'ol';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { getPmus1, getPmus2 } from '../data/phasorData';

const MapComponent = () => {
  const data = useMemo(() => [...getPmus1(), ...getPmus2()], []);
  const [isOpen, setIsOpen] = useState(false);
  const universityRef = useRef(null);

  useEffect(() => {
    const points = data.map(({ coordinates, university }) => {
      const { latitude, longitude } = coordinates;
      const feature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
        name: university,
      });
      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: 'white',
              width: 2,
            }),
          }),
        })
      );
      return feature;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: points,
      }),
    });

    const map = new Map({
      target: 'map-container',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-73, -15]),
        zoom: 4.5,
      }),
      controls: [],
    });

    map.on('singleclick', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f) as ol.Feature | undefined;
      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          const universityName = feature.get('name');
          universityRef.current = universityName;
          setIsOpen(true);
          const popup = new ol.Overlay({
            position: coordinates,
            element: document.getElementById('popup')!,
            autoPan: true,
          });
          map.addOverlay(popup);
        }
      }
    });

    return () => {
      map.un('singleclick', () => {});
    };

  }, [data]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div id="map-container" style={{ height: 'calc(100vh - 75px)' }} />
      <div id="popup" className={`w-100 bg-orange-400 p-2 rounded-2xl ${isOpen ? 'block' : 'hidden'}`}>
        <p>{universityRef.current}</p>
        <button onClick={handleClose} className="text-xs">Close</button>
      </div>
    </>
  );
};

export default MapComponent;
