import "./App.css";
import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import MyMap from "./MyMap";
import AddSpot from "./AddSpot";
import { SpotLocationProvider } from './SpotLocationContext';
// import { SpotLocationContext } from './SpotLocationContext';

// export const SpotLocationContext = createContext({});

function App() {
	const [session, setSession] = useState(null);
	const [spotName, setSpotName] = useState("");
	// const { spotLocation } = useContext(SpotLocationContext);
	// const [spotLocation, setSpotLocation] = useState({});


	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	function togglePanel(buttonID) {
		// console.log(button);
		let button = document.getElementById(buttonID);
		let panelid = button.getAttribute("aria-controls");
		// let panelid = button;
		let panel = document.getElementById(panelid);
		if (panel.open) {
			panel.close();
			button.classList.remove("current");
		} else {
			let otherPanel = document.querySelector(".peek-panel-wrapper[open]");
			console.log(otherPanel);
			if (otherPanel) {
				otherPanel.close();
				let otherButton = document.getElementById(
					otherPanel.getAttribute("data-nav-button"),
				);
				otherButton.classList.remove("current");
			}
			panel.show();
			button.classList.add("current");
		}
	}

	function formChanged(elem) {
		let button = document.getElementById(elem.getAttribute("data-button-id"));
		if (elem.checked) {
			button.classList.add("active");
		} else {
			button.classList.remove("active");
		}
	}

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function addSpot() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

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
                        name: {spotName},
                        // location: `ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326)::geography`,
                        location: `POINT(${spotLocation.lng} ${spotLocation.lat})`
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
		<SpotLocationProvider>
		<div className="container">
			<MyMap id="map"/>

			<nav>
				<ul>
					<li>
						<button
							id="InfoButton"
							className="nav-button"
							aria-controls="InfoPanel"
							onClick={() => togglePanel("InfoButton")}
						>
							🧬
						</button>
					</li>
					<li>
						<button
							id="AddSpotButton"
							className="nav-button"
							aria-controls="AddSpotPanel"
							onClick={() => togglePanel("AddSpotButton")}
						>
							➕
						</button>
					</li>
					<li>
						<button
							id="SearchButton"
							className="nav-button"
							aria-controls="SearchPanel"
							onClick={() => togglePanel("SearchButton")}
						>
							🔍
						</button>
					</li>
					<li>
						<button
							id="SettingsButton"
							className="nav-button"
							aria-controls="SettingsPanel"
							onClick={() => togglePanel("SettingsButton")}
						>
							⚙️
						</button>
					</li>
					<li>
						<button
							id="AccountButton"
							className="nav-button"
							aria-controls="AccountPanel"
							onClick={() => togglePanel("AccountButton")}
						>
							👤
						</button>
					</li>
				</ul>
			</nav>

			<dialog
				id="InfoPanel"
				className="peek-panel-wrapper"
				data-nav-button="InfoButton"
				// ref={(el) => (panelRefs.current.InfoPanel = el)}
			>
				<div className="peek-panel">
					<form onSubmit={(e) => e.preventDefault()}>
						{" "}
						{/* Prevent default form submission */}
						<input
							type="checkbox"
							id="InfoPanelActive"
							name="InfoPanelActive"
							value="InfoPanelActive"
							data-button-id="InfoButton"
							// onChange={formChanged}
						/>
						<label htmlFor="InfoPanelActive">Info Panel Active</label>
					</form>
				</div>
			</dialog>

			<dialog
				id="AddSpotPanel"
				className="peek-panel-wrapper"
				data-nav-button="AddSpotButton"
				// ref={(el) => (panelRefs.current.AddSpotPanel = el)}
			>
				<div className="peek-panel">
					<AddSpot/>
				</div>
			</dialog>

			<dialog
				id="SearchPanel"
				className="peek-panel-wrapper"
				data-nav-button="SearchButton"
				// ref={(el) => (panelRefs.current.SearchPanel = el)}
			>
				<div className="peek-panel">
					<form onSubmit={(e) => e.preventDefault()}>
						<input
							type="checkbox"
							id="SearchPanelActive"
							name="SearchPanelActive"
							value="SearchPanelActive"
							data-button-id="SearchButton"
							// onChange={formChanged}
						/>
						<label htmlFor="SearchPanelActive">Search Panel Active</label>
					</form>
				</div>
			</dialog>

			<dialog
				id="SettingsPanel"
				className="peek-panel-wrapper"
				data-nav-button="SettingsButton"
				// ref={(el) => (panelRefs.current.SettingsPanel = el)}
			>
				<div className="peek-panel">
					Settings
					<button onClick={toggleFullscreen}>Toggle Fullscreen</button>
				</div>
			</dialog>

			<dialog
				id="AccountPanel"
				className="peek-panel-wrapper"
				data-nav-button="AccountButton"
				// ref={(el) => (panelRefs.current.AccountPanel = el)}
			>
				<div className="peek-panel">
					Account
					{!session ? (
						<Auth />
					) : (
						<Account key={session.user.id} session={session} />
					)}
				</div>
			</dialog>
		</div>
    </SpotLocationProvider>
	);
}

export default App;
