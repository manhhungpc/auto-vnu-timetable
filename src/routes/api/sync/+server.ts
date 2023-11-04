import { errorMsg } from 'src/utils/error-msg';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';
import { extractHTMLContent } from '$lib/sync-dsdk';
import { createPRs, getLastPulls, lastSyncAt } from '$lib/server/githubService';
import { syncStatus } from '$lib/helper';

export const GET: RequestHandler = async () => {
	try {
		const { updated_at } = await lastSyncAt();
		const sync_status = syncStatus(updated_at);
		const pulls: any[] = await getLastPulls();

		let lastPullDate: string;
		if (pulls.length == 0) {
			lastPullDate = 'Không có';
		} else {
			lastPullDate = new Date(pulls[0]?.updated_at).toLocaleDateString('vi');
		}
		return json({
			status: 201,
			data: { updated_at, sync_status, lastPullDate }
		});
	} catch (err) {
		console.log('🚀 ~ file: +server.ts:25 ~ err:', err);
		return json({
			status: 500,
			err: 'Server error!'
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
		const createDate = new Date().toLocaleDateString('vi');
		const pullReq = await createPRs(`sync-dsdk-${crypto.randomUUID().split('-')[0]}`, {
			title: `[sync] ${title}`,
			body: description + `\nCreated_at: ${createDate}`,
			content: JSON.stringify(dsdkData)
		});
		console.log('🚀 ~ file: +server.ts:44 ~ pullReq:', pullReq);

		if (pullReq.err) {
			return json({
				status: 503,
				err: 'Failed to created!'
			});
		}

		return json({
			status: 201,
			data: 'Successfully created!'
		});
	} catch (err) {
		return json({
			status: 500,
			err: 'Server error!'
		});
	}
};
