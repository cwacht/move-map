// AuthButtons.js
import React, { useContext, useState } from 'react';
import { SpotLocationContext } from './SpotLocationContext';
import { supabase } from "./supabaseClient";


function AuthButtons() {
	const [spotName, setSpotName] = useState("");
	const { spotLocation, setNewSpotLocation } = useContext(SpotLocationContext);


	async function addLocation(name, longitude, latitude) {
		console.log(spotLocation);
        try {
            const { data, error } = await supabase
                .from('spots')
                .insert([
                	// {
                 //    name: 'Supa Burger',
                 //    location: 'POINT(-73.965423 40.782916)',
                 //  },
                    {
                        name: spotName,
                        // location: `ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326)::geography`,
                        location: `POINT(${spotLocation.location.lng} ${spotLocation.location.lat})`
                        // Alternatively: `ST_GeographyFromText('SRID=4326;POINT(${longitude} ${latitude})')`
                    }
                ]);

            if (error) {
                console.error('Error inserting location:', error.message);
            } else {
                console.log('Location added successfully:', data);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    }

  return (
	  <form>
			<label for="AddSpot_Name">Spot Name</label>
			<input id="AddSpot_Name" value={spotName} onChange={(e) => setSpotName(e.target.value.spotName)}></input>
			{/* <label for="AddSpot_Location">Spot Location</label>
			<input id="AddSpot_Location" value={JSON.stringify(spotLocation.location)}></input> */}
			<button
	      className="button block"
	      type="button"
	      onClick={() => addLocation('Central Park', -73.965423, 40.782916)}
	    >
	     	Add Spot
	    </button>
		</form>
  );
}

export default AuthButtons;
