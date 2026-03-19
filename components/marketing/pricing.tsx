import { Check } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";

const plans = [
  { name: "Starter", price: "$29", features: ["10 projects", "Mock export pipeline", "Basic metadata"] },
  { name: "Pro", price: "$99", features: ["Unlimited projects", "Priority processing", "Brand-ready CTA templates"] },
  { name: "Scale", price: "Custom", features: ["Team workflows", "API access", "Auto-posting and brand kits"] }
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Pricing</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Stripe-ready plan structure for future billing.</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={index === 1 ? "border-cyan-400/30 bg-cyan-400/10 shadow-glow" : ""}
          >
            <p className="text-sm text-slate-400">{plan.name}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{plan.price}</p>
            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <Check className="h-4 w-4 text-cyan-300" />
                  {feature}
                </div>
              ))}
            </div>
            <Button className="mt-8 w-full" variant={index === 1 ? "primary" : "secondary"}>
              Choose {plan.name}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
