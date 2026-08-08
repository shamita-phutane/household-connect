import "./ServiceCard.css";

function formatCategory(category) {

    return category
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}

function ServiceCard({ service }) {

    return (

        <div className="service-card">

            <img
                src={service.imageUrl}
                alt={service.svcName}
                className="service-image"
            />

            <div className="service-content">

                <span className="service-category">

                    {formatCategory(service.category)}

                </span>

                <h3>

                    {service.svcName}

                </h3>

                <p>

                    {service.description}

                </p>

                <div className="service-footer">

                    <span>

                        ₹{service.basePrice}

                    </span>

                    <button>

                        Book →

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ServiceCard;