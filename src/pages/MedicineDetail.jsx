import { useLocation, useNavigate } from "react-router-dom";

function formatValue(value) {
  if (!value) {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

function MedicineDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const medicine = location.state?.medicine;

  if (!medicine) {
    return (
      <div className="detail-page">
        <div className="detail-empty">
          <h2>Medicine information unavailable</h2>

          <p>
            This medicine was not loaded in the current session.
          </p>

          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  const openFDA = medicine.openfda || {};

  const fields = [
    {
      label: "Brand Name",
      value: openFDA.brand_name,
    },
    {
      label: "Generic Name",
      value: openFDA.generic_name,
    },
    {
      label: "Manufacturer",
      value: openFDA.manufacturer_name,
    },
    {
      label: "Product Type",
      value: openFDA.product_type,
    },
    {
      label: "Route",
      value: openFDA.route,
    },
    {
      label: "Application Number",
      value: openFDA.application_number,
    },
    {
      label: "Product NDC",
      value: openFDA.product_ndc,
    },
    {
      label: "Package NDC",
      value: openFDA.package_ndc,
    },
    {
      label: "Substance Name",
      value: openFDA.substance_name,
    },
    {
      label: "Pharm Classes",
      value: openFDA.pharm_class,
    },
    {
      label: "RxCUI",
      value: openFDA.rxcui,
    },
    {
      label: "UNII",
      value: openFDA.unii,
    },
    {
      label: "SPL Set ID",
      value: openFDA.spl_set_id,
    },
    {
      label: "SPL ID",
      value: openFDA.spl_id,
    },
  ];

  return (
    <main className="detail-page">
      <div className="detail-container">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Search
        </button>

        <div className="detail-header">
          <span className="eyebrow">MEDICINE DETAILS</span>

          <h1>
            {formatValue(openFDA.brand_name)}
          </h1>

          <p>
            {formatValue(openFDA.generic_name)}
          </p>
        </div>

        <div className="details-card">
          <h2>Medicine Information</h2>

          <div className="details-grid">
            {fields.map((field) => (
              <div className="detail-item" key={field.label}>
                <span>{field.label}</span>

                <strong>
                  {formatValue(field.value)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="raw-section">
          <h2>Available openFDA Information</h2>

          <div className="raw-grid">
            {Object.entries(openFDA).map(([key, value]) => (
              <div className="raw-item" key={key}>
                <span>
                  {key.replaceAll("_", " ")}
                </span>

                <p>
                  {formatValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MedicineDetail;