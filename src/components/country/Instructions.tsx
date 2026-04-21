import { Card, CardContent } from '@/components/ui/card';

export default function Instructions() {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
      <CardContent className="flex gap-3 items-start pt-5">
        <span className="text-blue-500 text-xl mt-0.5">&#9432;</span>
        <div className="text-left">
          <h2 className="text-base font-semibold text-blue-800 dark:text-blue-300 mb-1">How to use</h2>
          <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
            Type a country name in the search box below. Select a result from the dropdown to view its official name,
            currency, flag, coat of arms, and driving side.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
