function SearchBar({ value, onChange }) {
  return (
    <div className="search-form">
      <span className="search-icon">⌕</span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a medication (e.g. Advil, Tylenol)..."
        aria-label="Search for a medication"
      />
    </div>
  );
}

export default SearchBar;