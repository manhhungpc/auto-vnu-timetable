import { errorMsg } from 'src/utils/error-msg';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { extractHTMLContent } from '$lib/sync-dsdk';
import { createPRs, getLastDsdkFile, lastSyncAt } from '$lib/server/githubService';
import { syncStatus } from '$lib/helper';

export const GET: RequestHandler = async () => {
	try {
		const { updated_at } = await lastSyncAt();
		const sync_status = syncStatus(updated_at);
		return json({
			status: 201,
			data: { updated_at, sync_status }
		});
	} catch (err) {
		return json({
			status: 500,
			data: 'Server error!'
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const dsdk = formData.get('dsdk') as File;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		const dsdkData = await extractHTMLContent(await dsdk.text());
		const createDate = new Date().getTime();
		const pullReq = await createPRs(`dsdk-${createDate}`, {
			title: title,
			body: description,
			content: dsdkData.toString()
		});

		if (!pullReq) {
			return json({
				status: 503,
				data: 'Failed to created!'
			});
		}

		return json({
			status: 201,
			data: 'Successfully created!'
		});
	} catch (err) {
		return json({
			status: 500,
			data: 'Server error!'
		});
	}
};
