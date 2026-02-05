import Papa from 'papaparse';

type CsvParseOptions<T> = Omit<Papa.ParseConfig<T>, 'header' | 'download' | 'worker'> & {
  header?: boolean;
};

type FetchCsvOptions = {
  errorPrefix?: string;
};

export const fetchCsvText = async (csvUrl: string, options?: FetchCsvOptions): Promise<string> => {
  const resp = await fetch(csvUrl);
  if (!resp.ok) {
    const prefix = options?.errorPrefix ?? 'fetch failed';
    throw new Error(`${prefix}: ${resp.status}`);
  }
  return resp.text();
};

export const parseCsvRows = <T extends Record<string, any>>(text: string, options?: CsvParseOptions<T>): T[] => {
  const parsed = Papa.parse<T>(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    ...options,
  });
  return parsed.data as T[];
};

export const fetchCsvRows = async <T extends Record<string, any>>(
  csvUrl: string,
  options?: CsvParseOptions<T>,
  fetchOptions?: FetchCsvOptions
): Promise<T[]> => {
  const text = await fetchCsvText(csvUrl, fetchOptions);
  return parseCsvRows<T>(text, options);
};
