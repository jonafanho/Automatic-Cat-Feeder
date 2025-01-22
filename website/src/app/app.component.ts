import {Component} from "@angular/core";
import {WifiCardComponent} from "./component/wifi-card/wifi-card.component";
import {ScheduleCardComponent} from "./component/schedule-card/schedule-card.component";

@Component({
	selector: "app-root",
	imports: [
		WifiCardComponent,
		ScheduleCardComponent,
	],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {

	constructor() {
	}
}
