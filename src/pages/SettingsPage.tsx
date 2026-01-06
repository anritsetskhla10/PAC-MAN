import { SettingsPanel } from '../components/SettingsPanel';

export const SettingsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] pt-20 pb-10">
      <h2 className="text-2xl font-bold mb-8 text-text-main">Preferences</h2>
      <SettingsPanel />
    </div>
  );
};