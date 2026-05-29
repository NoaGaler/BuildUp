import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiImage, FiMail } from 'react-icons/fi';
import './ProfileFields.css';

const ProfileFields = () => {
    const { user, tempRegistration, registerStep2, error: globalError } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');

    const isRegisterMode = location.pathname.includes('register');

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        profileImage: '',
        role: 'client'
    });

    useEffect(() => {
        if (isRegisterMode) {
            if (!tempRegistration) {
                navigate('/register');
                return;
            }
            setFormData({
                email: tempRegistration.email,
                name: '',
                phone: '',
                profileImage: '',
                role: 'client'
            });
        } else if (!isRegisterMode && user) {
            setFormData({
                email: user.email || '',
                name: user.name || '',
                phone: user.phone || '',
                profileImage: user.profile_image_url || '',
                role: user.role || 'client'
            });
        }
    }, [isRegisterMode, tempRegistration, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!formData.name.trim()) {
            setLocalError('Full name or business name is required.');
            return;
        }

        if (isRegisterMode && tempRegistration) {
            const completePayload = {
                email: tempRegistration.email,
                password: tempRegistration.password,
                name: formData.name,
                role: formData.role,
                phone: formData.phone || null,
                profile_image_url: formData.profileImage || null,
                categoryIds: []
            };

            const result = await registerStep2(completePayload);
            if (result.success) {
                navigate('/');
            } else {
                setLocalError(result.message || 'Profile configuration failed.');
            }
        } else {
            console.log('Update profile triggered:', formData);
        }
    };

    const activeError = localError || globalError;

    return (
        <div className="profile-fields-wrapper">
            <div className="profile-card-wide">
                <h2 className="profile-fields-title">
                    {isRegisterMode ? 'Complete Your Profile' : 'Edit Profile Settings'}
                </h2>

                {activeError && <div className="auth-error-left">{activeError}</div>}

                <form onSubmit={handleSubmit} className="auth-form-left">
                    
                    {/* Email Input Field - Read Only */}
                    <div className="input-group-left">
                        <label className="input-label">Email Address (Read-Only)</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon-left" />
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                className="auth-input-left disabled-input"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Full Name Input */}
                    <div className="input-group-left">
                        <label className="input-label">Full Name / Business Name</label>
                        <div className="input-wrapper">
                            <FiUser className="input-icon-left" />
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name} 
                                onChange={handleChange} 
                                className="auth-input-left"
                                required 
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="input-group-left">
                        <label className="input-label">Phone Number</label>
                        <div className="input-wrapper">
                            <FiPhone className="input-icon-left" />
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone} 
                                onChange={handleChange} 
                                className="auth-input-left"
                                placeholder="0500000000"
                            />
                        </div>
                    </div>

                    {/* Profile Image URL Input */}
                    <div className="input-group-left">
                        <label className="input-label">Profile Image URL</label>
                        <div className="input-wrapper">
                            <FiImage className="input-icon-left" />
                            <input 
                                type="url" 
                                name="profileImage"
                                value={formData.profileImage} 
                                onChange={handleChange} 
                                className="auth-input-left"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Account Type Radio Buttons */}
                    <div className="input-group-left">
                        <label className="input-label">Account Type</label>
                        <div className="radio-container-group">
                            <label className="radio-item-label">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="client" 
                                    checked={formData.role === 'client'}
                                    onChange={handleChange}
                                    className="radio-item-input"
                                    disabled={!isRegisterMode}
                                />
                                Regular User (Looking for inspiration)
                            </label>
                            <label className="radio-item-label">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="professional" 
                                    checked={formData.role === 'professional'}
                                    onChange={handleChange}
                                    className="radio-item-input"
                                    disabled={!isRegisterMode}
                                />
                                Professional (Designer, Architect, etc.)
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="auth-button-full">
                        {isRegisterMode ? 'Complete Registration' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileFields;