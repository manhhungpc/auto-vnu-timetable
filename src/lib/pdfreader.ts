import { writeFileSync } from 'fs';
import pdf from 'pdf-extraction';
import { rawDataToArray } from './helper';

async function render_page(pageData: any) {
	//check documents https://mozilla.github.io/pdf.js/
	let render_options = {
		normalizeWhitespace: true,
		disableCombineTextItems: false
	};
	const height = pageData.pageInfo.view[3] as number;
	const width = pageData.pageInfo.view[2] as number;
	let formatData: PDFData = {
		info: {
			width,
			height
		},
		content: []
	};
	return pageData.getTextContent(render_options).then(function (textContent: any) {
		for (let item of textContent.items) {
			let x = item.transform[4];
			let y = height - item.transform[5];
			const pdfText: PDFText = {
				x: x,
				y: y,
				str: item.str,
				height: item.height,
				width: item.width
			};
			formatData.content.push(pdfText);
			// lastY = item.transform[5];
		}
		return JSON.stringify(formatData);
	});
}

export async function extractPDF(buffer: Buffer): Promise<PDFData> {
	return new Promise((resolve, reject) => {
		pdf(buffer, { pagerender: render_page })
			.then(function (data: any) {
				const extractData = JSON.parse(data.text);
				const transform = rawDataToArray(extractData.content);
				resolve({
					info: extractData.info,
					content: transform
				});
			})
			.catch((err: Error) => reject(err));
	});
}
