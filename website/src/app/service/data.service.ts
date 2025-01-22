import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: "root"})
export class DataService {
	private readonly data: { wiFiSsid: string, wiFiPassword: string, schedule: Date[] } = {wiFiSsid: "", wiFiPassword: "", schedule: []};

	constructor(private readonly httpClient: HttpClient) {
		httpClient.get<{ wiFiSsid?: string, wiFiPassword?: string, customScheduler?: { time?: number, channel?: number }[] }>("api/read-settings").subscribe(data => this.setData(data));
	}

	public getWiFiSsid() {
		return this.data.wiFiSsid;
	}

	public getWiFiPassword() {
		return this.data.wiFiPassword;
	}

	public getSchedule() {
		return this.data.schedule;
	}

	public saveWiFiSettings(ssid: string, password: string) {
		this.httpClient.post<{ wiFiSsid?: string, wiFiPassword?: string, customScheduler?: { time?: number, channel?: number }[] }>("api/write-settings", {wiFiSsid: ssid, wiFiPassword: password}).subscribe(data => this.setData(data));
	}

	public addSchedule(hour: number, minute: number, second: number) {
		this.httpClient.get<{ wiFiSsid?: string, wiFiPassword?: string, customScheduler?: { time?: number, channel?: number }[] }>(`api/add-schedule?hour=${hour}&minute=${minute}&second=${second}&channel=1`).subscribe(data => this.setData(data));
	}

	public removeSchedule(hour: number, minute: number, second: number) {
		this.httpClient.get<{ wiFiSsid?: string, wiFiPassword?: string, customScheduler?: { time?: number, channel?: number }[] }>(`api/remove-schedule?hour=${hour}&minute=${minute}&second=${second}&channel=1`).subscribe(data => this.setData(data));
	}

	private setData(data: { wiFiSsid?: string, wiFiPassword?: string, customScheduler?: { time?: number, channel?: number }[] }) {
		this.data.wiFiSsid = data.wiFiSsid ?? "";
		this.data.wiFiPassword = data.wiFiPassword ?? "";
		this.data.schedule.length = 0;
		if (data.customScheduler) {
			data.customScheduler.forEach(({time}) => {
				if (time !== undefined) {
					this.data.schedule.push(new Date(time));
				}
			});
			this.data.schedule.sort();
		}
	}
}
