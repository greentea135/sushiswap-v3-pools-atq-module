import fetch from "node-fetch";
import { ContractTag, ITagService } from "atq-types";

// Subgraph URLs for various chains
const SUBGRAPH_URLS: Record<string, { decentralized: string }> = {
  // Ethereum Mainnet, verifieable on https://docs.sushi.com/subgraphs/clamm
  "1": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/5nnoU1nUFeWqtXgbpC54L9PWdpgo7Y9HYinR3uTMsfzs",
  },
  // Optimism, verifieable on https://docs.sushi.com/subgraphs/clamm
  "10": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Dr3FkshPgTMMDwxckz3oZdwLxaPcbzZuAbE92i6arYtJ",
  },
  // BSC, verifieable on https://docs.sushi.com/subgraphs/clamm
  "56": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/FiJDXMFCBv88GP17g2TtPh8BcA8jZozn5WRW7hCN7cUT",
  },
  // Gnosis, verifieable on https://docs.sushi.com/subgraphs/clamm
  "100": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/GFvGfWBX47RNnvgwL6SjAAf2mrqrPxF91eA53F4eNegW",
  },
  // Fuse, verifieable on https://docs.sushi.com/subgraphs/clamm
  "122": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/8P62wYTJvhd6Aas656hVYhsccsGo2ihrJShaEnCoLJRK",
  },
  // Polygon, verifieable on https://docs.sushi.com/subgraphs/clamm
  "137": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/CqLnQY1d6DLcBYu7aZvGmt17LoNdTe4fDYnGbE2EgotR",
  },
  // Sonic, verifieable on https://docs.sushi.com/subgraphs/clamm
  "146": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/5ijXw9MafwFkXgoHmUiWsWHvRyYAL3RD4smnmBLmNPnw",
  },
  // Fantom, verifieable on https://docs.sushi.com/subgraphs/clamm
  "250": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/4BzEvR229mwKjneCbJTDM8dsS3rjgoKcXt5C7J1DaUxK",
  },
  // Boba, verifieable on https://docs.sushi.com/subgraphs/clamm
  "288": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/71VWMKCvsWRqrJouxmEQwSEMqqnqiiVYSxTZvzR8PHRx",
  },
  // Polygon zkEVM, verifieable on https://docs.sushi.com/subgraphs/clamm
  "1101": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/E2x2gmtYdm2HX3QXorUBY4KegfGu79Za6TEQYjVrx15c",
  },
  // Moonriver, verifieable on https://docs.sushi.com/subgraphs/clamm
  "1285": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/F46W9YVQXGism5iN9NZNhKm2DQCvjhr4u847rL1tRebS",
  },
  // Base, verifieable on https://docs.sushi.com/subgraphs/clamm
  "8453": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Cz4Snpih41NNNPZcbj1gd3fYXPwFr5q92iWMoZjCarEb",
  },
  // Arbitrum One, verifieable on https://docs.sushi.com/subgraphs/clamm
  "42161": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/96EYD64NqmnFxMELu2QLWB95gqCmA9N96ssYsZfFiYHg",
  },
  // Hemi, verifieable on https://docs.sushi.com/subgraphs/clamm
  "43111": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/GQU44ZBv8NpiBUxA6eLSDSdd7bs6TVop9dASKzrdirUv",
  },
  // Avalanche C-Chain, verifieable on https://docs.sushi.com/subgraphs/clamm
  "43114": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/4BxsTB5ADnYdgJgdmzyddmnDGCauctDia28uxB1hgTBE",
  },
  // Scroll, verifieable on https://docs.sushi.com/subgraphs/clamm
  "534352": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/5gyhoHx768oHn3GxsHsEc7oKFMPFg9AH8ud1dY8EirRc",
  },
  // Linea, verifieable on https://docs.sushi.com/subgraphs/clamm
  "59144": {
    decentralized:
      "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/E2vqqvSzDdUiPP1r7PFnPKZQ34pAhNZjc6rEcdj3uE5t",
  },
};

// The Graph API queries and types
interface PoolToken {
  id: string;
  name: string;
  symbol: string;
}

interface Pool {
  id: string;
  createdAtTimestamp: number;
  token0: PoolToken;
  token1: PoolToken;
}

interface GraphQLData {
  pools: Pool[];
}

interface GraphQLResponse {
  data?: GraphQLData;
  errors?: { message: string }[]; // Assuming the API might return errors in this format
}

// Defining headers for the query
const headers: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const GET_POOLS_QUERY = `
query GetPools($lastTimestamp: Int) {
  pools(
    first: 1000,
    orderBy: createdAtTimestamp,
    orderDirection: asc,
    where: { createdAtTimestamp_gt: $lastTimestamp }
  ) {
    id
    createdAtTimestamp
    token0 {
      id
      name
      symbol
    }
    token1 {
      id
      name
      symbol
    }
  }
}
`;

