'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Crown, Rocket, Loader2, Sparkles } from 'lucide-react';
import apiClient from '@/lib/api/auth';
import Link from 'next/link';
import { authStore } from '@/stores/authStore';

type Plan = {
	id: string;
	name: string;
	price: number;
	period: 'month' | 'year' | 'forever';
	credits: number;
	features: string[];
	limitations?: string[];
	popular?: boolean;
};

export default function PricingPage() {
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [subscribing, setSubscribing] = useState(false);
	const { user } = authStore();

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const response = await apiClient.get('/payments/plans');
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
		
		if (!user) {
			window.location.href = '/register';
			return;
		}

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

	const getPlanIcon = (planId: string) => {
		switch (planId) {
			case 'free':
				return <Zap className="w-6 h-6" />;
			case 'pro':
				return <Crown className="w-6 h-6" />;
			case 'enterprise':
				return <Rocket className="w-6 h-6" />;
			default:
				return <Sparkles className="w-6 h-6" />;
		}
	};

	const getPlanColor = (planId: string) => {
		switch (planId) {
			case 'free':
				return {
					bg: 'from-gray-500 to-gray-600',
					text: 'text-gray-600',
					badge: 'bg-gray-100 text-gray-700',
					border: 'border-gray-200',
				};
			case 'pro':
				return {
					bg: 'from-blue-500 to-indigo-600',
					text: 'text-blue-600',
					badge: 'bg-blue-100 text-blue-700',
					border: 'border-blue-500',
				};
			case 'enterprise':
				return {
					bg: 'from-purple-500 to-pink-600',
					text: 'text-purple-600',
					badge: 'bg-purple-100 text-purple-700',
					border: 'border-purple-500',
				};
			default:
				return {
					bg: 'from-gray-500 to-gray-600',
					text: 'text-gray-600',
					badge: 'bg-gray-100 text-gray-700',
					border: 'border-gray-200',
				};
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
					<p className="text-gray-600">Loading pricing plans...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
						<Sparkles className="w-4 h-4" />
						<span>Simple & Transparent Pricing</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
						Choose Your Perfect Plan
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Start free and upgrade anytime. All plans include our core features with no hidden fees.
					</p>
				</div>

				{/* Pricing Cards */}
				<div className="grid md:grid-cols-3 gap-8 mb-16">
					{plans.map((plan) => {
						const colors = getPlanColor(plan.id);
						const isPopular = plan.popular;

						return (
							<div
								key={plan.id}
								className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
									isPopular ? `ring-4 ${colors.border} scale-105` : ''
								}`}
							>
								{/* Popular Badge */}
								{isPopular && (
									<div className={`absolute top-0 right-0 bg-gradient-to-r ${colors.bg} text-white px-6 py-2 rounded-bl-2xl text-sm font-bold shadow-lg flex items-center gap-2`}>
										<Crown className="w-4 h-4" />
										Most Popular
									</div>
								)}

								<div className="p-8">
									{/* Plan Icon & Name */}
									<div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white mb-4 shadow-lg`}>
										{getPlanIcon(plan.id)}
									</div>
									<h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
									
									{/* Price */}
									<div className="mb-6">
										<div className="flex items-baseline">
											<span className="text-5xl font-bold text-gray-900">
												{plan.price === 0 ? '$0' : `$${plan.price.toFixed(0)}`}
											</span>
											{plan.period !== 'forever' && (
												<span className="text-gray-500 ml-2 text-lg">/{plan.period}</span>
											)}
										</div>
										{plan.price === 0 && (
											<p className="text-gray-500 text-sm mt-1">Forever free</p>
										)}
									</div>

									{/* AI Credits Badge */}
									<div className={`flex items-center justify-center gap-2 px-4 py-3 ${colors.badge} rounded-xl mb-6`}>
										<Sparkles className={`w-5 h-5 ${colors.text}`} />
										<span className={`font-bold ${colors.text} text-lg`}>
											{plan.credits.toLocaleString()}
										</span>
										<span className="text-gray-600 text-sm">AI Credits/mo</span>
									</div>

									{/* Features */}
									<ul className="space-y-3 mb-8">
										{plan.features.map((feature, idx) => (
											<li key={idx} className="flex items-start gap-3">
												<div className="flex-shrink-0 mt-0.5">
													<div className={`w-5 h-5 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
														<Check className="w-3 h-3 text-white" />
													</div>
												</div>
												<span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
											</li>
										))}
										
										{/* Limitations */}
										{plan.limitations && plan.limitations.length > 0 && (
											<>
												<li className="pt-3 border-t border-gray-200" />
												{plan.limitations.map((limitation, idx) => (
													<li key={`limit-${idx}`} className="flex items-start gap-3 opacity-60">
														<X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
														<span className="text-gray-500 text-sm leading-relaxed">{limitation}</span>
													</li>
												))}
											</>
										)}
									</ul>

									{/* CTA Button */}
									<Button
										onClick={() => handleSubscribe(plan.id)}
										disabled={subscribing}
										className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 ${
											plan.id === 'free'
												? 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-default'
												: isPopular
												? `bg-gradient-to-r ${colors.bg} text-white hover:shadow-lg hover:scale-105`
												: 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
										}`}
									>
										{subscribing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
										{plan.id === 'free' ? 'Get Started Free' : `Upgrade to ${plan.name}`}
									</Button>
								</div>
							</div>
						);
					})}
				</div>

				{/* FAQ / Additional Info */}
				<div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
					<div className="space-y-6">
						<FAQItem
							question="What are AI Credits?"
							answer="AI Credits are used for AI-powered features like content enhancement, resume tailoring, cover letter generation, and ATS optimization. Each operation costs a certain number of credits."
						/>
						<FAQItem
							question="Can I cancel anytime?"
							answer="Yes! You can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period."
						/>
						<FAQItem
							question="What happens to my data if I downgrade?"
							answer="All your resumes and profile data are always yours. If you downgrade, you'll retain access to your data but with Free plan limitations."
						/>
						<FAQItem
							question="Do you offer refunds?"
							answer="We offer a 14-day money-back guarantee. If you're not satisfied within the first 14 days, contact us for a full refund."
						/>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-16">
					<p className="text-gray-600 mb-4">Still have questions?</p>
					<Link href="/contact" className="text-blue-600 font-semibold hover:text-blue-700">
						Contact our support team →
					</Link>
				</div>
			</div>
		</div>
	);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
	return (
		<div className="border-b border-gray-200 pb-6 last:border-0">
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
			<p className="text-gray-600 leading-relaxed">{answer}</p>
		</div>
	);
}
