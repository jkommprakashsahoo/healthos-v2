import React, { useState } from 'react';
import { X, Stethoscope, CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NewAppointmentInput {
  doctorName: string;
  specialty: string;
  isoDate: string;
  time: string;
  location: string;
  notes: string;
}

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: NewAppointmentInput) => Promise<void>;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isoDate, setIsoDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setDoctorName('');
    setSpecialty('');
    setIsoDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!doctorName.trim() || !isoDate) {
      setError('Doctor name and date are required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSave({
        doctorName: doctorName.trim(),
        specialty: specialty.trim(),
        isoDate,
        time,
        location: location.trim(),
        notes: notes.trim(),
      });
      resetForm();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the appointment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Sheet */}
        <motion.div
          id="add-appointment-modal"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Handle */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-10 h-1.2 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EBF3FC] text-[#005FB8] flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Add Doctor Appointment</h3>
            </div>
            <button
              id="close-add-appointment-btn"
              onClick={handleClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 overflow-y-auto space-y-3 text-sm">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Doctor name *
              </label>
              <input
                required
                value={doctorName}
                onChange={(event) => setDoctorName(event.target.value)}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Specialty
              </label>
              <input
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                placeholder="e.g. Cardiologist"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Date *
                </label>
                <input
                  required
                  type="date"
                  value={isoDate}
                  onChange={(event) => setIsoDate(event.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Location
              </label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="e.g. Riverside Clinic, Room 4"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                placeholder="What's this visit for?"
                className="w-full mt-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8]"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
                {error}
              </p>
            )}

            <button
              id="save-appointment-btn"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-[#005FB8] hover:bg-[#004D99] text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <CalendarPlus className="w-4 h-4" />
              {busy ? 'Saving...' : 'Save appointment'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
