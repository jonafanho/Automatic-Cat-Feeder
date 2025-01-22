import {Component} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatTimepickerModule} from "@angular/material/timepicker";
import {DataService} from "../../service/data.service";
import {MatIconModule} from "@angular/material/icon";

@Component({
	selector: "app-schedule-card",
	imports: [
		MatCardModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatTimepickerModule,
		FormsModule,
	],
	templateUrl: "./schedule-card.component.html",
	styleUrls: ["./schedule-card.component.css"],
})
export class ScheduleCardComponent {
	protected value?: Date;

	constructor(private readonly dataService: DataService) {
	}

	getSchedule() {
		return this.dataService.getSchedule();
	}

	add() {
		if (!this.isInvalidDate() && this.value) {
			this.dataService.addSchedule(this.value.getUTCHours(), this.value.getUTCMinutes(), this.value.getUTCSeconds());
		}
	}

	remove(schedule: Date) {
		this.dataService.removeSchedule(schedule.getUTCHours(), schedule.getUTCMinutes(), schedule.getUTCSeconds());
	}

	isInvalidDate() {
		return !this.value || isNaN(this.value.getMilliseconds());
	}
}
