'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/auth';

type Plan = {
	id: string;
	name: string;
	price: number;
	period: 'month' | 'year' | 'forever';
	credits: number;
	features: string[];
};

export default function PricingPage() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [subscribing, setSubscribing] = useState(false);

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const response = await apiClient.get('/payment/plans');
				setPlans(response.data.data.plans);
			} catch (error) {
				console.error('Failed to fetch plans:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchPlans();
	}, []);

	const handleSubscribe = async (planId: string) => {
		if (planId === 'free') return;
		setSubscribing(true);
		try {
			const response = await apiClient.post('/payment/subscribe', { planId });
			window.location.href = `/checkout?clientSecret=${response.data.data.clientSecret}`;
		} catch (error) {
			console.error('Subscription error:', error);
			alert('Failed to start subscription');
		} finally {
			setSubscribing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
					<p className="text-xl text-gray-600">Choose the perfect plan to power your resume building journey</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-12">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
								plan.id === 'pro' ? 'ring-2 ring-blue-600 scale-105' : ''
							}`}
						>
							{plan.id === 'pro' && (
								<div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
									Most Popular
								</div>
							)}

							<div className="p-8">
								<h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
								<div className="mb-6">
									<span className="text-3xl font-bold text-gray-900">
										{plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)}`}
									</span>
									{plan.period !== 'forever' && <span className="text-gray-600 ml-2">/{plan.period}</span>}
								</div>

								<div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg mb-6">
									<span className="text-2xl font-bold text-blue-600">{plan.credits.toLocaleString()}</span>
									<span className="text-gray-600">AI Credits</span>
								</div>

								<ul className="space-y-4 mb-8">
									{plan.features.map((feature, idx) => (
										<li key={idx} className="flex items-start gap-3">
											<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
											<span className="text-gray-700">{feature}</span>
										</li>
									))}
								</ul>

								<Button
									onClick={() => handleSubscribe(plan.id)}
									disabled={subscribing || plan.id === 'free'}
									className={`w-full ${
										plan.id === 'free'
											? 'bg-gray-300 text-gray-700 cursor-default'
											: plan.id === 'pro'
											? 'bg-blue-600 hover:bg-blue-700'
											: 'bg-indigo-600 hover:bg-indigo-700'
									}`}
								>
									{subscribing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
									{plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
