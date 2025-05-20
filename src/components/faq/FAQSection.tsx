import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    id: "faq1",
    question: "What's the standard voltage in Nigeria?",
    answer:
      "The standard voltage in Nigeria is 230V with a frequency of 50Hz. However, fluctuations are common, so using voltage stabilizers for sensitive appliances is highly recommended to protect them from damage.",
  },
  {
    id: "faq2",
    question: "Why do my light bulbs burn out frequently?",
    answer:
      "Frequent bulb burnout can be caused by several factors, including: high voltage spikes (common in Nigeria), poor quality bulbs, loose connections in the socket or circuit, or excessive vibrations. Consider using surge protectors and high-quality LED bulbs.",
  },
  {
    id: "faq3",
    question: "Is a UPS the same as a voltage stabilizer?",
    answer:
      "No, they serve different primary functions. A voltage stabilizer (or AVR) regulates inconsistent voltage to provide a stable output. A UPS (Uninterruptible Power Supply) provides backup power during an outage and often includes surge protection and some level of voltage regulation, but its primary role is battery backup.",
  },
  {
    id: "faq4",
    question: "What type of wiring is best for homes in Nigeria?",
    answer:
      "For residential wiring in Nigeria, copper conductors are standard. Ensure you use wires of the correct gauge (thickness) for the load they will carry (e.g., thicker wires for air conditioners, thinner for lighting). Always use SON (Standards Organisation of Nigeria) certified wires from reputable brands.",
  },
  {
    id: "faq5",
    question: "How often should I inspect my electrical installations?",
    answer:
      "It's advisable to have your electrical installations inspected by a qualified electrician at least every 5 years, or more frequently if you notice any issues like flickering lights, tripping breakers, or burning smells. For older properties, more frequent checks are recommended.",
  },
];

export default function FAQSection() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <HelpCircle className="mr-3 h-7 w-7 text-primary" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger className="text-left hover:no-underline text-base font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
