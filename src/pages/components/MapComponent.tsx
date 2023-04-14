import React, { useEffect, useMemo, useRef } from 'react';
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
import { getPmus1, getPmus2 } from '../../data/phasorData';
import { useDisclosure, Button, Box } from "@chakra-ui/react";
import Overlay from 'ol/Overlay';


const MapComponent = () => {
  const data = useMemo(() => [...getPmus1(), ...getPmus2()], []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const universityRef = useRef();

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
          onOpen();
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
    
  }, [data, onOpen]);

  return (
    <>
      <div id="map-container" style={{ height: 'calc(100vh - 75px)' }} />
      <Box id="popup" width={100} bg='orange.400' p={2} borderRadius={20} display={isOpen ? "block" : "none"}>
        <p>{universityRef.current}</p>
        <Button onClick={onClose} size='xs' >Close</Button>
      </Box>
    </>
  );
};

export default MapComponent;
