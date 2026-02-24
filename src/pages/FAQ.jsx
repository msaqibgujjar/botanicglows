import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="faq-item">
            <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
                <span>{question}</span>
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="faq-answer"
                    >
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "Are your products truly organic?",
            answer: "Yes! All our ingredients are sourced from certified organic farms. We believe in the power of nature without any synthetic additives."
        },
        {
            question: "Do you test on animals?",
            answer: "Never. Botanic Glows is proudly cruelty-free and Leaping Bunny certified. We test our products on ourselves, not our furry friends."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day happiness guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund within 30 days."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days within the US. International shipping can take 7-14 business days depending on the destination."
        },
        {
            question: "Are your products suitable for sensitive skin?",
            answer: "Yes, our formulas are designed to be gentle and effective for all skin types, including sensitive skin. However, we always recommend patch testing first."
        }
    ];

    return (
        <div className="faq-page container">
            <div className="faq-header">
                <h1>Frequently Asked Questions</h1>
                <p>Everything you need to know about our products and philosophy.</p>
            </div>

            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>

            <style>{`
                .faq-page {
                    padding-top: 8rem;
                    padding-bottom: 6rem;
                    max-width: 800px;
                }
                .faq-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .faq-header h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .faq-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .faq-item {
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    background-color: var(--color-surface);
                }
                .faq-question {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    background: none;
                    border: none;
                    font-family: var(--font-heading);
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-align: left;
                    cursor: pointer;
                    color: var(--color-text-main);
                }
                .faq-question:hover {
                    background-color: rgba(0,0,0,0.02);
                }
                .faq-answer {
                    padding: 0 1.5rem 1.5rem;
                    color: var(--color-text-muted);
                    line-height: 1.6;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default FAQ;
