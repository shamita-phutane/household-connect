import FeaturedServices from "../../components/home/FeaturedServices";
import Footer from "../../components/common/Footer";

function Services() {
    return (
        <div style={{ background: "var(--background)" }}>
            <div style={{ paddingTop: '20px', minHeight: '80vh' }}>
                <FeaturedServices showAll={true} />
            </div>
            <Footer />
        </div>
    );
}

export default Services;
