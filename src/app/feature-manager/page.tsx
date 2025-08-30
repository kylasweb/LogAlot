import React, { useContext } from 'react';
import { FeatureToggleContext } from '../../lib/feature-toggle-context';
import { Switch } from '../../components/ui/switch';

export default function FeatureManagerPage() {
  const { toggles, setToggle } = useContext(FeatureToggleContext);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feature Manager</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">AI Agentic</span>
          <Switch
            checked={toggles.agentic}
            onCheckedChange={(val: boolean) => setToggle('agentic', val)}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Templates in Dashboard</span>
          <Switch
            checked={toggles.templates}
            onCheckedChange={(val: boolean) => setToggle('templates', val)}
          />
        </div>
      </div>
    </div>
  );
}
