export type ProviderType = 'zlib' | 'flibusta';

export interface SearchSelectors extends Record<string, string | Function> {
  entry: string;
  link: string;
  author: string;
  ext: string;
}

export interface SearchConfig {
  host: string;
  path: string;
  query: Record<string, any>;
  searchParam?: string;
  includeCookie?: string;
  selectors: SearchSelectors;
}

export interface BookItem {
  type: ProviderType;
  link: string;
  ext: string;
  authors?: string;
  title?: string;
  translation?: string;
  lang?: string;
  size?: string;
}
