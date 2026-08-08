import { useEffect, useState } from "react";

import "./Categories.css";
import { getAllServices } from "../../api/servicesApi";

function formatCategory(category) {
    return category
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function Categories() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        async function loadCategories() {

            try {

                const services = await getAllServices();

                const uniqueCategories = [...new Set(
                    services.map(service => service.category)
                )];

                setCategories(uniqueCategories);

            } catch (error) {

                console.error(error);

            }

        }

        loadCategories();

    }, []);

    return (

        <section className="categories">

            <div className="container">

                <h2 className="section-title">
                    Browse by Category
                </h2>

                <div className="category-grid">

                    {categories.map(category => (

                        <div
                            key={category}
                            className="category-card"
                        >
                            <h3>{formatCategory(category)}</h3>
                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}

export default Categories;