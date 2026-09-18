import React, { useState, useRef } from 'react';
import { 
  X, Edit2, Camera, CheckCircle2, ShieldCheck, MapPin, Phone, 
  Mail, Building2, Landmark, FileText, Sparkles, Award, User, 
  Calendar, Layers, Save, RefreshCw, Upload, AlertCircle
} from 'lucide-react';

const AVATAR_PRESETS = [
  '👨‍🌾', '👩‍🌾', '🚜', '🌾', '🌱', '🧅', '🫘', '🍅', 
  '🤝', '🏢', '🏭', '💼', '🚚', '📦', '🛡️', '📊'
];

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  role = 'farmer', // 'farmer' | 'fpo' | 'buyer'
  profileData, 
  onSaveProfile 
}) {
  if (!isOpen) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'business' | 'bank'
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Handle text input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Avatar Emoji Selection
  const handleSelectAvatar = (emoji) => {
    setFormData(prev => ({ ...prev, avatar: emoji, photoUrl: null }));
  };

  // Save changes
  const handleSave = (e) => {
    e?.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Theme styling based on role
  const roleThemes = {
    farmer: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      bannerGradient: 'from-emerald-800 via-green-900 to-emerald-950',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      accentText: 'text-emerald-700',
      tag: 'Kisan Identity Card',
      icon: '👨‍🌾'
    },
    fpo: {
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      bannerGradient: 'from-amber-800 via-orange-900 to-amber-950',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
      accentText: 'text-amber-700',
      tag: 'FPO Producer Co. Registration',
      icon: '🤝'
    },
    buyer: {
      badge: 'bg-blue-100 text-blue-900 border-blue-300',
      bannerGradient: 'from-blue-900 via-indigo-900 to-slate-950',
      primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
      accentText: 'text-blue-700',
      tag: 'Verified Corporate Buyer Certificate',
      icon: '🏢'
    }
  };

  const theme = roleThemes[role] || roleThemes.farmer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ─── Modal Header Banner ────────────────────────────────────────── */}
        <div className={`p-6 bg-gradient-to-r ${theme.bannerGradient} text-white relative flex-shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
              {theme.tag}
            </span>
            <span className="text-[11px] text-white/80 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>KYC Verified & Escrow Active</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-4">
              {/* Profile Photo / Avatar display with upload trigger */}
              <div className="relative group">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl ring-4 ring-white/30 shadow-md">
                    {formData.avatar || theme.icon}
                  </div>
                )}

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg transition cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
                  {formData.name}
                </h3>
                <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {role === 'farmer' && `${formData.village || 'Yeola'}, ${formData.district || 'Nashik'}, ${formData.state || 'Maharashtra'}`}
                    {role === 'fpo' && `${formData.city || 'Pimpalgaon'}, ${formData.district || 'Nashik'} • ${formData.regNo}`}
                    {role === 'buyer' && `${formData.address || formData.district || 'Pune'} • GST: ${formData.gst}`}
                  </span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md">
                    {role === 'farmer' && `Farmer ID: ${formData.kisanId || 'MH-4412'}`}
                    {role === 'fpo' && `${formData.membersCount || 520} Farmer Members`}
                    {role === 'buyer' && `Trust Score: 99% Verified`}
                  </span>
                </div>
              </div>
            </div>

            {/* View/Edit Toggle Button */}
            <div className="self-start sm:self-center">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...profileData });
                      setIsEditing(false);
                    }}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Success Notification ────────────────────────────────────────── */}
        {savedSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details & photo updated successfully in your portal session!</span>
          </div>
        )}

        {/* ─── Navigation Tabs ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          {[
            { id: 'overview', label: 'Personal & Contact' },
            { id: 'business', label: role === 'farmer' ? 'Farming & Land' : role === 'fpo' ? 'FPO Operations' : 'Business & Trade' },
            { id: 'bank', label: 'Bank & Settlement' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Modal Body (Scrollable) ─────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Avatar Selector in Edit Mode */}
          {isEditing && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Choose an Avatar Icon or Upload Photo:</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {AVATAR_PRESETS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelectAvatar(emoji)}
                    className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition cursor-pointer ${
                      formData.avatar === emoji && !formData.photoUrl
                        ? 'bg-emerald-600 text-white shadow-md scale-110'
                        : 'bg-white hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: Overview / Contact Info */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Contact & General Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {role === 'buyer' ? 'Company / Business Name' : role === 'fpo' ? 'FPO Name' : 'Full Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Mobile / WhatsApp Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.phone || '+91 98231 45678'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.email || 'info@anaaj.org'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">District / Hub Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.district || ''}
                      onChange={(e) => handleChange('district', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.district || 'Nashik'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    {role === 'buyer' ? 'Registered Office Address' : role === 'fpo' ? 'Aggregation Center / Office' : 'Village / Taluka'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.village || formData.address || formData.city || ''}
                      onChange={(e) => handleChange(role === 'buyer' ? 'address' : role === 'fpo' ? 'city' : 'village', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.village || formData.address || formData.city || 'Yeola'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">State & Pincode</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.state || 'Maharashtra'}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-2/3 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        value={formData.pincode || '423401'}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        className="w-1/3 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.state || 'Maharashtra'} - {formData.pincode || '423401'}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Role-Specific Details */}
          {activeTab === 'business' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                {role === 'farmer' ? 'Agricultural Land & Crops' : role === 'fpo' ? 'FPO Scale & Governance' : 'Corporate Trade & Licenses'}
              </h4>

              {role === 'farmer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Total Farm Land Holding</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.landSize || ''}
                        onChange={(e) => handleChange('landSize', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.landSize || '8.5 Acres (Irrogated)'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Primary Crops Cultivated</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.primaryCrops || ''}
                        onChange={(e) => handleChange('primaryCrops', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.primaryCrops || 'Onion, Sharbati Wheat, Soybean'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Registered APMC Mandi License</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.mandiReg || ''}
                        onChange={(e) => handleChange('mandiReg', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.mandiReg || 'Lasalgaon APMC #K-4412'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">PM-Kisan / Aadhaar DBT Status</label>
                    <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verified • Direct Bank Transfer Linked</span>
                    </p>
                  </div>
                </div>
              )}

              {role === 'fpo' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">FPO Registration Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.regNo || ''}
                        onChange={(e) => handleChange('regNo', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.regNo || 'MH-FPO-2024-9921'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Active Farmer Members</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.membersCount || ''}
                        onChange={(e) => handleChange('membersCount', Number(e.target.value))}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.membersCount || 520} Farmers Registered</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Board of Directors / President</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.boardPresident || ''}
                        onChange={(e) => handleChange('boardPresident', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.boardPresident || 'Balasaheb Vikhe Patil'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Aggregation Storage Hub</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.warehouseLocation || ''}
                        onChange={(e) => handleChange('warehouseLocation', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.warehouseLocation || 'Dindori CA Storage Hub (4,500 MT)'}</p>
                    )}
                  </div>
                </div>
              )}

              {role === 'buyer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GSTIN</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.gst || ''}
                        onChange={(e) => handleChange('gst', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800 font-mono">{formData.gst || '27AAXXX0000X1Z5'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">FSSAI License Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.fssai || ''}
                        onChange={(e) => handleChange('fssai', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800 font-mono">{formData.fssai || '10022022000451'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Business Type</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.businessType || ''}
                        onChange={(e) => handleChange('businessType', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.businessType || 'Food Processor & Bulk Exporter'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Monthly Procurement Volume</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.procurementCapacity || ''}
                        onChange={(e) => handleChange('procurementCapacity', e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                      />
                    ) : (
                      <p className="text-sm font-bold text-slate-800">{formData.procurementCapacity || '2,500 Tonnes / Month'}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Bank & Settlement */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Settlement Account & Escrow Clearance
              </h4>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950">
                  <p className="font-bold text-emerald-900">RBI Trustee Escrow Protection Guarantee</p>
                  <p className="text-emerald-800/80 mt-0.5">
                    Your payments and settlements are legally held under RBI-regulated trustee escrow accounts to ensure instant payment guarantees upon quality clearance.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Primary Settlement Bank</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.bankName || ''}
                      onChange={(e) => handleChange('bankName', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-800">{formData.bankName || 'State Bank of India (SBI)'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Account Number (Masked)</label>
                  <p className="text-sm font-mono font-bold text-slate-800">{formData.accountMasked || '•••• •••• 4321'}</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">IFSC Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.ifsc || ''}
                      onChange={(e) => handleChange('ifsc', e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                    />
                  ) : (
                    <p className="text-sm font-mono font-bold text-slate-800">{formData.ifsc || 'SBIN0004123'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Dispute Redressal Priority</label>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 inline-block">
                    Fast-Track Redressal Active
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ─── Modal Footer ───────────────────────────────────────────────── */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-400">
            anaaj Portal ID: <strong>{role.toUpperCase()}-{Date.now().toString().slice(-6)}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              Close
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition cursor-pointer ${theme.primaryBtn}`}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
