import { SettingsPanel } from '../components/SettingsPanel';

export const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h2 className="text-2xl font-bold mb-8 text-text-main">Preferences</h2>
      <SettingsPanel />
    </div>
  );
};