import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ShieldAlert, TriangleAlert, ZapOff, PlugZap, Droplets, HardHat, CircleCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SafetyTip {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const safetyTips: SafetyTip[] = [
  {
    id: "tip1",
    title: "Avoid Water Contact",
    description:
      "Never touch electrical appliances or switches with wet hands. Keep electrical devices away from water sources like sinks, bathtubs, and pools. Water and electricity are a dangerous combination.",
    icon: Droplets,
  },
  {
    id: "tip2",
    title: "Use SON Certified Products",
    description:
      "Always use electrical products certified by the Standards Organisation of Nigeria (SON). Avoid counterfeit or substandard wiring and accessories to prevent hazards.",
    icon: CircleCheck,
  },
  {
    id: "tip3",
    title: "Don't Overload Sockets",
    description:
      "Avoid plugging too many high-power appliances into a single outlet or extension cord. This can cause overheating and lead to a fire. Use power strips with overload protection.",
    icon: PlugZap,
  },
  {
    id: "tip4",
    title: "Turn Off Power When Working",
    description:
      "Always switch off the main power supply at the distribution board before attempting any electrical repairs or installations, no matter how minor they seem.",
    icon: ZapOff,
  },
  {
    id: "tip5",
    title: "Watch for Warning Signs",
    description:
      "Be alert to signs of electrical problems like flickering lights, strange odors, sparking outlets, or frequently tripping breakers. Call a qualified electrician immediately if you notice these.",
    icon: TriangleAlert,
  },
  {
    id: "tip6",
    title: "Hire Qualified Electricians",
    description:
      "For any electrical installations, repairs, or major checks, always hire a licensed and experienced electrician. DIY electrical work can be extremely dangerous.",
    icon: HardHat,
  },
];

export default function SafetyTipsSection() {
  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <ShieldAlert className="mr-3 h-7 w-7 text-destructive" />
          Electrical Safety Tips
        </CardTitle>
        <CardDescription>Important practices to ensure your safety around electricity in Nigeria.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {safetyTips.map((tip) => (
          <Card key={tip.id} className="bg-card hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <tip.icon className="h-8 w-8 text-accent" aria-hidden="true" />
              <CardTitle className="text-lg">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
