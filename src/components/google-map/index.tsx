import GoogleMapReact from 'google-map-react';
import React from "react";

interface GoogleMapProps {
    lat?: number;
    lng?: number;
    zoom?: number;
}

interface MarkerProps {
    lat: number;
    lng: number;
    text: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
    lat = -3.745,
    lng = -38.523,
    zoom = 12
}) => {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyB2D8wrWMY3XZnuHO6C31uq90JiuaFzGws" }}
                defaultCenter={{ lat, lng }}
                defaultZoom={zoom}
            >
                <Marker
                    lat={lat}
                    lng={lng}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
};

const Marker: React.FC<MarkerProps> = ({ text }) => (
    <div className="map-marker">
        <img src={"/assets/img/icon-img/2.png"} alt={text} />
    </div>
);

export default GoogleMap;
