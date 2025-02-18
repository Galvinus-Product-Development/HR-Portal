import React, { useState } from 'react';
import { Building2, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!isLogin && !formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!isLogin && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <div className="auth-brand">
                    <Building2 className="auth-brand-icon" />
                    <h1 className="auth-brand-title">Galvinus HR</h1>
                </div>
                <h2 className="auth-title">
                    {isLogin ? 'Sign in to your account' : 'Create your account'}
                </h2>
            </div>

            <div className="auth-form-container">
                <div className="auth-form-card">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="auth-input-group">
                                <label htmlFor="name" className="auth-label">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <User className="auth-icon" />
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="auth-error">{errors.name}</p>}
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label htmlFor="email" className="auth-label">Email address</label>
                            <div className="auth-input-wrapper">
                                <Mail className="auth-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="auth-error">{errors.email}</p>}
                        </div>

                        {!isLogin && (
                            <div className="auth-input-group">
                                <label htmlFor="phone" className="auth-label">Phone Number</label>
                                <div className="auth-input-wrapper">
                                    <Phone className="auth-icon" />
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
                                        placeholder="1234567890"
                                    />
                                </div>
                                {errors.phone && <p className="auth-error">{errors.phone}</p>}
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label htmlFor="password" className="auth-label">Password</label>
                            <div className="auth-input-wrapper">
                                <Lock className="auth-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="auth-toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="auth-icon" /> : <Eye className="auth-icon" />}
                                </button>
                            </div>
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                        </div>

                        {!isLogin && (
                            <div className="auth-input-group">
                                <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock className="auth-icon" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`auth-input ${errors.confirmPassword ? 'auth-input-error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="auth-error">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        {isLogin && (
                            <div className="auth-remember-forgot">
                                <div className="auth-remember">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="auth-checkbox"
                                    />
                                    <label htmlFor="remember-me" className="auth-checkbox-label">
                                        Remember me
                                    </label>
                                </div>
                                <div className="auth-forgot-password">
                                    <a href="#" className="auth-link">Forgot your password?</a>
                                </div>
                            </div>
                        )}

                        <div>
                            <button type="submit" className="auth-submit-button">
                                {isLogin ? 'Sign in' : 'Sign up'}
                            </button>
                        </div>
                    </form>

                    <div className="auth-toggle-container">
                        <div className="auth-divider">
                            <span className="auth-divider-text">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="auth-toggle-button"
                        >
                            {isLogin ? 'Create new account' : 'Sign in to existing account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
