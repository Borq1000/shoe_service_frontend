import HomeBanner from "@/components/HomeBanner";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import ServiceHome from "@/components/ServiceHome";
import Faq from "@/components/Faq";

// Определяем тип данных для услуги
type Service = {
  id: number;
  name: string;
};

const Home = () => {
  return (
    <>
      <HomeBanner />
      <ServiceHome />
      <Features />
      <Testimonials />
      <Faq />
    </>
  );
};

export default Home;
