import { useState } from "react";
import { Container, Row, Col, Card, Button, Offcanvas, Form, ListGroup } from 'react-bootstrap';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Upgrade = () => {
    const { props } = usePage();
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currency, setCurrency] = useState('NGN');
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: { 
                monthly: { USD: 0, NGN: 0 },
                yearly: { USD: 0, NGN: 0 }
            },
            description: 'Basic access to opportunities',
            icon: 'star',
            features: [
                'Access to basic opportunities',
                'Weekly newsletter',
                'Save up to 10 opportunities',
                'Basic search filters'
            ],
            current: true
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { 
                monthly: { USD: 2.11, NGN: 3000 },
                yearly: { USD: 22.79, NGN: 32400 }
            },
            description: 'Unlock all features',
            icon: 'workspace_premium',
            popular: true,
            features: [
                'Unlimited saved opportunities',
                'Smart reminders via push & email',
                'Google Calendar sync',
                'AI Assistant',
                'Ad-free browsing',
                'Priority access to new opportunities',
                'Export saved items (PDF / CSV)'
            ],
            current: false
        }
    ];

    const formatPrice = (price) => {
        if (price === 0) return 'Free';
        if (currency === 'NGN') {
            return `₦${price.toLocaleString()}`;
        }
        return `$${price.toFixed(2)}`;
    };

    const handleSelectPlan = (plan) => {
        if (plan.id === 'free') return; // Can't select free plan
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            // TODO: Process payment with selected method
            console.log('Processing payment:', {
                plan: selectedPlan,
                method: paymentMethod,
                currency,
                billingPeriod
            });
            
            // Simulate payment processing
            setTimeout(() => {
                setIsProcessing(false);
                alert('Payment feature coming soon!');
            }, 1500);
        } catch (error) {
            console.error('Payment error:', error);
            setIsProcessing(false);
        }
    };

    const paymentMethods = [
        { id: 'paystack', name: 'Paystack', icon: 'credit_card', description: 'Pay with card (Nigeria)' },
        { id: 'flutterwave', name: 'Flutterwave', icon: 'payments', description: 'Card, Bank Transfer, USSD' },
        { id: 'stripe', name: 'Stripe', icon: 'credit_score', description: 'International cards' }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Upgrade to Pro" />
            
            <style>{`
                .plan-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    max-width: 420px;
                    margin: 0 auto;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                }
                
                .plan-card:hover {
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px);
                }
                
                .plan-card.popular {
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                }
                
                .plan-card.current {
                    background: #fafafa;
                    border-color: #e5e7eb;
                }
                
                .popular-tag {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: white;
                    padding: 5px 18px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                }
                
                .plan-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                    font-size: 28px;
                }
                
                .plan-icon.free {
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    color: #6b7280;
                }
                
                .plan-icon.pro {
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    color: #d97706;
                }
                
                .price-amount {
                    font-size: 2.75rem;
                    font-weight: 700;
                    color: #1f2937;
                    line-height: 1;
                }
                
                .price-period {
                    color: #6b7280;
                    font-size: 0.95rem;
                    font-weight: 400;
                }
                
                .feature-list {
                    list-style: none;
                    padding: 0;
                    margin: 1.5rem 0;
                    flex-grow: 1;
                }
                
                .feature-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.6rem 0;
                    color: #374151;
                    font-size: 0.9rem;
                }
                
                .feature-list li .material-symbols-outlined {
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                
                .feature-list li .feature-icon {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0fdf4;
                    color: #16a34a;
                    flex-shrink: 0;
                }
                
                .feature-list li .feature-icon .material-symbols-outlined {
                    font-size: 14px;
                }
                
                .billing-toggle {
                    display: inline-flex;
                    background: #f3f4f6;
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .billing-btn {
                    padding: 0.5rem 1.25rem;
                    border: none;
                    background: transparent;
                    border-radius: 50px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #6b7280;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .billing-btn.active {
                    background: white;
                    color: #1f2937;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                .currency-toggle {
                    display: inline-flex;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50px;
                    padding: 4px;
                }
                
                .currency-btn {
                    padding: 0.375rem 1rem;
                    border: none;
                    background: transparent;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .currency-btn.active {
                    background: white;
                    color: #1f2937;
                }
                
                .payment-method-item {
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 0.75rem;
                }
                
                .payment-method-item:hover {
                    border-color: #374151;
                }
                
                .payment-method-item.selected {
                    border-color: #374151;
                    background: #f9fafb;
                }
                
                .save-badge {
                    background: #dcfce7;
                    color: #166534;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
            `}</style>

            <Container className="py-5">
                <div className="text-center mb-4">
                    <h1 className="fw-bold mb-2">Upgrade to Pro</h1>
                    <p className="text-muted mb-4">Unlock all features and supercharge your opportunity hunting</p>
                    
                    <div className="d-flex justify-content-center gap-3 align-items-center flex-wrap mb-4">
                        <div className="billing-toggle">
                            <button 
                                className={`billing-btn ${currency === 'NGN' ? 'active' : ''}`}
                                onClick={() => setCurrency('NGN')}
                            >
                                🇳🇬 NGN
                            </button>
                            <button 
                                className={`billing-btn ${currency === 'USD' ? 'active' : ''}`}
                                onClick={() => setCurrency('USD')}
                            >
                                🇺🇸 USD
                            </button>
                        </div>
                        
                        <div className="billing-toggle">
                            <button 
                                className={`billing-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                                onClick={() => setBillingPeriod('monthly')}
                            >
                                Monthly
                            </button>
                            <button 
                                className={`billing-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                                onClick={() => setBillingPeriod('yearly')}
                            >
                                Yearly
                                <span className="save-badge">Save 10%</span>
                            </button>
                        </div>
                    </div>
                </div>

                <Row className="justify-content-center g-4">
                    {plans.map((plan) => (
                        <Col key={plan.id} md={5} lg={4}>
                            <div className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.current ? 'current' : ''}`}>
                                {plan.popular && <div className="popular-tag">RECOMMENDED</div>}
                                
                                <div className={`plan-icon ${plan.id}`}>
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {plan.icon}
                                    </span>
                                </div>
                                
                                <h3 className="text-center fw-bold mb-1">{plan.name}</h3>
                                <p className="text-center text-muted mb-3" style={{ fontSize: '0.9rem' }}>{plan.description}</p>
                                
                                <div className="text-center mb-3">
                                    <span className="price-amount">
                                        {formatPrice(plan.price[billingPeriod][currency])}
                                    </span>
                                    {plan.price[billingPeriod][currency] > 0 && (
                                        <span className="price-period">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                                    )}
                                </div>
                                
                                <ul className="feature-list">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <div className="feature-icon">
                                                <span className="material-symbols-outlined">check</span>
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className="mt-auto">
                                    {plan.id === 'free' ? (
                                        <Button 
                                            variant="outline-secondary" 
                                            className="w-100 py-2"
                                            disabled
                                            style={{ borderRadius: '12px', fontWeight: '500' }}
                                        >
                                            <span className="material-symbols-outlined me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>check</span>
                                            Current Plan
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="dark" 
                                            className="w-100 py-2"
                                            style={{ borderRadius: '12px', fontWeight: '500', background: '#1f2937' }}
                                            onClick={() => handleSelectPlan(plan)}
                                        >
                                            <span className="material-symbols-outlined me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>rocket_launch</span>
                                            Upgrade Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Payment Slide-in Panel */}
            <Offcanvas 
                show={showPayment} 
                onHide={() => setShowPayment(false)} 
                placement="start"
                style={{ width: '400px' }}
            >
                <Offcanvas.Header closeButton className="border-bottom">
                    <Offcanvas.Title className="fw-bold">
                        <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>payments</span>
                        Complete Payment
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedPlan && (
                        <>
                            {/* Order Summary */}
                            <div className="bg-light rounded p-3 mb-4">
                                <h6 className="fw-bold mb-3">Order Summary</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Plan</span>
                                    <span className="fw-semibold">{selectedPlan.name}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Billing</span>
                                    <span className="fw-semibold text-capitalize">{billingPeriod}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold" style={{ fontSize: '1.25rem' }}>
                                        {formatPrice(selectedPlan.price[billingPeriod][currency])}
                                        <span className="text-muted fw-normal" style={{ fontSize: '0.8rem' }}>
                                            /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <h6 className="fw-bold mb-3">Select Payment Method</h6>
                            
                            {paymentMethods.map((method) => (
                                <div 
                                    key={method.id}
                                    className={`payment-method-item d-flex align-items-center ${paymentMethod === method.id ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod(method.id)}
                                >
                                    <div className="me-3">
                                        <span 
                                            className="material-symbols-outlined" 
                                            style={{ fontSize: '28px', color: '#374151' }}
                                        >
                                            {method.icon}
                                        </span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{method.name}</div>
                                        <small className="text-muted">{method.description}</small>
                                    </div>
                                    {paymentMethod === method.id && (
                                        <span className="material-symbols-outlined text-success">check_circle</span>
                                    )}
                                </div>
                            ))}

                            {/* Pay Button */}
                            <div className="mt-4">
                                <Button 
                                    variant="dark" 
                                    className="w-100 py-3"
                                    style={{ borderRadius: '10px' }}
                                    onClick={handlePayment}
                                    disabled={!paymentMethod || isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>lock</span>
                                            Pay {formatPrice(selectedPlan.price[billingPeriod][currency])}
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-muted mt-3" style={{ fontSize: '0.8rem' }}>
                                    <span className="material-symbols-outlined me-1" style={{ fontSize: '14px', verticalAlign: 'middle' }}>verified_user</span>
                                    Secure payment powered by trusted providers
                                </p>
                            </div>
                        </>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </AuthenticatedLayout>
    );
};

export default Upgrade;
