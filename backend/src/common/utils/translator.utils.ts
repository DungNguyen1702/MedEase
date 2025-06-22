import { translate } from '@vitalets/google-translate-api';

export async function translateText(text: string): Promise<string> {
  const result = await translate(text, { to: 'en' });
  return typeof result === 'string' ? result : result.text || text;
}
