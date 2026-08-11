import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Plus, Edit2, Trash2, Check, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProfileModal } from './ProfileModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { UserProfile } from '../../types';

export function ProfileSwitcher() {
  const { state, switchProfile, duplicateProfile, deleteProfile } = useApp();
  const { profiles = [], activeProfileId } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileToEdit, setProfileToEdit] = useState<UserProfile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<UserProfile | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Active Profile Pill / Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[10px]"
          style={{ background: '#c8ff00', color: '#0a0a0a' }}
        >
          {getInitials(activeProfile?.name || state.settings.studentName)}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-heading font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
            {activeProfile?.name || state.settings.studentName || 'Student Profile'}
          </p>
          <p className="text-[10px] font-mono leading-tight" style={{ color: 'var(--text-tertiary)' }}>
            {activeProfile?.course || state.settings.course || 'Degree'}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 opacity-50 ml-1" style={{ color: 'var(--text-tertiary)' }} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 p-2 rounded-2xl shadow-2xl z-50 space-y-1"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-hover)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="px-3 py-2 border-b border-[var(--border-primary)] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Academic Profiles ({profiles.length})
              </span>
              <button
                onClick={() => {
                  setProfileToEdit(null);
                  setIsProfileModalOpen(true);
                  setIsOpen(false);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-heading font-semibold"
                style={{ color: '#c8ff00' }}
              >
                <Plus className="w-3 h-3" /> Add Profile
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {profiles.map((profile) => {
                const isActive = profile.id === activeProfileId;
                return (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-2 rounded-xl transition-colors group cursor-pointer"
                    style={{
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                    }}
                    onClick={() => {
                      switchProfile(profile.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs flex-shrink-0"
                        style={{
                          background: isActive ? '#c8ff00' : 'var(--bg-card)',
                          color: isActive ? '#0a0a0a' : 'var(--text-secondary)',
                        }}
                      >
                        {getInitials(profile.name)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-heading font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {profile.name}
                        </p>
                        <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text-tertiary)' }}>
                          {profile.course} · {profile.university}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateProfile(profile.id);
                        }}
                        title="Duplicate Profile"
                        className="p-1 opacity-60 hover:opacity-100"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileToEdit(profile);
                          setIsProfileModalOpen(true);
                          setIsOpen(false);
                        }}
                        title="Edit Profile"
                        className="p-1 opacity-60 hover:opacity-100"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {profiles.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfileToDelete(profile);
                            setIsOpen(false);
                          }}
                          title="Delete Profile"
                          className="p-1 text-red-400 opacity-60 hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileToEdit={profileToEdit}
      />

      {profileToDelete && (
        <ConfirmDialog
          open={Boolean(profileToDelete)}
          title="Delete Profile"
          message={`Are you sure you want to delete profile "${profileToDelete.name}"? All associated semesters and subjects for this profile will be permanently removed.`}
          confirmLabel="Delete Profile"
          variant="danger"
          onConfirm={() => {
            deleteProfile(profileToDelete.id);
            setProfileToDelete(null);
          }}
          onCancel={() => setProfileToDelete(null)}
        />
      )}
    </div>
  );
}
