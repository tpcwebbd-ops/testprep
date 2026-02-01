'use client';

import React, { useEffect, useState } from 'react';
import { Save, Smartphone, Loader2, Palette } from 'lucide-react';
import { toast } from 'react-toastify';

// --- Interfaces ---
interface ButtonConfig {
  text: string;
  bgColor: string;
  textColor: string;
  size: 'small' | 'medium' | 'large';
  animation: 'none' | 'pulse' | 'bounce' | 'ping';
}

interface ConfigState {
  isEnabled: boolean;
  title: string;
  description: string;
  installBtn: ButtonConfig;
  laterBtn: ButtonConfig;
}

// --- Default Configuration ---
const defaultConfig: ConfigState = {
  isEnabled: true,
  title: '',
  description: '',
  installBtn: { text: '', bgColor: '#4F46E5', textColor: '#ffffff', size: 'medium', animation: 'none' },
  laterBtn: { text: '', bgColor: 'transparent', textColor: '#ffffff', size: 'medium', animation: 'none' },
};

// --- Sub-Components ---

/** Reusable Color Picker Component with Presets */
const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) => {
  const presets = [
    { name: 'Red', val: '#EF4444' },
    { name: 'Blue', val: '#3B82F6' },
    { name: 'Green', val: '#10B981' },
    { name: 'Indigo', val: '#4F46E5' },
    { name: 'Black', val: '#000000' },
    { name: 'White', val: '#FFFFFF' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-2">
        <Palette className="w-3 h-3" />
        {label}
      </label>

      <div className="space-y-3">
        {/* Hex Input & Preview */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none text-sm font-mono text-gray-300 transition-colors"
            />
            <div
              className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md border border-white/20 shadow-sm"
              style={{ backgroundColor: value === 'transparent' ? 'transparent' : value }}
            />
            {/* Native Color Picker (Hidden overlay) */}
            <input
              type="color"
              value={value === 'transparent' ? '#000000' : value}
              onChange={e => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-10"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map(color => (
            <button
              key={color.val}
              onClick={() => onChange(color.val)}
              className={`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110 active:scale-95 focus:outline-none ring-2 ring-offset-2 ring-offset-[#0F0F11] ${
                value.toLowerCase() === color.val.toLowerCase() ? 'ring-indigo-500' : 'ring-transparent'
              }`}
              style={{ backgroundColor: color.val }}
              title={color.name}
              aria-label={`Select ${color.name}`}
            />
          ))}
          {/* Transparent Option */}
          <button
            onClick={() => onChange('transparent')}
            className={`w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center bg-white/5 ring-2 ring-offset-2 ring-offset-[#0F0F11] ${
              value === 'transparent' ? 'ring-indigo-500' : 'ring-transparent'
            }`}
            title="Transparent"
          >
            <div className="w-full h-px bg-red-400 rotate-45 transform scale-125" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function AdminPWAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<ConfigState>(defaultConfig);

  useEffect(() => {
    fetch('/api/pwa-pop-up')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/pwa-pop-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        toast.success('Configuration saved successfully.');
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      toast.error('Failed to update configuration.');
    } finally {
      setSaving(false);
    }
  };

  // Generic handler for top-level ConfigState changes
  const updateConfig = <K extends keyof ConfigState>(field: K, value: ConfigState[K]) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Specific handler for button updates - values are always strings/enums compatible with string
  const updateBtn = (type: 'installBtn' | 'laterBtn', field: keyof ButtonConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">PWA Pop-up Manager</h1>
            <p className="text-gray-400 mt-2 text-sm">Customize your application&apos;s install experience.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Form Controls */}
          <div className="xl:col-span-7 space-y-6">
            {/* General Settings */}
            <div className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                General Settings
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <span className="font-medium text-sm text-gray-200">Enable Pop-up</span>
                    <p className="text-xs text-gray-500">Toggle visibility globally</p>
                  </div>
                  <button
                    onClick={() => updateConfig('isEnabled', !config.isEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                      config.isEnabled ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                        config.isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Title</label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={e => updateConfig('title', e.target.value)}
                      placeholder="e.g. Install App"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Description</label>
                    <textarea
                      rows={3}
                      value={config.description}
                      onChange={e => updateConfig('description', e.target.value)}
                      placeholder="Why should users install this?"
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Button Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['installBtn', 'laterBtn'] as const).map(key => (
                <div key={key} className="bg-[#0A0A0C] border border-white/5 p-6 rounded-2xl h-full">
                  <h2 className="text-lg font-semibold mb-6 text-gray-200 flex items-center gap-2">
                    {key === 'installBtn' ? 'Primary Button' : 'Secondary Button'}
                  </h2>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Label</label>
                      <input
                        type="text"
                        value={config[key].text}
                        onChange={e => updateBtn(key, 'text', e.target.value)}
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
                      />
                    </div>

                    <ColorPicker label="Background Color" value={config[key].bgColor} onChange={val => updateBtn(key, 'bgColor', val)} />

                    <ColorPicker label="Text Color" value={config[key].textColor} onChange={val => updateBtn(key, 'textColor', val)} />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Size</label>
                        <select
                          value={config[key].size}
                          onChange={e => updateBtn(key, 'size', e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none text-sm text-gray-300"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Effect</label>
                        <select
                          value={config[key].animation}
                          onChange={e => updateBtn(key, 'animation', e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none text-sm text-gray-300"
                        >
                          <option value="none">None</option>
                          <option value="pulse">Pulse</option>
                          <option value="bounce">Bounce</option>
                          <option value="ping">Ping</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="xl:col-span-5">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-300 flex items-center justify-between">
                Live Preview
                <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">Mobile View</span>
              </h2>

              <div className="relative mx-auto border-[8px] border-[#1a1a1c] rounded-[2.5rem] bg-gray-900 shadow-2xl overflow-hidden max-w-sm">
                {/* Fake Phone UI */}
                <div className="h-6 bg-[#1a1a1c] w-full absolute top-0 left-0 z-20 flex justify-center">
                  <div className="h-4 w-32 bg-black rounded-b-xl"></div>
                </div>

                {/* App Content Placeholder */}
                <div className="h-[600px] bg-gradient-to-br from-gray-900 to-black w-full relative flex items-center justify-center">
                  <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 content-start opacity-20 mt-12">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/10"></div>
                    ))}
                  </div>

                  {/* The Actual Pop-up Preview */}
                  <div className="absolute inset-x-4 bottom-8">
                    <div className="relative overflow-hidden bg-[#0F0F11]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 isolate">
                      <div className="absolute top-0 right-0 p-4">
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                          <span className="w-3 h-3 text-gray-400">×</span>
                        </div>
                      </div>

                      {/* Glow Effects */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-indigo-500/10 to-transparent -z-10" />
                      <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10" />

                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 relative w-14 h-14 rounded-2xl bg-[#0F0F11] flex items-center justify-center border border-white/10 shadow-lg">
                          <Smartphone className="w-7 h-7 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{config.title || 'App Title'}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed mb-6">{config.description || 'Description text...'}</p>

                        <div className="w-full space-y-3">
                          <button
                            style={{
                              backgroundColor: config.installBtn.bgColor,
                              color: config.installBtn.textColor,
                            }}
                            className={`w-full rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2
                                ${config.installBtn.size === 'small' ? 'py-2 text-xs' : config.installBtn.size === 'large' ? 'py-4 text-base' : 'py-3 text-sm'}
                                ${config.installBtn.animation === 'pulse' ? 'animate-pulse' : config.installBtn.animation === 'bounce' ? 'animate-bounce' : ''}
                              `}
                          >
                            {config.installBtn.text || 'Install'}
                          </button>

                          <button
                            style={{
                              backgroundColor: config.laterBtn.bgColor,
                              color: config.laterBtn.textColor,
                            }}
                            className={`w-full rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                                ${config.laterBtn.size === 'small' ? 'py-2 text-xs' : config.laterBtn.size === 'large' ? 'py-4 text-base' : 'py-3 text-sm'}
                              `}
                          >
                            {config.laterBtn.text || 'Later'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">Shows how the pop-up appears on a mobile device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
