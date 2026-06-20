import React, { useEffect, useState } from 'react';

export interface SavedInputProps {
  storageKey: string;
  label: string;
  placeholder?: string;
}

/**
 * PRIVACY GUARD: This component stores user reflection input strictly on the client side
 * via window.localStorage. It must never be configured to sync or transmit this text
 * to any remote database to ensure absolute user privacy for sensitive thoughts.
 */
export const SavedInput: React.FC<SavedInputProps> = ({
  storageKey,
  label,
  placeholder = '',
}) => {
  const [value, setValue] = useState('');
  const storageName = `ifu:${storageKey}`;

  useEffect(() => {
    try {
      const val = window.localStorage.getItem(storageName);
      setValue(val ?? '');
    } catch (e) {
      console.error('Error reading localStorage for key', storageName, e);
    }
  }, [storageName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    try {
      window.localStorage.setItem(storageName, nextValue);
    } catch (e) {
      console.error('Error writing localStorage for key', storageName, e);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-secondary uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-low/55 p-3 text-base text-on-surface outline-none transition focus:border-secondary focus:bg-white"
      />
    </div>
  );
};

export default SavedInput;
