'use client';
import { useState } from 'react';
import axios from 'axios';
import { authStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CoverLetterPage() {
	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);

	const generate = async () => {
		if (!prompt.trim()) return;
		setLoading(true);
		try {
			const token = authStore.getState().accessToken;
			const res = await axios.post(`${API_BASE_URL}/ai/generate-cover-letter`, { prompt }, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
				withCredentials: true,
			});
			setResult(res.data.data.text || '');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-10">
			<h1 className="text-2xl font-bold mb-4">Cover Letter Generator</h1>
			<textarea className="w-full border rounded p-2 h-40" placeholder="Describe the role, company, and tone"
				value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
			<button className="mt-4 bg-black text-white px-4 py-2 rounded" onClick={generate} disabled={loading}>
				{loading ? 'Generating…' : 'Generate'}
			</button>
			{result && (
				<div className="mt-6 border rounded p-4 whitespace-pre-wrap">{result}</div>
			)}
		</div>
	);
}
