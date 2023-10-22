import Excel from 'exceljs';

export async function exportExcel(scheduleData: Subjects) {
	console.log('🚀 ~ file: xlsx.ts:4 ~ scheduleData:', scheduleData);
	const workbook = new Excel.Workbook();

	workbook.created = new Date();
	workbook.modified = new Date();
	const sheet = workbook.addWorksheet('TKB');
	if (!scheduleData.subjects || scheduleData.subjects.length == 0) {
		throw new Error('Invalid schedule data');
	}
	sheet.columns = [
		{ header: 'Tiết', key: 'stt', width: 5 },
		{ header: 'Giờ học', key: 'time', width: 10 },
		{ header: 'Thứ 2', key: 'mon', width: 30 },
		{ header: 'Thứ 3', key: 'tue', width: 30 },
		{ header: 'Thứ 4', key: 'wed', width: 30 },
		{ header: 'Thứ 5', key: 'thu', width: 30 },
		{ header: 'Thứ 6', key: 'fri', width: 30 },
		{ header: 'Thứ 7', key: 'sat', width: 30 }
	];

	const sideRows = [
		[1, '7h - 7h50'],
		[2, '8h - 8h50'],
		[3, '9h - 9h50'],
		[4, '10h - 10h50'],
		[5, '11h - 11h50'],
		[6, '12h - 12h50'],
		[7, '13h - 13h50'],
		[8, '14h - 14h50'],
		[9, '15h - 15h50'],
		[10, '16h - 16h50'],
		[11, '17h - 17h50'],
		[12, '18h - 18h50']
	];
	sheet.addRows(sideRows);

	const NUMBER_OF_ROWS = 13;
	for (let i = 0; i <= NUMBER_OF_ROWS; i++) {
		sheet.getRow(i).height = 30;
	}

	for (let i = 0; i < scheduleData.subjects.length; i++) {
		const subject = scheduleData.subjects[i];
		if (!subject.from_lesson || !subject.to_lesson || !subject.day) {
			continue;
		}

		const rowStart = sheet.getRow(subject.from_lesson + 1);
		const rowEnd = sheet.getRow(subject.to_lesson + 1);
		const column = subject.day + 1;
		rowStart.getCell(column).value = generateCellContent(subject);
		rowStart.getCell(column).style = { alignment: { wrapText: true } };
		rowStart.getCell(column).alignment = { vertical: 'middle', horizontal: 'center' };
		sheet.mergeCells(rowStart.number, column, rowEnd.number, column);
	}

	const buffer = await workbook.xlsx.writeBuffer();
	return buffer;
}

function generateCellContent(subject: Subject) {
	const name = subject.name;
	const class_code = subject.class_code;
	const room = subject.room;

	const value = {
		richText: [
			{ text: `${name} \n ` },
			{ text: `${class_code} \n ` },
			{ text: `${room}`, font: { bold: true } }
		]
	};

	return value;
}
