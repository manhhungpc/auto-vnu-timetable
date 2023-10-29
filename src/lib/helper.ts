import { readFileSync } from 'fs';
import { getLastDsdkFile } from './server/githubService';

export enum SyncStatus {
	UNKNOW = '0',
	GOOD = '1',
	NORMAL = '2',
	BAD = '3'
}

export function readerBuffer(file: any) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = async () => {
			try {
				const buffer = reader.result;
				resolve(buffer);
			} catch (err) {
				reject(err);
			}
		};
		reader.onerror = (error) => {
			reject(error);
		};
		reader.readAsArrayBuffer(file);
	});
}

export function rawDataToArray(contentJson: PDFText[]): string[][] {
	let currentY = contentJson[0].y;
	const contentArray = [];
	let row: string[] = [];
	row.push(contentJson[0].str);
	for (let i = 1; i < contentJson.length; i++) {
		const textInfo = contentJson[i];
		if (textInfo.y !== currentY) {
			contentArray.push(row);
			row = [];
			currentY = textInfo.y;
		}

		if (textInfo.str == '' || textInfo.str == ' ') {
			continue;
		}
		row.push(textInfo.str);
	}
	return contentArray;
}

export async function mergeDsdkData(schedules: Subject[]) {
	const dsdk: Subject[] = (await getLastDsdkFile()).data;
	let data: any[] = [];
	console.log(schedules);
	for (let schedule of schedules) {
		const regex = new RegExp(`^${schedule.class_code}.*`);
		const classDsdk = dsdk.filter((c) => {
			return regex.test(c.class_code);
		});
		console.log('🚀 ~ file: helper.ts:58 ~ classDsdk:', classDsdk);

		if (classDsdk.length == 0) {
			data = data.concat(schedule);
			continue;
		}

		if (classDsdk.length == 1) {
			schedule.lecturer = classDsdk[0].lecturer;
			data = data.concat(classDsdk);
		} else {
			const classTH = classDsdk.find((cl) => {
				return (
					cl.day == schedule.day &&
					cl.from_lesson == schedule.from_lesson &&
					cl.to_lesson == schedule.to_lesson
				);
			});

			const classLT = classDsdk.find((cl) =>
				cl.class_code.match(new RegExp(`^${schedule.class_code}.*\(LT\)`))
			);
			data.push(classLT, classTH);
			console.log('🚀 ~ file: helper.ts:80 ~ classTH:', classTH);
			console.log('🚀 ~ file: helper.ts:80 ~ classLT:', classLT);
		}
	}

	return data;
}

export function syncStatus(lastSync: string) {
	const currentDate = new Date().getTime();
	const lastSyncDate = new Date(lastSync).getTime();

	const diffTime = Math.abs(currentDate - lastSyncDate);

	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	let status = SyncStatus.UNKNOW;
	if (diffDays < 30) status = SyncStatus.GOOD;
	else if (diffDays >= 30 && diffDays < 90) status = SyncStatus.NORMAL;
	else if (diffDays >= 90) status = SyncStatus.BAD;

	return status;
}

export function handle(fn: any, ...rest: any) {
	try {
		return fn(...rest);
	} catch (error) {
		throw new Error('Error occur!');
	}
}

export async function asyncHandle(fn: any, ...rest: any) {
	try {
		return await fn(...rest);
	} catch (error) {
		throw new Error('Error occur!');
	}
}
