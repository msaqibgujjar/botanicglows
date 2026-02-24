import React, { useState } from 'react';
import { Save, Plus, UserPlus } from 'lucide-react';
import { settingsStore, changeAdminPassword, addAdminUser } from '../services/adminData.js';
import { useAuth } from '../context/AuthContext.jsx';

const Settings = () => {
    const { admin } = useAuth();
    const [tab, setTab] = useState('general');
    const [settings, setSettings] = useState(settingsStore.get());
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Password form
    const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });

    // New admin form
    const [adminForm, setAdminForm] = useState({ username: '', password: '', role: 'Staff Admin' });

    const saveSettings = () => {
        settingsStore.save(settings);
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleSettingChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (field, value) => {
        setSettings((prev) => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [field]: value },
        }));
    };

    const handleChangePassword = async () => {
        setError('');
        if (!passwordForm.newPass || !passwordForm.confirm) {
            setError('Please fill in all fields');
            return;
        }
        if (passwordForm.newPass !== passwordForm.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (passwordForm.newPass.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        await changeAdminPassword(admin.username, passwordForm.newPass);
        setPasswordForm({ current: '', newPass: '', confirm: '' });
        setSuccess('Password changed successfully!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const handleAddAdmin = async () => {
        setError('');
        if (!adminForm.username || !adminForm.password) {
            setError('Please fill in all fields');
            return;
        }
        const result = await addAdminUser(adminForm.username, adminForm.password, adminForm.role);
        if (!result) {
            setError('Username already exists');
            return;
        }
        setAdminForm({ username: '', password: '', role: 'Staff Admin' });
        setSuccess('Admin user added successfully!');
        setTimeout(() => setSuccess(''), 2000);
    };

    const tabs = ['general', 'password', 'admins', 'social'];

    return (
        <div>
            <div className="admin-page-header">
                <h1>Settings</h1>
            </div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}
            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-tabs">
                {tabs.map((t) => (
                    <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setError(''); }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {tab === 'general' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>Shipping & Tax</h2>

                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label>Shipping Rate ($)</label>
                            <input className="admin-input" type="number" step="0.01" value={settings.shippingRate}
                                onChange={(e) => handleSettingChange('shippingRate', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Free Shipping Threshold ($)</label>
                            <input className="admin-input" type="number" step="0.01" value={settings.freeShippingThreshold}
                                onChange={(e) => handleSettingChange('freeShippingThreshold', parseFloat(e.target.value) || 0)} />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Tax Rate (%)</label>
                        <input className="admin-input" type="number" step="0.1" value={settings.taxRate} style={{ maxWidth: 200 }}
                            onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value) || 0)} />
                    </div>

                    <button className="admin-btn admin-btn-primary" onClick={saveSettings}>
                        <Save size={16} /> Save Settings
                    </button>
                </div>
            )}

            {/* Change Password */}
            {tab === 'password' && (
                <div className="admin-card" style={{ maxWidth: 500 }}>
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>Change Password</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                        Logged in as: <strong>{admin?.username}</strong>
                    </p>

                    <div className="admin-form-group">
                        <label>New Password</label>
                        <input className="admin-input" type="password" value={passwordForm.newPass}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                            placeholder="Minimum 6 characters" />
                    </div>
                    <div className="admin-form-group">
                        <label>Confirm New Password</label>
                        <input className="admin-input" type="password" value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            placeholder="Re-enter new password" />
                    </div>

                    <button className="admin-btn admin-btn-primary" onClick={handleChangePassword}>
                        <Save size={16} /> Change Password
                    </button>
                </div>
            )}

            {/* Add Admin */}
            {tab === 'admins' && (
                <div className="admin-card" style={{ maxWidth: 500 }}>
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>Add New Admin</h2>

                    <div className="admin-form-group">
                        <label>Username</label>
                        <input className="admin-input" value={adminForm.username}
                            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                            placeholder="Enter username" />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <input className="admin-input" type="password" value={adminForm.password}
                            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                            placeholder="Enter password" />
                    </div>
                    <div className="admin-form-group">
                        <label>Role</label>
                        <select className="admin-input admin-select" value={adminForm.role}
                            onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Staff Admin">Staff Admin</option>
                        </select>
                    </div>

                    <button className="admin-btn admin-btn-primary" onClick={handleAddAdmin}>
                        <UserPlus size={16} /> Add Admin User
                    </button>
                </div>
            )}

            {/* Social Links */}
            {tab === 'social' && (
                <div className="admin-card" style={{ maxWidth: 500 }}>
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1.25rem' }}>Social Media Links</h2>

                    <div className="admin-form-group">
                        <label>Instagram URL</label>
                        <input className="admin-input" value={settings.socialLinks.instagram}
                            onChange={(e) => handleSocialChange('instagram', e.target.value)}
                            placeholder="https://instagram.com/..." />
                    </div>
                    <div className="admin-form-group">
                        <label>Facebook URL</label>
                        <input className="admin-input" value={settings.socialLinks.facebook}
                            onChange={(e) => handleSocialChange('facebook', e.target.value)}
                            placeholder="https://facebook.com/..." />
                    </div>
                    <div className="admin-form-group">
                        <label>Twitter / X URL</label>
                        <input className="admin-input" value={settings.socialLinks.twitter}
                            onChange={(e) => handleSocialChange('twitter', e.target.value)}
                            placeholder="https://x.com/..." />
                    </div>

                    <button className="admin-btn admin-btn-primary" onClick={saveSettings}>
                        <Save size={16} /> Save Social Links
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;
