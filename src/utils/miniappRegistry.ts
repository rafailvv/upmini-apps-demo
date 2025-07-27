import type { MiniappConfig } from '../types/miniapp';

class MiniappRegistry {
  private miniapps: Map<string, MiniappConfig> = new Map();

  register(miniapp: MiniappConfig) {
    this.miniapps.set(miniapp.name, miniapp);
  }

  get(name: string): MiniappConfig | undefined {
    return this.miniapps.get(name);
  }

  getAll(): MiniappConfig[] {
    return Array.from(this.miniapps.values());
  }

  exists(name: string): boolean {
    return this.miniapps.has(name);
  }
}

export const miniappRegistry = new MiniappRegistry(); 