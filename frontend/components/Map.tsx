'use client';

import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css"


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
    center?:number[]
}

// TODO : ajouter un sélecteur de localisation (comme Airbnb), rendre la carte cliquable pour choisir une position, intégrer Leaflet Geosearch pour rechercher une adresse

const Map = ({center}: MapProps) => {
    return (
        <MapContainer 
            center={center as L.LatLngExpression || [51, -0.09]}
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // https://react-leaflet.js.org/
            />
            {center && (
                <Marker 
                    // position={center as L.LatLngExpression} 
                    position={(center ?? [51, -0.09]) as L.LatLngExpression} 
                />
            )}
        </MapContainer>
    )
}

export default Map
