import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MedicineCard from "../components/MedicineCard";
import useDebounce from "../hooks/useDebounce";
import { searchMedicines } from "../services/medicineApi";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();

    if (!trimmedQuery) {
      setMedicines([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchMedicines() {
      try {
        setLoading(true);
        setError("");

        const results = await searchMedicines(
          trimmedQuery,
          controller.signal
        );

        setMedicines(results);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setMedicines([]);
        setError(
          "Unable to fetch medicines. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMedicines();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const hasSearched = debouncedQuery.trim().length > 0;

  return (
    <main className="search-page">
      <section className="search-hero">
        <h1>Medicine Directory</h1>

        <p>
          Search the FDA database for drug labels,
          indications, and active ingredients.
        </p>

        <SearchBar
          value={query}
          onChange={setQuery}
        />
      </section>

      <section className="results-section">
        {loading && (
          <div className="state-container">
            <div className="spinner"></div>

            <p className="state-message">
              Searching medicines...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="state-container">
            <div className="state-icon error-icon">
              !
            </div>

            <h2>Something went wrong</h2>

            <p className="state-message">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          hasSearched &&
          medicines.length === 0 && (
            <div className="state-container">
              <div className="state-icon">
                ⌕
              </div>

              <h2>No results found</h2>

              <p className="state-message">
                No medicines were found for "{debouncedQuery}".
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          medicines.length > 0 && (
            <>
              <div className="results-heading">
                <h2>Search Results</h2>

                <span>
                  {medicines.length} medicines found
                </span>
              </div>

              <div className="medicine-grid">
                {medicines.map((medicine, index) => (
                  <MedicineCard
                    key={`${medicine.openfda?.brand_name?.[0] || "medicine"}-${index}`}
                    medicine={medicine}
                    index={index}
                    query={debouncedQuery}
                  />
                ))}
              </div>
            </>
          )}
      </section>
    </main>
  );
}

export default SearchPage;