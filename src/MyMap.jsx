import { useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient";
import { SpotLocationContext } from "./SpotLocationContext";

import {
	APIProvider,
	Map,
	AdvancedMarker,
	Pin,
	ControlPosition,
} from "@vis.gl/react-google-maps";

export default function MyMap({ updateSelectedSpot }) {
	const [spots, setSpots] = useState([]);
	const { setSpotLocation } = useContext(SpotLocationContext);

	useEffect(() => {
		loadSpots();
	}, []);
	const PoiMarkers = (props) => {
		return (
			<>
				{props.pois.map((poi) => (
					<AdvancedMarker
						key={poi.key}
						position={poi.location}
						clickable={true}
        		onClick={() => updateSelectedSpot(poi.key)}
					>
						<Pin
							background={poi.key=="omg" ? "cornflowerblue" : "#FBBC04"}
							glyphColor={"#000"}
							borderColor={"#000"}
						/>
					</AdvancedMarker>
				))}
			</>
		);
	};
	const position = { lat: 40.712776, lng: -74.005974 }; // Example: New York City

	const onMapClick = (e) => {
		setSpots( spots.filter((spot) => spot.key !== "omg") );
		let lat = Number(e.detail.latLng.lat.toFixed(6));
		let lng = Number(e.detail.latLng.lng.toFixed(6));
    // Update the state with the new array
      const newMarker = {
	      key:"omg",
	      location: {
	        lat: lat,
	        lng: lng,
	      }
      };
      setSpotLocation({
	        lat: lat,
	        lng: lng,
	      })
      setSpots((currentMarkers) => [...currentMarkers, newMarker]);
    };

	async function loadSpots() {
		try {
			const { data, error } = await supabase.rpc("spots_lat_long"); //.from("spots").select("*");

			if (error) {
				throw error;
			}
			const newArray = data.map((obj) => {
				const { name, lat, long, ...rest } = obj;
				return {
					key: name,
					location: { lat: lat, lng: long },
					...rest,
				};
			});
			setSpots(newArray);
		} catch (error) {
			console.log("Error loading spots: ", error.message);
		}
	}

	return (
		<APIProvider
			apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
			// onLoad={() =>
			// 	console.log(
			// 		"Maps API has loaded: " + import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
			// 	)
			// }
		>
			<div className="map">
				<Map
					defaultZoom={13}
					defaultCenter={position}
					mapId="DEMO_MAP_ID"
					gestureHandling={"greedy"}
					// onCameraChanged={(ev) =>
					// 	console.log(
					// 		"camera changed:",
					// 		ev.detail.center,
					// 		"zoom:",
					// 		ev.detail.zoom,
					// 	)
					// }
					onClick={onMapClick}
					mapTypeControlOptions={{
			      position: ControlPosition.TOP_RIGHT,
			    }}
					cameraControl={false}
					// cameraControlOptions={{
			  //     position: ControlPosition.RIGHT_TOP,
			  //   }}
					streetViewControl={false}
					// streetViewControlOptions={{
			  //     position: ControlPosition.RIGHT_TOP,
			  //   }}
					// setTabIndex={() => setTabIndex(0)}
				>
					{spots ? <PoiMarkers pois={spots} /> : ""}
				</Map>
			</div>
		</APIProvider>
	);
}
