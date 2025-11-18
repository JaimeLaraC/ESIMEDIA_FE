import axios from 'axios';
// Para frontend, usamos File y FormData nativos

const VT_UPLOAD_URL = 'https://www.virustotal.com/api/v3/files';
const VT_ANALYSIS_URL = 'https://www.virustotal.com/api/v3/analyses';

export interface VirusTotalReport {
	status: string;
	stats?: {
		malicious: number;
		suspicious: number;
		harmless: number;
		undetected: number;
	};
}

export async function uploadFileToVirusTotal(file: File, apiKey: string): Promise<string> {
	const formData = new FormData();
	formData.append('file', file);

	const response = await axios.post(VT_UPLOAD_URL, formData, {
		headers: {
			'x-apikey': apiKey,
			// FormData headers are handled automatically in browser
		},
	});
	// Devuelve el ID del análisis
	return response.data.data.id;
}

export async function getVirusTotalReport(analysisId: string, apiKey: string): Promise<VirusTotalReport> {
	const url = `${VT_ANALYSIS_URL}/${analysisId}`;
	const response = await axios.get(url, {
		headers: { 'x-apikey': apiKey },
	});
	const data = response.data.data;
	const status = data.attributes.status;
	let stats;
	if (data.attributes.results) {
		stats = data.attributes.stats;
	}
	return { status, stats };
}
