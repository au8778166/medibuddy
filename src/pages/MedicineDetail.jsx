import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchMedicines } from "../services/medicineApi";

function formatValue(value) {
  if (!value || value.length === 0) {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

function MedicineDetail() {
  const { query, index } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMedicine() {
      try {
        setLoading(true);
        setError("");

        const decodedQuery = decodeURIComponent(query);

        const results = await searchMedicines(
          decodedQuery,
          controller.signal
        );

        const selectedMedicine = results[Number(index)];

        if (!selectedMedicine) {
          setError(
            "Medicine information could not be found."
          );
          return;
        }

        setMedicine(selectedMedicine);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setError(
          "Unable to load medicine information."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMedicine();

    return () => {
      controller.abort();
    };
  }, [query, index]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="state-container">
          <div className="spinner"></div>

          <p className="state-message">
            Loading medicine...
          </p>
        </div>
      </main>
    );
  }

  if (error || !medicine) {
    return (
      <main className="detail-page">
        <div className="detail-container">
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Search
          </button>

          <div className="state-container">
            <div className="state-icon error-icon">
              !
            </div>

            <h2>Medicine unavailable</h2>

            <p className="state-message">
              {error ||
                "Medicine information is unavailable."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const openFDA = medicine.openfda || {};

  return (
    <main className="detail-page">
      <div className="detail-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Search
        </button>

        <section className="detail-header">
          <span className="eyebrow">
            MEDICINE DETAILS
          </span>

          <h1>
            {formatValue(openFDA.brand_name)}
          </h1>

          <p>
            {formatValue(openFDA.generic_name)}
          </p>
        </section>

        <section className="details-card">
          <h2>Medicine Information</h2>

          <div className="details-grid">
            {Object.entries(openFDA).map(
              ([key, value]) => (
                <div
                  className="detail-item"
                  key={key}
                >
                  <span>
                    {key
                      .replaceAll("_", " ")
                      .replace(/\b\w/g, (letter) =>
                        letter.toUpperCase()
                      )}
                  </span>

                  <strong>
                    {formatValue(value)}
                  </strong>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default MedicineDetail;