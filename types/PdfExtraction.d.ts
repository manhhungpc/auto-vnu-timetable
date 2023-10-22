declare module 'pdf-extraction' {
	async function PDF(
		dataBuffer: string | Buffer,
		options: {
			pagerender?: (any) => {};
			max?: number;
			version?: string;
		}
	);

	export default PDF;
}
