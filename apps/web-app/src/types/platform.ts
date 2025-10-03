export interface PlatformHighlight {
  title: string;
  description: string;
  metric: string;
}

export interface PlatformMetrics {
  highlights: PlatformHighlight[];
}
