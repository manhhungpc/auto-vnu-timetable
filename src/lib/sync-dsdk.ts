// Extract content from http://dangkyhoc.vnu.edu.vn/ html file

import { writeFileSync, readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

export async function extractHTMLContent(htmlContent: string) {
	const doc = new JSDOM(htmlContent, { contentType: 'text/html' });
	const table = doc.window.document.getElementById('divDSDK')?.querySelector('tbody');

	if (!table) {
		throw new Error('Invalid file');
	}

	const dsdkData: Subject[] = [];

	for (let row of table?.rows) {
		const subjectName = row.cells[1].textContent?.trim().replace(/\s+/g, ' ') || '';
		const class_code = row.cells[4].textContent?.trim().replace(/\s+/g, ' ') || '';
		const lecturer = row.cells[7].textContent?.trim() || '';
		const schedule = row.cells[9].textContent?.trim() || '';

		// Nếu có dấu "," ngăn cách tên giảng viên -> Là lớp TH và LT gộp lại
		const TH_lecturer = lecturer ? lecturer.split(',')[1] : null;
		if (TH_lecturer) {
			const THclass = schedule.split(',')[1] ? schedule.split(',')[1] : schedule;
			const data = getTimeSchedule(THclass);
			dsdkData.push({
				class_code,
				name: subjectName,
				lecturer,
				...data
			});
		}

		// Process both normal class and THclass
		const data = getTimeSchedule(schedule?.split(',')[0]);
		dsdkData.push({
			class_code,
			name: subjectName,
			lecturer,
			...data
		});
	}

	// writeFileSync('static/DSDK/sync-dsdk-1.json', JSON.stringify(dsdkData));
	return dsdkData;
}

function getTimeSchedule(schedule: string) {
	let day, from, to, room;
	const scheduleData = schedule.split(/\(([^)]+)\)/);

	// Nếu có dấu "," ngăn cách các lớp -> Là lớp TH và LT gộp lại

	day = Number(scheduleData[0].substring(1, 2));
	from = Number(scheduleData[1].split('-')[0]);
	to = Number(scheduleData[1].split('-')[1]);
	room = scheduleData[2].substring(1);
	return {
		room,
		day: day,
		from_lesson: from,
		to_lesson: to
	};
}
