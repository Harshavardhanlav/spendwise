import React, { useState } from 'react';
import { useScreenInit } from '../useScreenInit.js';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { FoundationsSection } from '../components/showcase/FoundationsSection';
import { ComponentsSection } from '../components/showcase/ComponentsSection';
import { PatternsSection } from '../components/showcase/PatternsSection';
import { NavigationSection } from '../components/showcase/NavigationSection';
import { StatesSection } from '../components/showcase/StatesSection';

const tabs = [
{ id: 'foundations', label: 'Foundations' },
{ id: 'components', label: 'Components' },
{ id: 'patterns', label: 'Financial UI' },
{ id: 'navigation', label: 'Navigation' },
{ id: 'states', label: 'States & a11y' }];


export function DesignSystem() {
  const screenInit = useScreenInit();
  const [tab, setTab] = useState(screenInit.tab ?? 'foundations');

  return (
    <div className="flex flex-col gap-7">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent" variant="soft">
            v1.0
          </Badge>
          <Badge tone="neutral" variant="outline">
            Inter · 4px grid · INR
          </Badge>
        </div>
        <h1 className="mt-3 text-title text-ink-900 lg:text-display">The SpendWise design system</h1>
        <p className="mt-2.5 text-body-lg text-ink-600">
          A quiet, dense interface language for a personal finance product. Near-black chrome, a single
          typeface, hairline structure, and colour spent almost entirely on meaning — money in, money out,
          and what you can act on. Nothing here changes the backend, the API surface or the data model.
        </p>
      </header>

      <div className="sticky top-15 z-20 -mx-4 bg-canvas/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Tabs items={tabs} value={tab} onChange={setTab} className="overflow-x-auto scrollbar-slim" />
      </div>

      <div className="pt-1">
        {tab === 'foundations' && <FoundationsSection />}
        {tab === 'components' && <ComponentsSection />}
        {tab === 'patterns' && <PatternsSection />}
        {tab === 'navigation' && <NavigationSection />}
        {tab === 'states' && <StatesSection />}
      </div>
    </div>);

}