import { releases, releaseVersionToNumber } from '~/data/releases';

export const GET = async () => {
  const body = JSON.stringify({
    lychee: {
      version: releaseVersionToNumber(releases[0].version),
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
