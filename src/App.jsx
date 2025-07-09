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
	const [selectedSpot, setSelectedSpot] = useState("No Spot Selected");
	const [openPeek, setOpenPeek] = useState("");

  function updateSelectedSpot(text) {
		if(text=="omg"){
			setOpenPeek("➕")
		}else{
			setOpenPeek("🧬")
		}
		setSelectedSpot(text);
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
					Spot:<br/>
					{selectedSpot}
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
