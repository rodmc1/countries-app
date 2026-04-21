import { SearchIcon, MousePointerClickIcon, EyeIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const steps = [
  {
    icon: SearchIcon,
    title: 'Search',
    description: 'Type a country name in the search box.'
  },
  {
    icon: MousePointerClickIcon,
    title: 'Select',
    description: 'Pick a result from the dropdown list.'
  },
  {
    icon: EyeIcon,
    title: 'Explore',
    description: 'View its flag, coat of arms, currency, and driving side.'
  }
];

export default function Instructions() {
  return (
    <section aria-label="How to use" className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-foreground text-center">How it works</h2>
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="contents">
            <Card size="sm" className="flex flex-col items-center gap-3 py-5 text-center">
              <div className="relative flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                <step.icon className="size-4" />
                <Label className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground shadow-sm">
                  {index + 1}
                </Label>
              </div>
              <div className="flex flex-col gap-1 px-4">
                <p className="text-sm font-semibold text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
