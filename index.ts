import * as os from 'os';
import * as util from 'util';
import * as fs from 'fs';

import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';
import * as httpm from '@actions/http-client'


interface Result{
	id: number,
    tag_name:string,
    update_url: string,
    update_authenticity_token: string,
    delete_url:string,
    delete_authenticity_token: string,
    edit_url:string
}

function downloadUrl(version:string):string {
	switch (os.type()) {
		case 'Linux':
			return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_linux_amd64', version, version);

		case 'Darwin':
			return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_darwin_amd64', version, version);

		case 'Windows_NT':
		default:
			return util.format('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/download/v%s/aws-iam-authenticator_%s_windows_amd64.exe', version, version);

	}
}


async function getLatestVersion():Promise<string>{

	const httpClient : httpm.HttpClient = new httpm.HttpClient()

	const response  = await httpClient.getJson('https://github.com/kubernetes-sigs/aws-iam-authenticator/releases/latest', {
		headers: {
			'Accept': 'application/json'
		}
	})

	return (response.result as Result).tag_name.slice(1)
}
const binaryName = 'aws-iam-authenticator'

async function run() {
	let version = core.getInput('version', {
		'required': true
	});

	if (version === "latest"){
		// get the latest version 
		version = await getLatestVersion()
	}else if (version.startsWith("v")){
		// added just incase someone forgets to remove the v from the version number
		version = version.slice(1)
	}

	let cachedToolpath = toolCache.find(binaryName, version);
	if (!cachedToolpath) {
		const downloadPath = await toolCache.downloadTool(downloadUrl(version));
		fs.chmodSync(downloadPath, '0755');
		cachedToolpath = await toolCache.cacheFile(downloadPath, binaryName, binaryName, version)
	}

	core.addPath(cachedToolpath)
}

run().then(()=>{core.setOutput("status","Yay :D. It worked. It better now.")}).catch(core.setFailed);