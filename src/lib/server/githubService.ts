// import dotenv from 'dotenv';
// dotenv.config();
// import {} from "dotenv"
import { GITUB_PAT, REPO_NAME } from '$env/static/private';
const repoOwner = 'manhhungpc';
const repoName = REPO_NAME;
const token = GITUB_PAT;

const api_url = `https://api.github.com/repos/${repoOwner}/${repoName}`;
const headers = {
	'X-GitHub-Api-Version': '2022-11-28',
	Authorization: `Bearer ${token}`
};

interface PullRequest {
	title: string;
	body: string;
	content: string;
}

export async function createPRs(branchName: string, data: PullRequest) {
	const branch = await createBranch(branchName);
	const dsdkData = await uploadDsdkData(branchName, data.content);

	if (!dsdkData) {
		return {
			err: 'Có lỗi khi xử lý danh sách đăng ký học'
		};
	}

	const PRdata = {
		title: data.title,
		body: data.body,
		head: `${repoOwner}:${branchName}`,
		base: 'main'
	};
	console.log('🚀 ~ file: githubService.ts:31 ~ PRdata:', PRdata);
	const response = await fetch(`${api_url}/pulls`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/vnd.github+json'
		},
		body: JSON.stringify(PRdata)
	});

	console.log(response.status);

	if (response.status === 201) {
		const pullReq = await response.json();
		return pullReq;
	} else {
		console.error('Failed to create GitHub pulls');
		return false;
	}
}

async function createBranch(name: string) {
	const baseBranch = await fetch(`${api_url}/git/refs/heads/main`, {
		method: 'GET',
		headers
	});
	const shaBase = (await baseBranch.json()).object.sha;

	const newBranchData = {
		ref: `refs/heads/${name}`,
		sha: shaBase
	};
	const response = await fetch(`${api_url}/git/refs`, {
		method: 'POST',
		headers,
		body: JSON.stringify(newBranchData)
	});

	const newBranch = await response.json();
	console.log(response.status);
}

async function uploadDsdkData(branchName: string, content: string) {
	const createDate = new Date().getTime();
	const uploadPath = `static/DSDK/dsdk-[${createDate}].json`;

	try {
		const upload = await fetch(`${api_url}/contents/${uploadPath}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				message: `Update dsdk at ${new Date().toLocaleDateString('vi')}`,
				content: Buffer.from(content).toString('base64'),
				branch: branchName
			})
		});

		const response = await upload.json();
		if (upload.status === 201) {
			console.log(`Created file`, response, response.download_url);
			return true;
		} else {
			console.log('Error: ', response);
			return false;
		}
	} catch (err) {
		console.error('Failed to create file', err);
	}
}

export async function getLastDsdkFile() {
	const dirDsdk = 'static/dsdk_data/UET';
	const infoResponse = await fetch(`${api_url}/contents/${encodeURIComponent(dirDsdk)}`, {
		method: 'GET',
		headers
	});

	const fileInfos: any[] = await infoResponse.json();
	fileInfos.sort((f1, f2) => {
		const timeF1 = parseInt(f1.name?.match(/\d+/)?.[0]);
		const timeF2 = parseInt(f2.name?.match(/\d+/)?.[0]);
		if (!timeF1 || !timeF2) return f2 - f1;
		return timeF2 - timeF1;
	});

	const dateFileRegex = new RegExp(/\[(\d+)\]/);
	const updateAt = fileInfos[0].name.match(dateFileRegex)?.[0].slice(1, -1);
	const lastestDSDK = fileInfos[0].download_url;

	const content = await fetch(lastestDSDK, {
		method: 'GET',
		headers
	});

	return {
		update_at: updateAt,
		data: await content.json()
	};
}

export async function getLastPulls() {
	const response = await fetch(`${api_url}/pulls`, {
		method: 'GET',
		headers
	});

	if (response.status === 200) {
		const pullReqs = await response.json();
		return pullReqs;
	} else {
		console.error('Failed to get pulls');
		return false;
	}
}

export async function lastSyncAt() {
	const dirDsdk = 'static/DSDK';
	const sync = await fetch(`${api_url}/commits?path=${encodeURIComponent(dirDsdk)}`, {
		method: 'GET',
		headers
	});

	const response = await sync.json();
	const lastSync = response[0];
	const updated_at = lastSync?.commit.author.date;

	return {
		updated_at
	};
}