function isError(e: unknown): e is Error {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as Error).message === "string"
  );
}

function containsHtmlOrMarkdown(text: string): boolean {
  // Simple HTML tag detection
  return /<[^>]*>/.test(text);
}

function isEmptyOrInvalid(text: string): boolean {
  return text.trim() === "" || containsHtmlOrMarkdown(text);
}

async function fetchData(
  subgraphUrl: string,
  lastTimestamp: number
): Promise<Pool[]> {
  const response = await fetch(subgraphUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: GET_POOLS_QUERY,
      variables: { lastTimestamp },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = (await response.json()) as GraphQLResponse;
  if (result.errors) {
    result.errors.forEach((error) => {
      console.error(`GraphQL error: ${error.message}`);
    });
    throw new Error("GraphQL errors occurred: see logs for details.");
  }

  if (!result.data || !result.data.pools) {
    throw new Error("No pools data found.");
  }

  return result.data.pools;
}

function prepareUrl(chainId: string, apiKey: string): string {
  const urls = SUBGRAPH_URLS[chainId];
  if (!urls || isNaN(Number(chainId))) {
    const supportedChainIds = Object.keys(SUBGRAPH_URLS).join(", ");
    throw new Error(
      `Unsupported or invalid Chain ID provided: ${chainId}. Only the following values are accepted: ${supportedChainIds}`
    );
  }
  return urls.decentralized.replace("[api-key]", encodeURIComponent(apiKey));
}

function truncateString(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "..."; // Subtract 3 for the ellipsis
  }
  return text;
}

function transformPoolsToTags(chainId: string, pools: Pool[]): ContractTag[] {
  const validPools: Pool[] = [];
  const rejectedNames: string[] = [];

  pools.forEach((pool) => {
    const token0Invalid = isEmptyOrInvalid(pool.token0.name) || isEmptyOrInvalid(pool.token0.symbol);
    const token1Invalid = isEmptyOrInvalid(pool.token1.name) || isEmptyOrInvalid(pool.token1.symbol);

    if (token0Invalid || token1Invalid) {
      // Reject pools where any of the token names or symbols are empty or contain invalid content
      if (token0Invalid) {
        rejectedNames.push(`Contract: ${pool.id} rejected due to invalid token symbol/name - Token0: ${pool.token0.name}, Symbol: ${pool.token0.symbol}`);
      }
      if (token1Invalid) {
        rejectedNames.push(`Contract: ${pool.id} rejected due to invalid token symbol/name - Token1: ${pool.token1.name}, Symbol: ${pool.token1.symbol}`);
      }
    } else {
      validPools.push(pool);
    }
  });

  if (rejectedNames.length > 0) {
    console.log("Rejected contracts:", rejectedNames);
  }

  return validPools.map((pool) => {
    const maxSymbolsLength = 45;
    const symbolsText = `${pool.token0.symbol}/${pool.token1.symbol}`;
    const truncatedSymbolsText = truncateString(symbolsText, maxSymbolsLength);

    return {
      "Contract Address": `eip155:${chainId}:${pool.id}`,
      "Public Name Tag": `${truncatedSymbolsText} Pool`,
      "Project Name": "Sushi v3",
      "UI/Website Link": "https://www.sushi.com/",
      "Public Note": `The liquidity pool contract on Sushi v3 for the ${pool.token0.name} (${pool.token0.symbol}) / ${pool.token1.name} (${pool.token1.symbol}) pair.`,
    };
  });
}

// The main logic for this module
class TagService implements ITagService {
  // Using an arrow function for returnTags
  returnTags = async (
    chainId: string,
    apiKey: string
  ): Promise<ContractTag[]> => {
    let lastTimestamp: number = 0;
    let allTags: ContractTag[] = [];
    let isMore = true;

    const url = prepareUrl(chainId, apiKey);

    while (isMore) {
      try {
        const pools = await fetchData(url, lastTimestamp);
        allTags.push(...transformPoolsToTags(chainId, pools));

        isMore = pools.length === 1000;
        if (isMore) {
          lastTimestamp = parseInt(
            pools[pools.length - 1].createdAtTimestamp.toString(),
            10
          );
        }
      } catch (error) {
        if (isError(error)) {
          console.error(`An error occurred: ${error.message}`);
          throw new Error(`Failed fetching data: ${error}`); // Propagate a new error with more context
        } else {
          console.error("An unknown error occurred.");
          throw new Error("An unknown error occurred during fetch operation."); // Throw with a generic error message if the error type is unknown
        }
      }
    }
    return allTags;
  };
}

// Creating an instance of TagService
const tagService = new TagService();

// Exporting the returnTags method directly
export const returnTags = tagService.returnTags;

