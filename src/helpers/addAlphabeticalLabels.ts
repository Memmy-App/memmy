import { CommunityView } from 'lemmy-js-client';

export const addAlphabeticalLabels = (
  input: CommunityView[],
): Array<CommunityView | string> => {
  const output: Array<CommunityView | string> = [];

  let lastCharCode: number | null = null;

  for (let i = 0; i < input.length; i++) {
    const item = input[i];

    const firstCharCode = item.community.name.charCodeAt(0);

    if (lastCharCode == null || firstCharCode > lastCharCode) {
      output.push(item.community.name.charAt(0).toUpperCase());
    }

    output.push(item);

    lastCharCode = firstCharCode;
  }

  return output;
};
