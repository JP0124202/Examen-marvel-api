import { useEffect, useRef, useState } from 'react';

function Autocomplete({
  options = [], // [{ label, value }]
  value, // { label, value } or null
  onChange, // (option) => void
  placeholder = '',
  required = false,
  id
}) {
  const [input, setInput] = useState(value ? value.label : '');
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(options);
  const ref = useRef();

  useEffect(() => {
    setFiltered(
      options.filter((o) =>
        o.label.toLowerCase().includes((input || '').toLowerCase())
      )
    );
  }, [input, options]);

  useEffect(() => {
    setInput(value ? value.label : '');
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSelect = (option) => {
    setInput(option.label);
    setOpen(false);
    onChange && onChange(option);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    setOpen(true);
    // clear selection if user types
    if (!value || e.target.value !== value.label) {
      onChange && onChange(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[0]);
    }
  };

  const handleBlur = () => {
    // if the input text exactly matches an option, accept it, otherwise clear selection
    const match = options.find((o) => o.label.toLowerCase() === (input || '').toLowerCase());
    if (match) {
      handleSelect(match);
    } else {
      onChange && onChange(null);
      setOpen(false);
    }
  };

  return (
    <div className="autocomplete" ref={ref} style={{ position: 'relative' }}>
      <input
        id={id}
        className="autocomplete-input"
        placeholder={placeholder}
        value={input}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        aria-autocomplete="list"
        aria-expanded={open}
        required={required}
      />

      {open && filtered.length > 0 && (
        <div className="autocomplete-list" role="listbox" style={{ position: 'absolute', zIndex: 40, background: 'var(--panel)', border: '1px solid var(--line)', width: '100%', marginTop: '6px', borderRadius: '8px', maxHeight: '220px', overflow: 'auto' }}>
          {filtered.map((opt) => (
            <div
              role="option"
              tabIndex={0}
              key={opt.value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              style={{ padding: '8px 10px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Autocomplete;
