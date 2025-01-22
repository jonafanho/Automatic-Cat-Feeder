import {Component} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {DataService} from "../../service/data.service";

@Component({
	selector: "app-wifi-card",
	imports: [
		MatCardModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
	],
	templateUrl: "./wifi-card.component.html",
	styleUrls: ["./wifi-card.component.css"],
})
export class WifiCardComponent {
	protected ssid = "";
	protected password = "";

	constructor(private readonly dataService: DataService) {
	}

	getSsid() {
		return this.dataService.getWiFiSsid();
	}

	getPassword() {
		return this.dataService.getWiFiPassword();
	}

	save() {
		this.dataService.saveWiFiSettings(this.ssid, this.password);
	}
}
