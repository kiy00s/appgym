import React, { useState } from 'react';
import { X } from 'lucide-react';
import { addCustomExercise } from '../db/storage';
import { MuscleGroup, EquipmentType } from '../types/workout';

const CATEGORIES: MuscleGroup[] = [
  'Klatka',
  'Plecy',
  'Nogi',
  'Barki',
  'Ramiona',
  'Brzuch',
  'Całe ciało',
  'Inne',
];

const EQUIPMENTS: EquipmentType[] = [
  'Sztanga',
  'Hantle',
  'Maszyna',
  'Wyciąg',
  'Masa ciała',
  'Inne',
];

interface NewExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (exerciseId: number) => void;
}

export const NewExerciseModal: React.FC<NewExerciseModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleGroup>('Klatka');
  const [equipment, setEquipment] = useState<EquipmentType>('Sztanga');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Podaj nazwę ćwiczenia');
      return;
    }

    const created = addCustomExercise({
      name: name.trim(),
      category,
      equipment,
      notes: notes.trim() || undefined,
    });

    setName('');
    setNotes('');
    onCreated(created.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#F3F4F6', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Nowe ćwiczenie</h2>
        <div style={{ width: '24px' }}></div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
            Nazwa ćwiczenia *
          </label>
          <input
            type="text"
            required
            placeholder="np. Wyciskanie hantli na skosie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#16181F',
              border: '1px solid #232733',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '15px',
              color: '#F3F4F6',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
            Partia mięśniowa *
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#10B981' : '#16181F',
                    color: isSelected ? '#0D0E12' : '#9CA3AF',
                    border: isSelected ? '1px solid #10B981' : '1px solid #232733',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
            Sprzęt *
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EQUIPMENTS.map((eq) => {
              const isSelected = equipment === eq;
              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setEquipment(eq)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#10B981' : '#16181F',
                    color: isSelected ? '#0D0E12' : '#9CA3AF',
                    border: isSelected ? '1px solid #10B981' : '1px solid #232733',
                    cursor: 'pointer',
                  }}
                >
                  {eq}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#9CA3AF', marginBottom: '8px' }}>
            Wskazówki / notatki (opcjonalnie)
          </label>
          <textarea
            rows={3}
            placeholder="np. Kąt oparcia 30 stopni, chwyt neutralny"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#16181F',
              border: '1px solid #232733',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '14px',
              color: '#F3F4F6',
              outline: 'none',
              resize: 'none',
            }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          Zapisz ćwiczenie
        </button>
      </form>
    </div>
  );
};
