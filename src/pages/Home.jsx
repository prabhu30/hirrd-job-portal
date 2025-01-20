import { Button } from "@/components/ui/button";
import Logo from "/logo.png";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-12 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find Your Dream Job{" "}
          <span className="flex items-center gap-2 sm:gap-6">
            and get{" "}
            <img src={Logo} alt="Hirrd Logo" className="h-14 sm:h-24 lg:h-32" />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-sm sm:text-2xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>

      <div className="flex gap-6 justify-center">
        {/* buttons */}

        <Link to="/jobs">
          <Button variant="blue" size="xl">
            Find a Job
          </Button>
        </Link>

        <Link to="/job/create">
          <Button variant="destructive" size="xl">
            Post a Job{" "}
          </Button>
        </Link>
      </div>

      {/* Carousel */}
      <Carousel plugins={[Autoplay({ delay: 1000 })]} className="w-full py-10">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, path, id }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* banner image */}
      <img
        src="/banner.jpeg"
        alt="happy man with job offer"
        className="w-full rounded"
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-400">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search and apply for jobs, applications, and more</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-400">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post Jobs, manage applications and find the best candidates</p>
          </CardContent>
        </Card>
      </section>

      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => {
          return (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="hover:text-amber-500 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
};

export default Home;
