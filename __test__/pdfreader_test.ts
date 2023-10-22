import { readFileSync, writeFile } from 'fs';
import fs from 'fs';
import pdf from 'pdf-extraction';

/**
 * @name pdf2json
 */
// const pdfParser = new PDFParser();

// // pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on('pdfParser_dataReady', (pdfData) => {
// 	fs.writeFile('tmp/tmp.json', JSON.stringify(pdfData), () => {});
// });

// pdfParser.loadPDF('static/test_landscape_DQD.pdf');

/**
 * @name pdf-extraction
 */
function render_page(pageData: any) {
	//check documents https://mozilla.github.io/pdf.js/
	let render_options = {
		//replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: false,
		//do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false
	};

	return pageData.getTextContent(render_options).then(function (textContent: any) {
		let lastY,
			text = '';
		for (let item of textContent.items) {
			if (lastY == item.transform[5] || !lastY) {
				text += item.str + ' | ';
			} else {
				text += '\n' + item.str;
			}
			lastY = item.transform[5];
		}
		return text;
	});
}

let dataBuffer = readFileSync('static/test_landscape.pdf');
console.log('🚀 ~ file: pdfreader_test.ts:48 ~ dataBuffer:', dataBuffer);
pdf(dataBuffer, { pagerender: render_page }).then(function (data: any) {
	console.log(data.text);
});

/**
 * @name pdf.js-extract
 */
// const pdfExtract = new PDFExtract();
// const options: PDFExtractOptions = {
// 	normalizeWhitespace: true
// };

// pdfExtract
// 	.extract('static/test_landscape.pdf', options)
// 	.then((data) => {
// 		// console.log(data.pages);
// 		writeFile('tmp/test.txt', JSON.stringify(data.pages[0]), (err) => {
// 			if (err) console.log(err);
// 			console.log('Writen!');
// 		});
// 		const contentArray = transformDataToArray(data.pages[0].content);
// 		console.log('🚀 ~ file: pdfreader.ts:18 ~ contentArray:', contentArray);
// 	})
// 	.catch((err) => console.log(err));
