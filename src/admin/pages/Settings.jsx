import React, { useState } from 'react';
import { Save, Shield, User, Globe } from 'lucide-react';
import { settingsStore, changeAdminPassword, addAdminUser } from '../services/adminData.js';
import { useAuth } from '../context/AuthContext.jsx';

const tabs = ['General', 'Password', 'Admins', 'Social'];

const Settings = () => {
    const { admin } = useAuth();
    const [activeTab, setActiveTab] = useState('General');
    const [settings, setSettings] = useState(settingsStore.get());

    // Password
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    // New Admin
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminPwd, setNewAdminPwd] = useState('');
    const [newAdminRole, setNewAdminRole] = useState('Admin');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const flash = (msg) => { setSuccess(msg); setError(''); setTimeout(() => setSuccess(''), 2000); };
    const flashError = (msg) => { setError(msg); setSuccess(''); };

    const saveSettings = () => {
        settingsStore.save(settings);
        flash('Settings saved!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPwd !== confirmPwd) return flashError('Passwords do not match');
        if (newPwd.length < 6) return flashError('Password must be at least 6 characters');
        try {
            await changeAdminPassword(currentPwd, newPwd);
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
            flash('Password changed!');
        } catch (err) {
            flashError(err.message || 'Failed to change password');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        if (!newAdminName || !newAdminEmail || !newAdminPwd) return flashError('All fields required');
        const result = await addAdminUser(newAdminName, newAdminEmail, newAdminPwd, newAdminRole);
        if (result) {
            setNewAdminName(''); setNewAdminEmail(''); setNewAdminPwd('');
            flash('Admin created!');
        } else {
            flashError('Failed to create admin. Email may already exist.');
        }
    };

    return (
        <div>
            <div className="admin-page-header"><h1>Settings</h1></div>

            {success && <div className="admin-alert admin-alert-success">{success}</div>}
            {error && <div className="admin-alert admin-alert-error">{error}</div>}

            <div className="admin-tabs">
                {tabs.map((t) => (
                    <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            {/* General */}
            {activeTab === 'General' && (
                <div className="admin-card">
                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label>Shipping Rate ($)</label>
                            <input className="admin-input" type="number" step="0.01" value={settings.shippingRate}
                                onChange={(e) => setSettings({ ...settings, shippingRate: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Free Shipping Threshold ($)</label>
                            <input className="admin-input" type="number" value={settings.freeShippingThreshold}
                                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Tax Rate (%)</label>
                        <input className="admin-input" type="number" value={settings.taxRate}
                            onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={saveSettings}><Save size={16} /> Save</button>
                </div>
            )}

            {/* Password */}
            {activeTab === 'Password' && (
                <form className="admin-card" onSubmit={handlePasswordChange}>
                    <div className="admin-form-group">
                        <label>Current Password</label>
                        <input className="admin-input" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                    </div>
                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label>New Password</label>
                            <input className="admin-input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Confirm New Password</label>
                            <input className="admin-input" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                        </div>
                    </div>
                    <button className="admin-btn admin-btn-primary" type="submit"><Shield size={16} /> Change Password</button>
                </form>
            )}

            {/* Admins */}
            {activeTab === 'Admins' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', fontFamily: 'Inter, sans-serif', marginBottom: '1rem' }}>Add New Admin</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>
                        Logged in as: <strong>{admin?.email || admin?.username}</strong> ({admin?.role})
                    </p>
                    <form onSubmit={handleAddAdmin}>
                        <div className="admin-grid-2">
                            <div className="admin-form-group">
                                <label>Name</label>
                                <input className="admin-input" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="Full name" />
                            </div>
                            <div className="admin-form-group">
                                <label>Email</label>
                                <input className="admin-input" type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="email@botanicglows.com" />
                            </div>
                        </div>
                        <div className="admin-grid-2">
                            <div className="admin-form-group">
                                <label>Password</label>
                                <input className="admin-input" type="password" value={newAdminPwd} onChange={(e) => setNewAdminPwd(e.target.value)} placeholder="Min. 6 characters" />
                            </div>
                            <div className="admin-form-group">
                                <label>Role</label>
                                <select className="admin-input admin-select" value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value)}>
                                    <option>Admin</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                        </div>
                        <button className="admin-btn admin-btn-primary" type="submit"><User size={16} /> Create Admin</button>
                    </form>
                </div>
            )}

            {/* Social */}
            {activeTab === 'Social' && (
                <div className="admin-card">
                    {['instagram', 'facebook', 'twitter'].map((key) => (
                        <div className="admin-form-group" key={key}>
                            <label style={{ textTransform: 'capitalize' }}>{key}</label>
                            <input className="admin-input" value={settings.socialLinks[key]}
                                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [key]: e.target.value } })}
                                placeholder={`https://${key}.com/botanicglows`} />
                        </div>
                    ))}
                    <button className="admin-btn admin-btn-primary" onClick={saveSettings}><Globe size={16} /> Save</button>
                </div>
            )}
        </div>
    );
};

export default Settings;
