export interface SimulationItem {
  id: string;
  name: string;
  tagline: string;
  category: string;
  specs: string;
  status: 'ready' | 'development' | 'unsupported';
  accentColor: string;
}

export interface HardwareCapability {
  supported: boolean;
  renderer: string;
  vendor: string;
  hasWebGL2: boolean;
}
