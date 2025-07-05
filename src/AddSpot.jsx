import React, { useContext, useState } from "react";
import { SpotLocationContext } from "./SpotLocationContext";
import { supabase } from "./supabaseClient";

function AddSpot() {
	const [spotName, setSpotName] = useState("");
	const { spotLocation } = useContext(SpotLocationContext);

	async function addLocation() {
		try {
			const { data, error } = await supabase.from("spots").insert([
				{
					name: `${spotName}`,
					location: `POINT(${spotLocation.lng} ${spotLocation.lat})`,
				},
			]);

			if (error) {
				console.error("Error inserting location:", error.message);
			} else {
				console.log("Location added successfully:", data);
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		}
	}

	return (
		<form>
			<label htmlFor="AddSpot_Name">Spot Name</label>
			<input
				id="AddSpot_Name"
				value={spotName}
				onChange={(e) => setSpotName(e.target.value)}
			></input>
			{/* <label for="AddSpot_Location">Spot Location</label>
			<input id="AddSpot_Location" value={JSON.stringify(spotLocation.location)}></input> */}
			<button
				className="button block"
				type="button"
				onClick={() => addLocation("Central Park", -73.965423, 40.782916)}
			>
				Add Spot
			</button>
		</form>
	);
}

export default AddSpot;
