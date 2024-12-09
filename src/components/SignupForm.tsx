import React, { useState } from 'react';
import { signup } from '../api/campaigns'; 
import '../styles/AuthForm.css';

const SignupForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords
        if (password !== passwordConfirmation) {
            setError('Passwords do not match.');
            return;
        }

        // Clear previous errors and success messages
        setError(null);
        setSuccess(null);

        // Prepare request payload
        const credentials = {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role,
        };

        try {
            const response = await signup(credentials); // Call API signup function
            console.log(response); // For debugging

            // Handle successful signup
            setSuccess('Signup successful! Redirecting...');
            // Optionally redirect user to another page after success
        } catch (err: any) {
            // Extract error message from server response if available
            const serverError = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(serverError);
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Select Role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="campaign_manager">Campaign Manager</option>
                </select>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupForm;
