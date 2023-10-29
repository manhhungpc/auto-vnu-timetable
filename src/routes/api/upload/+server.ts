import { extractPDF } from '$lib/pdfreader';
import { errorMsg } from 'src/utils/error-msg';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { mergeDsdkData, asyncHandle } from '$lib/helper';

export const POST: RequestHandler = async ({ request }) => {
	let response: any;
	try {
		const formData = await request.formData();
		const pdfFile = formData.get('pdfFile') as Blob;
		const pdfBuffer = await pdfFile.arrayBuffer();

		const pdfData = await extractPDF(Buffer.from(pdfBuffer));
		const EXPECT_WIDTH = 841.91998,
			EXPECT_HEIGHT = 594.95996;

		if (pdfData.info.width != EXPECT_WIDTH || pdfData.info.height != EXPECT_HEIGHT) {
			return json({
				status: 400,
				err: errorMsg.WRONG_LAYOUT
			});
		}

		const tableHeader = pdfData.content[10][0];
		if (tableHeader != 'STT') {
			return json({
				status: 400,
				err: errorMsg.MISSING_HEADER_FOOTER
			});
		}

		let subjects: Subjects = { total: 0, subjects: [] };
		let subjectRow = 11,
			total = 0;

		// If the first column of a row is NOT a number (hàng không có cột STT), we will assume it end of data contain subjects
		while (!isNaN(pdfData.content[subjectRow][0])) {
			total++;
			const content: string[] = pdfData.content[subjectRow];
			const room = content.pop()?.trim() as string;
			const time_lesson = content.pop() as string;
			const day = content.pop() as string;
			const class_code = content.pop()?.trim() as string;
			let name = content[2],
				i_name = 3;

			// Looping to get the subject name
			// If encounter a number (meet the "Số tín chỉ" column) then break, we got the subject name
			// @ts-ignore
			while (isNaN(content[i_name])) {
				name += content[i_name];
				i_name++;
			}

			let subject: Subject = {
				name: name.trim(),
				room: room,
				class_code: class_code,
				day: Number(day?.slice(1)),
				from_lesson: Number(time_lesson?.split('-')[0]),
				to_lesson: Number(time_lesson?.split('-')[1])
			};

			if (
				typeof subject.day != 'number' ||
				typeof subject.from_lesson != 'number' ||
				typeof subject.to_lesson != 'number' ||
				subject.from_lesson == 0 ||
				subject.to_lesson == 0
			) {
				return json({
					status: 400,
					err: errorMsg.PROCESS_FAILED
				});
			}

			subjects.subjects.push(subject);
			subjectRow++;
		}

		const fullData = await asyncHandle(mergeDsdkData, subjects.subjects);
		subjects.subjects = fullData;

		subjects.total = total;
		response = { status: 200, data: subjects };
	} catch (err: any) {
		console.log(err);
		response = { status: 400, err: err.toString() };
	}

	return json(response);
};
