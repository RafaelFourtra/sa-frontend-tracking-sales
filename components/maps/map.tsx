"use client";

import { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";


interface OpenLayersMapProps {
  longitude: number;
  latitude: number;
  zoom?: number; 
  height?: string;
  width?: string;
}

const OpenLayersMap = ({ longitude, latitude, zoom = 10, height = "300px", width = "300px"  }: OpenLayersMapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (mapElement.current) {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
      }

      const markerFeature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });

      markerFeature.setStyle(
        new Style({
          image: new Icon({
            src: "/maps-and-flags.png", 
            scale: 0.06, 
          }),
        })
      );

      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [markerFeature],
        }),
      });

      mapRef.current = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          markerLayer, 
        ],
        view: new View({
          center: fromLonLat([longitude, latitude]),
          zoom,
        }),
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(null);
        mapRef.current = null;
      }
    };
  }, [longitude, latitude, zoom]);

  return <div ref={mapElement} className="rounded-lg shadow-md overflow-hidden" style={{ height: height, width: width }}></div>;
};

export default OpenLayersMap;
