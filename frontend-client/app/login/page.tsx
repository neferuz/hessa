"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { ViewState, LoginStep } from "./types";

// Import Components
import SelectionView from "./components/SelectionView";
import LoginView from "./components/LoginView";

export default function LoginPage() {
    const router = useRouter();
    // --- State ---
    const [view, setView] = useState<ViewState>('selection');

    // Login/Auth State
    const [authStep, setAuthStep] = useState<LoginStep>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);

    // Reset auth state when switching views
    useEffect(() => {
        setAuthStep('email');
        setOtp(['', '', '', '']);
    }, [view]);

    // Handle View Change Wrapper
    const handleSetView = (newView: ViewState) => {
        if (newView === 'quiz') {
            router.push('/quiz');
        } else {
            setView(newView);
        }
    };

    // Render Content
    const renderContent = () => {
        switch (view) {
            case 'selection':
                return <SelectionView setView={handleSetView} />;

            case 'login':
                return (
                    <LoginView
                        setView={handleSetView}
                        authStep={authStep}
                        setAuthStep={setAuthStep}
                        email={email}
                        setEmail={setEmail}
                        otp={otp}
                        setOtp={setOtp}
                    />
                );
            default:
                return <SelectionView setView={handleSetView} />;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {renderContent()}
        </div>
    );
}
