declare module "@tolgee/react" {
  export function useTranslations(): {
    t: (key: string, parameters?: Record<string, any>) => string;
  };

  export function TolgeeProvider(props: {
    config: any;
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }): JSX.Element;
}

declare module "@tolgee/ui" {
  export const InContextTools: React.ComponentType;
}

declare module "@tolgee/core" {
  export class Tolgee {
    constructor(config: any);
  }
}
