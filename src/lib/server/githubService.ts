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
	await createBranch(branchName);
	await uploadDsdkData(branchName, data.content);

	const PRdata = {
		title: data.title,
		body: data.body,
		head: `${repoOwner}:${branchName}`,
		base: 'main'
	};
	const response = await fetch(`${api_url}/pulls`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
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
		method: 'GET'
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
	console.log('🚀 ~ file: create-issue.ts:81 ~ newBranch:', newBranch);
}

async function uploadDsdkData(branchName: string, content: string) {
	// const jsonFile = readFileSync('static/DSDK/subject_formated_2.json').toString('base64');
	const createDate = new Date().getTime();
	const uploadPath = `static/UET/dsdk-[${createDate}].json`;

	const upload = await fetch(`${api_url}/contents/${uploadPath}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			message: 'Create file',
			content: content,
			branch: branchName
		})
	});

	if (upload.status === 201) {
		const file = await upload.json();
		console.log(`Created file`, file, file.download_url);
	} else {
		console.error('Failed to create file');
	}
}

export async function getLastDsdkFile() {
	const dirDsdk = 'static/DSDK';
	const infoResponse = await fetch(`${api_url}/contents/${dirDsdk}`, {
		method: 'GET',
		headers
	});

	const fileInfos: any[] = await infoResponse.json();
	fileInfos.sort((f1, f2) => {
		const timeF1 = parseInt(f1.name.match(/\d+/)?.[0]);
		const timeF2 = parseInt(f2.name.match(/\d+/)?.[0]);
		return timeF2 - timeF1;
	});

	const lastestDSDK = fileInfos[0].download_url;

	const content = await fetch(lastestDSDK, {
		method: 'GET'
	});

	return await content.json();
}
