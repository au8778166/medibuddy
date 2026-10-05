import { useNavigate } from "react-router-dom";

function getValue(value) {
  if (!value || value.length === 0) {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

function MedicineCard({ medicine, index, query }) {
  const navigate = useNavigate();

  const openFDA = medicine.openfda || {};

  const brandName = getValue(openFDA.brand_name);

  const handleClick = () => {
    navigate(
      `/medicine/${encodeURIComponent(query)}/${index}`
    );
  };

  return (
    <article
      className="medicine-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleClick();
        }
      }}
    >
      <div className="card-header">
        <h2>{brandName}</h2>

        {openFDA.product_type && (
          <span className="badge">
            {getValue(openFDA.product_type)}
          </span>
        )}
      </div>

      <div className="medicine-info">
        <div>
          <span className="label">Generic Name</span>
          <p>{getValue(openFDA.generic_name)}</p>
        </div>

        <div>
          <span className="label">Manufacturer</span>
          <p>{getValue(openFDA.manufacturer_name)}</p>
        </div>

        <div>
          <span className="label">Route</span>
          <p>{getValue(openFDA.route)}</p>
        </div>

        <div>
          <span className="label">Application Number</span>
          <p>{getValue(openFDA.application_number)}</p>
        </div>
      </div>

      <button
        className="view-button"
        onClick={(event) => {
          event.stopPropagation();
          handleClick();
        }}
      >
        View Details →
      </button>
    </article>
  );
}

export default MedicineCard;