/**
 * Search Utilities for Web3 Research
 * 
 * Provides search functionality using DuckDuckGo scraping (no API keys needed)
 * Adapted from the original Web3 Research MCP
 */

import * as DDG from "duck-duck-scrape";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export interface SearchResult {
  title: string;
  url: string;
  description?: string;
  snippet?: string;
  [key: string]: any;
}

export interface SearchResponse {
  noResults: boolean;
  vqd?: string;
  results: SearchResult[];
  [key: string]: any;
}

/**
 * Perform web search using DuckDuckGo
 */
export async function performSearch(
  query: string,
  type: "web" | "news" | "images" | "videos" = "web",
  retries = 2
): Promise<SearchResponse> {
  try {
    await sleep(3000); // Rate limiting

    let rawResults: any;
    switch (type) {
      case "news":
        rawResults = await DDG.searchNews(query);
        break;
      case "images":
        rawResults = await DDG.searchImages(query);
        break;
      case "videos":
        rawResults = await DDG.searchVideos(query);
        break;
      default:
        rawResults = await DDG.search(query, {
          safeSearch: DDG.SafeSearchType.MODERATE,
        });
    }

    // Normalize results to SearchResponse format
    const results: SearchResponse = {
      noResults: rawResults.noResults || false,
      vqd: rawResults.vqd,
      results: (rawResults.results || []).map((result: any) => ({
        title: result.title || 'No title',
        url: result.url || '#',
        description: result.description || result.snippet || '',
        snippet: result.snippet || result.description || '',
        ...result
      }))
    };

    return results;
  } catch (error) {
    if (retries > 0 && String(error).includes("anomaly")) {
      await sleep(10000);
      return performSearch(query, type, retries - 1);
    }
    throw error;
  }
}

/**
 * Fetch content from a URL
 */
export async function fetchContent(
  url: string,
  format: "text" | "html" | "markdown" | "json" = "text",
  retries = 2
): Promise<string> {
  if (url.startsWith("research://")) {
    throw new Error("Only HTTP(S) protocols are supported");
  }

  for (let i = 0; i <= retries; i++) {
    try {
      await sleep(1000 + Math.random() * 2000);

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          Referer: "https://www.google.com/",
          "Cache-Control": "max-age=0",
          "sec-ch-ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
        },
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const json = await response.json();
        return format === "json"
          ? JSON.stringify(json, null, 2)
          : JSON.stringify(json);
      } else {
        const html = await response.text();

        switch (format) {
          case "html":
            return html;
          case "markdown":
            const $ = cheerio.load(html);
            $("script, style, meta, link, noscript, iframe").remove();
            const title = $("title").text();
            const body = $("body").text().replace(/\s+/g, " ").trim();
            return `# ${title}\n\n${body}`;
          case "text":
          default:
            const $text = cheerio.load(html);
            $text("script, style, meta, link").remove();
            return $text("body").text().replace(/\s+/g, " ").trim();
        }
      }
    } catch (error) {
      if (i < retries) {
        const delay = 3000 * Math.pow(2, i);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }

  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 * Search for a specific source with additional terms
 */
export async function searchSource(
  tokenName: string,
  tokenTicker: string,
  source: string
): Promise<SearchResponse> {
  const extraTerms = ["crypto", "token"];

  switch (source.toLowerCase()) {
    case "coinmarketcap":
      extraTerms.push("price", "market", "chart");
      break;
    case "docs":
      extraTerms.push("documentation", "whitepaper", "github");
      break;
    case "vesting":
      extraTerms.push("tokenomics", "schedule", "unlock");
      break;
    case "raise":
      extraTerms.push("funding", "investment", "ico", "seed");
      break;
    case "news":
      extraTerms.push("latest", "announcement", "update");
      break;
    case "crypto token":
    case "dashboard":
    case "iq wiki":
    case "dune":
      extraTerms.push("dashboard", "crypto", "stats");
      break;
    case "airdrop":
      break;
    default:
  }

  const query = `${tokenName} ${tokenTicker} ${source} ${extraTerms.join(" ")}`;

  if (source.toLowerCase() === "news") {
    return performSearch(query, "news");
  }

  return performSearch(query, "web");
}

/**
 * Search multiple sources
 */
export async function searchMultipleSources(
  tokenName: string,
  tokenTicker: string,
  sources: string[]
): Promise<Record<string, SearchResponse>> {
  const results: Record<string, SearchResponse> = {};

  for (const source of sources) {
    try {
      await sleep(3000);

      const searchResults = await searchSource(tokenName, tokenTicker, source);

      results[source] = {
        ...searchResults,
        query: `${tokenName} ${tokenTicker} ${source}`,
      };
    } catch (error) {
      console.error(`Error searching ${source}:`, error);
      results[source] = { 
        noResults: true, 
        results: [], 
        error: String(error) 
      } as SearchResponse;
    }
  }

  return results;
}

/**
 * Get resource content from research storage
 */
export async function getResourceContent(
  url: string,
  storage: any,
  researchId: string
): Promise<string> {
  if (url.startsWith("research://resource/")) {
    const resourceId = url.replace("research://resource/", "");
    const resource = await storage.getResource(researchId, resourceId);

    if (!resource) {
      throw new Error(`Resource not found: ${resourceId}`);
    }

    return resource.content;
  }

  return fetchContent(url, "markdown");
}
