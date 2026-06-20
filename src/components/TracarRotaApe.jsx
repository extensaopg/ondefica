import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

export default function TracarRotaApe({ origem, destino }) {
    const map = useMap();
    const routingRef = useRef(null);
    const ultimaOrigemRef = useRef(null);

    const DISTANCIA_MINIMA = 3;

    useEffect(() => {
        if (!origem || !destino) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(origem[0], origem[1]),
                L.latLng(destino[0], destino[1])
            ],

            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'foot'
            }),

            createMarker: () => null,
            lineOptions: { styles: [{ color: '#1976d2', weight: 5, opacity: 0.7 }] },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        });

        routingControl.addTo(map);
        routingRef.current = routingControl;

        ultimaOrigemRef.current = origem;

        return () => {
            if (routingRef.current) {
                map.removeControl(routingRef.current);
                routingRef.current = null;
            }
        };
    }, [destino, map]);

    useEffect(() => {
        if (!routingRef.current || !origem || !destino) return;

        const ultima = ultimaOrigemRef.current;

        if (!ultima) {
            ultimaOrigemRef.current = origem;
            return;
        }

        const distancia = map.distance(
            L.latLng(ultima[0], ultima[1]),
            L.latLng(origem[0], origem[1])
        );

        if (distancia < DISTANCIA_MINIMA) {
            return;
        }

        routingRef.current.setWaypoints([
            L.latLng(origem[0], origem[1]),
            L.latLng(destino[0], destino[1])
        ]);

        ultimaOrigemRef.current = origem;

    }, [origem, destino, map]);

    return null;
}