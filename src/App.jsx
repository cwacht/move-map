import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Account from "./Account";
import MyMap from "./MyMap";

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	function togglePanel(button) {
		// console.log(button);
		// let panelid = button.getAttribute("aria-controls");
		let panelid = button;
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

	return (
		<div className="container">
			<MyMap id="map" />

			<nav>
				<ul>
					<li>
						<button
							id="InfoButton"
							className="nav-button"
							aria-controls="InfoPanel"
							onClick={() => togglePanel("InfoPanel")}
						>
							🧬
						</button>
					</li>
					<li>
						<button
							id="NotificationsButton"
							className="nav-button"
							aria-controls="NotificationsPanel"
							onClick={() => togglePanel("NotificationsPanel")}
						>
							🔔
						</button>
					</li>
					<li>
						<button
							id="SearchButton"
							className="nav-button"
							aria-controls="SearchPanel"
							onClick={() => togglePanel("SearchPanel")}
						>
							🔍
						</button>
					</li>
					<li>
						<button
							id="SettingsButton"
							className="nav-button"
							aria-controls="SettingsPanel"
							onClick={() => togglePanel("SettingsPanel")}
						>
							⚙️
						</button>
					</li>
					<li>
						<button
							id="AccountButton"
							className="nav-button"
							aria-controls="AccountPanel"
							onClick={() => togglePanel("AccountPanel")}
						>
							👤
						</button>
					</li>
				</ul>
			</nav>

			<dialog
				id="InfoPanel"
				className="peek-panel-wrapper"
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
				id="NotificationsPanel"
				className="peek-panel-wrapper"
				// ref={(el) => (panelRefs.current.NotificationsPanel = el)}
			>
				<div className="peek-panel">Notifications</div>
			</dialog>

			<dialog
				id="SearchPanel"
				className="peek-panel-wrapper"
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
	);
}

export default App;
