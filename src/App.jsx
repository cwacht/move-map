import React from 'react';
import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import MyMap from "./MyMap";
import AddSpot from "./AddSpot";
import { SpotLocationProvider } from './SpotLocationContext';

// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function App() {
	const [session, setSession] = useState(null);
	// const [tabIndex, setTabIndex] = useState(0);
	const [selectedSpot, setSelectedSpot] = useState(null);
	const [openPeek, setOpenPeek] = useState("");

	const [selectedFile, setSelectedFile] = useState(null);

	async function handleFileChange(event) {
  // const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    const { data, error } = await supabase.storage
    .from('spot-images')
    .upload(`${selectedSpot.key.trim()}.png`, event.target.files[0])
      // .from('avatars')
      // .upload('public/avatar1.png', event.target.files[0])
    const { data: publicUrlData, error: publicUrlError } = await supabase.storage
        .from('spot-images')
        .getPublicUrl(`${selectedSpot.key.trim()}.png`);

    if (publicUrlError) {
      console.error('Error getting public URL:', publicUrlError);
      return;
    }
    // const imageUrl = publicUrlData.publicUrl;

    const { error: dbError } = await supabase
      .from('spots')
      .update({ image_url: publicUrlData.publicUrl })
      .eq('id', selectedSpot.id);

    if (dbError) {
      console.error('Error updating database:', dbError);
    }
  };

  function updateSelectedSpot(spot) {
  	console.log(spot)
		if(spot.key=="omg"){
			setOpenPeek("➕")
		}else{
			setOpenPeek("🧬")
		}
		setSelectedSpot(spot);
	}

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	function togglePanel(buttonID) {
		let button = document.getElementById(buttonID);
		let panelid = button.getAttribute("aria-controls");
		let panel = document.getElementById(panelid);
		if (panel.open) {
			panel.close();
			button.classList.remove("current");
		} else {
			let otherPanel = document.querySelector(".peek-panel-wrapper[open]");
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

	// function formChanged(elem) {
	// 	let button = document.getElementById(elem.getAttribute("data-button-id"));
	// 	if (elem.checked) {
	// 		button.classList.add("active");
	// 	} else {
	// 		button.classList.remove("active");
	// 	}
	// }

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
	// {props.peeks.map((peek) => (
	function Peeks({children}) {
		return (
			<>
				<nav>
					<ul>
						{React.Children.map(children, (child, index) => {
							return (
								<li>
									<button
										id={child.props.text + "Button"}
										className={"nav-button" + (child.props.text == child.props.openPeek ? " current" : "")}
										aria-controls={child.props.text + "Panel"}
										onClick={() => togglePanel(child.props.text + "Button")}
									>
										{child.props.text}
									</button>

								</li>
							);
			      })}
					</ul>
				</nav>
				{React.Children.map(children, (child, index) => {
					return (
						<dialog
							id={child.props.text + "Panel"}
							className="peek-panel-wrapper"
							data-nav-button={child.props.text + "Button"}
							open={child.props.text == child.props.openPeek ? true : false}
							// ref={(el) => (panelRefs.current.InfoPanel = el)}
						>
							<div className="peek-panel">
								{child.props.children}
							</div>
						</dialog>
					);
	      })}
			</>
		);
	};
	function Peek(props) {
		return (
			<li>
				<button
					// key={peek.key}
					// position={peek.location}
					// clickable={true}
      		// onClick={() => handleMarkerClick(peek)}
				>
					{props.text}
				</button>
			</li>
		);
	};


	return (
		<SpotLocationProvider>
			<header>
			  <h1>Move Map</h1>
			</header>
		<div className="container">
			<MyMap
				id="map"
				updateSelectedSpot={updateSelectedSpot}
				/>

			<Peeks>
				<Peek id="Info" text="🧬" openPeek={openPeek}>
					{!selectedSpot ? (
						"No Spot Selected"
					) : (
						<div>
							<h2>{selectedSpot.key}</h2>
							{!selectedSpot.image ? (
								"No Image"
							) : (
								<img src={selectedSpot.image}/>
							)}
						</div>
					)}
					Spot:<br/>
					{selectedSpot ? selectedSpot.key : "No Spot Selected"}<br/>
					Spot ID:<br/>
					{selectedSpot ? selectedSpot.id : "No Spot Selected"}<br/>
					<div>
			      <input type="file" onChange={handleFileChange} />
			      {selectedFile && <p>Selected file: {selectedFile.key}</p>}
			    </div>
				</Peek>
				<Peek id="AddSpot" text="➕" openPeek={openPeek}><AddSpot/></Peek>
				<Peek id="Search" text="🔍">
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
				</Peek>
				<Peek id="Settings" text="⚙️">
					Settings
					<button onClick={toggleFullscreen}>Toggle Fullscreen</button>
				</Peek>
				<Peek id="Account" text="👤">
					Account
					{!session ? (
						<Auth />
					) : (
						<Account key={session.user.id} session={session} />
					)}
				</Peek>
			</Peeks>
		</div>
    </SpotLocationProvider>
	);
}

export default App;
