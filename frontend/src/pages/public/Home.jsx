import Hero from "../../components/home/Hero";
import FeaturedServices from "../../components/home/FeaturedServices";
import SubscriptionPlans from "../../components/subscription/SubscriptionPlans";
import Footer from "../../components/common/Footer";

function Home() {
    return (
        <>
            <Hero />
            <FeaturedServices />
           <SubscriptionPlans />
           <Footer />
        </>
    );
}

export default Home;