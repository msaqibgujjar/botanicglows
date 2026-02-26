import React, { useState, useEffect } from 'react';
import { Save, Shield, User, Globe, Truck, Search } from 'lucide-react';
import { settingsStore, changeAdminPassword, addAdminUser, shippingStore } from '../services/adminData.js';
import { useAuth } from '../context/AuthContext.jsx';

const tabs = ['General', 'Shipping Rates', 'Password', 'Admins', 'Social'];

const Settings = () => {
    const { admin } = useAuth();

    // General settings
    const [settings, setSettings] = useState(settingsStore.get());

    // Shipping
    const [cities, setCities] = useState({});
    const [rates, setRates] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [shippingLoading, setShippingLoading] = useState(false);
    const [editRates, setEditRates] = useState({});
    const [shippingSearch, setShippingSearch] = useState('');

    // Password
    const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });

    // New Admin
    const [newAdmin, setNewAdmin] = useState({ email: '', password: '' });

    const [activeTab, setActiveTab] = useState('General');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const flash = (msg) => { setSuccess(msg); setError(''); setTimeout(() => setSuccess(''), 2000); };
    const flashError = (msg) => { setError(msg); setSuccess(''); setTimeout(() => setError(''), 3000); };

    const saveSettings = () => {
        settingsStore.save(settings);
        flash('Settings saved!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pw.newPw !== pw.confirm) return flashError('Passwords do not match');
        try {
            await changeAdminPassword(pw.current, pw.newPw);
            flash('Password changed successfully!');
            setPw({ current: '', newPw: '', confirm: '' });
        } catch (err) {
            flashError(err.message || 'Failed to change password');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            await addAdminUser(newAdmin.email, newAdmin.password);
            flash('Admin added!');
            setNewAdmin({ email: '', password: '' });
        } catch (err) {
            flashError(err.message || 'Failed to add admin');
        }
    };

    // Load shipping data
    useEffect(() => {
        if (activeTab === 'Shipping Rates') {
            loadShipping();
        }
    }, [activeTab]);

    const loadShipping = async () => {
        setShippingLoading(true);
        const [citiesData, ratesData] = await Promise.all([
            shippingStore.getCities(),
            shippingStore.getRates(),
        ]);
        setCities(citiesData);
        setRates(ratesData);
        // Build edit map
        const map = {};
        ratesData.forEach(r => { map[`${r.province}|${r.city}`] = r.rate; });
        setEditRates(map);
        if (!selectedProvince && Object.keys(citiesData).length) {
            setSelectedProvince(Object.keys(citiesData)[0]);
        }
        setShippingLoading(false);
    };

    const handleRateChange = (province, city, val) => {
        setEditRates(prev => ({ ...prev, [`${province}|${city}`]: val }));
    };

    const saveProvinceRates = async () => {
        const citiesForProvince = cities[selectedProvince] || [];
        const rateUpdates = citiesForProvince
            .filter(city => editRates[`${selectedProvince}|${city}`] !== undefined && editRates[`${selectedProvince}|${city}`] !== '')
            .map(city => ({
                province: selectedProvince,
                city,
                rate: Number(editRates[`${selectedProvince}|${city}`]) || 0,
            }));
        if (rateUpdates.length === 0) return flashError('No rates to save');
        await shippingStore.bulkUpdate(rateUpdates);
        flash(`Shipping rates for ${selectedProvince} saved!`);
        loadShipping();
    };

    const filteredCities = (cities[selectedProvince] || []).filter(
        c => !shippingSearch || c.toLowerCase().includes(shippingSearch.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-header"><h1>Settings</h1></div>
            {success && <div className="admin-alert admin-alert-success">{success}</div>}
            {error && <div className="admin-alert admin-alert-danger">{error}</div>}

            <div className="admin-tabs">
                {tabs.map(t => (
                    <button key={t} className={`admin-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            {/* General */}
            {activeTab === 'General' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Store Settings</h2>
                    <div className="admin-grid-2">
                        <div className="admin-form-group">
                            <label>Tax Rate (%)</label>
                            <input className="admin-input" type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: +e.target.value })} />
                        </div>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Payment Methods</h3>
                    {Object.entries(settings.paymentMethods || {}).map(([key, val]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={val} onChange={(e) => setSettings({ ...settings, paymentMethods: { ...settings.paymentMethods, [key]: e.target.checked } })} />
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </label>
                    ))}
                    <button className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }} onClick={saveSettings}><Save size={16} /> Save</button>
                </div>
            )}

            {/* Shipping Rates */}
            {activeTab === 'Shipping Rates' && (
                <div className="admin-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <h2 style={{ fontSize: '1rem', margin: 0 }}><Truck size={18} style={{ verticalAlign: '-3px', marginRight: '0.5rem' }} />Per-City Shipping Rates (PKR)</h2>
                    </div>

                    {shippingLoading ? (
                        <p style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div className="admin-form-group" style={{ flex: 1, minWidth: 200 }}>
                                    <label>Province</label>
                                    <select className="admin-input admin-select" value={selectedProvince} onChange={(e) => { setSelectedProvince(e.target.value); setShippingSearch(''); }}>
                                        {Object.keys(cities).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="admin-form-group" style={{ flex: 1, minWidth: 200 }}>
                                    <label>Search City</label>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--admin-text-muted)' }} />
                                        <input className="admin-input" style={{ paddingLeft: '2rem' }} placeholder="Filter cities..." value={shippingSearch} onChange={(e) => setShippingSearch(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-table-wrapper" style={{ maxHeight: 400, overflowY: 'auto' }}>
                                <table className="admin-table">
                                    <thead><tr><th>City</th><th style={{ width: 150 }}>Rate (PKR)</th></tr></thead>
                                    <tbody>
                                        {filteredCities.map(city => {
                                            const key = `${selectedProvince}|${city}`;
                                            return (
                                                <tr key={city}>
                                                    <td>{city}</td>
                                                    <td>
                                                        <input
                                                            className="admin-input"
                                                            type="number"
                                                            min="0"
                                                            step="10"
                                                            value={editRates[key] ?? ''}
                                                            placeholder="0"
                                                            onChange={(e) => handleRateChange(selectedProvince, city, e.target.value)}
                                                            style={{ padding: '0.4rem 0.6rem', width: '100%' }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <button className="admin-btn admin-btn-primary" style={{ marginTop: '1rem' }} onClick={saveProvinceRates}>
                                <Save size={16} /> Save {selectedProvince} Rates
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Password */}
            {activeTab === 'Password' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}><Shield size={18} style={{ verticalAlign: '-3px', marginRight: '0.5rem' }} />Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="admin-form-group"><label>Current Password</label><input className="admin-input" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} required /></div>
                        <div className="admin-form-group"><label>New Password</label><input className="admin-input" type="password" value={pw.newPw} onChange={(e) => setPw({ ...pw, newPw: e.target.value })} required /></div>
                        <div className="admin-form-group"><label>Confirm New Password</label><input className="admin-input" type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required /></div>
                        <button className="admin-btn admin-btn-primary" type="submit"><Save size={16} /> Update Password</button>
                    </form>
                </div>
            )}

            {/* Admins */}
            {activeTab === 'Admins' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}><User size={18} style={{ verticalAlign: '-3px', marginRight: '0.5rem' }} />Add New Admin</h2>
                    <form onSubmit={handleAddAdmin}>
                        <div className="admin-form-group"><label>Email</label><input className="admin-input" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required /></div>
                        <div className="admin-form-group"><label>Password</label><input className="admin-input" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required /></div>
                        <button className="admin-btn admin-btn-primary" type="submit"><Save size={16} /> Add Admin</button>
                    </form>
                </div>
            )}

            {/* Social */}
            {activeTab === 'Social' && (
                <div className="admin-card">
                    <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}><Globe size={18} style={{ verticalAlign: '-3px', marginRight: '0.5rem' }} />Social Links</h2>
                    {['instagram', 'facebook', 'twitter'].map((s) => (
                        <div className="admin-form-group" key={s}>
                            <label>{s.charAt(0).toUpperCase() + s.slice(1)} URL</label>
                            <input className="admin-input" value={(settings.socialLinks || {})[s] || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...(settings.socialLinks || {}), [s]: e.target.value } })} />
                        </div>
                    ))}
                    <button className="admin-btn admin-btn-primary" onClick={saveSettings}><Save size={16} /> Save</button>
                </div>
            )}
        </div>
    );
};

export default Settings;
