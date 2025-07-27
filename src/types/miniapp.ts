export interface MiniappConfig {
  name: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  pages: MiniappPage[];
}

export interface MiniappPage {
  path: string;
  title: string;
  component: React.ComponentType;
}

export interface MiniappRoute {
  path: string;
  element: React.ReactNode;
} 