'use client';

import L from 'leaflet'
import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from 'react-leaflet'
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


function ClickHandler({ onClick }: { onClick: (coords: number[]) => void }) {
    useMapEvents({
      click(e) {
        onClick([e.latlng.lat, e.latlng.lng])
      }
    })
    return null
}

interface MapProps {
    center?:number[]
    nearbyCities?: { name: string; latlng: number[]; distance: number }[]
    onClickMap?: (coords: number[]) => void
}

// TODO : intégrer Leaflet Geosearch pour rechercher une adresse
  
const Map = ({center, nearbyCities, onClickMap}: MapProps) => {
    return (
        <MapContainer 
            center={center as L.LatLngExpression || [51, -0.09]}
            zoom={center ? 6 : 2}
            scrollWheelZoom={false}
            className='h-[35vh] rounded-lg'
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // https://react-leaflet.js.org/
            />

            {onClickMap && <ClickHandler onClick={onClickMap} />}

            {/* Marqueur principal (pays ou ville sélectionnée) */}
            {center && (
                <Marker 
                    position={(center ?? [51, -0.09]) as L.LatLngExpression} 
                />
            )}

        </MapContainer>
    )
}

export default Map
