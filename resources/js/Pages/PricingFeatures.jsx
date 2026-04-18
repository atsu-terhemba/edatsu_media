import { Fragment } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Container, Row, Col } from "react-bootstrap";
import Metadata from "@/Components/Metadata";

export default function PricingFeatures({ html }) {
    return (
        <Fragment>
            <Metadata
                title="Pricing Features Proposal — Edatsu"
                description="Working list of Free vs Pro feature proposals."
                canonicalUrl="https://www.edatsu.com/pricing-features"
            />
            <GuestLayout>
                <style>{`
                    .pf-doc {
                        max-width: 880px;
                        margin: 0 auto;
                        padding: 48px 16px 96px;
                        color: #1d1d1f;
                        font-size: 15px;
                        line-height: 1.7;
                    }
                    .pf-doc h1 {
                        font-size: 34px;
                        font-weight: 600;
                        letter-spacing: -0.02em;
                        margin: 48px 0 16px;
                    }
                    .pf-doc h2 {
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: -0.01em;
                        margin: 56px 0 12px;
                        padding-top: 16px;
                        border-top: 1px solid #e5e5ea;
                    }
                    .pf-doc h2::before {
                        content: "";
                        display: block;
                        width: 40px;
                        height: 3px;
                        background: #f97316;
                        border-radius: 2px;
                        margin-bottom: 16px;
                    }
                    .pf-doc h3 {
                        font-size: 18px;
                        font-weight: 600;
                        margin: 32px 0 8px;
                    }
                    .pf-doc p { margin: 0 0 14px; }
                    .pf-doc ul, .pf-doc ol { margin: 0 0 18px; padding-left: 22px; }
                    .pf-doc li { margin-bottom: 6px; }
                    .pf-doc code {
                        background: #f5f5f7;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 13px;
                        color: #1d1d1f;
                    }
                    .pf-doc hr {
                        border: 0;
                        border-top: 1px solid #e5e5ea;
                        margin: 40px 0;
                    }
                    .pf-doc table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 16px 0 28px;
                        font-size: 14px;
                        background: #fff;
                        border: 1px solid #e5e5ea;
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .pf-doc thead th {
                        background: #f5f5f7;
                        text-align: left;
                        font-weight: 600;
                        padding: 12px 14px;
                        border-bottom: 1px solid #e5e5ea;
                        white-space: nowrap;
                    }
                    .pf-doc tbody td {
                        padding: 12px 14px;
                        border-bottom: 1px solid #f0f0f2;
                        vertical-align: top;
                    }
                    .pf-doc tbody tr:last-child td { border-bottom: 0; }
                    .pf-doc tbody tr:hover { background: #fafafa; }
                    .pf-doc strong { font-weight: 600; }
                    .pf-eyebrow {
                        display: inline-block;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        color: #f97316;
                        margin-bottom: 8px;
                    }
                `}</style>
                <Container fluid className="bg-white">
                    <Row>
                        <Col xs={12}>
                            <div className="pf-doc">
                                <span className="pf-eyebrow">Proposal</span>
                                <div dangerouslySetInnerHTML={{ __html: html }} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </GuestLayout>
        </Fragment>
    );
}
