'use client';

/**
 * NFTs Owned Display Card
 *
 * Displays NFTs owned by a wallet address
 * Shows collection grouping, NFT images, metadata
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';

interface NFT {
  tokenId: string;
  name?: string;
  description?: string;
  image?: string;
  collection: string;
  contract: string;
  tokenType: 'ERC721' | 'ERC1155';
  metadata?: any;
}

interface Collection {
  name: string;
  contract: string;
  tokenType: string;
  nfts: NFT[];
}

interface NftsOwnedCardProps {
  address: string;
  chainId: number;
  totalNFTs: number;
  collections: Collection[];
  nfts: NFT[];
}

export function NftsOwnedCard({
  address,
  chainId,
  totalNFTs,
  collections,
  nfts,
}: NftsOwnedCardProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  const toggleCollection = (collectionName: string) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded.has(collectionName)) {
      newExpanded.delete(collectionName);
    } else {
      newExpanded.add(collectionName);
    }
    setExpandedCollections(newExpanded);
  };

  const getChainName = (chainId: number): string => {
    const names: Record<number, string> = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      8453: 'Base',
      84532: 'Base Sepolia',
      42161: 'Arbitrum',
      421614: 'Arbitrum Sepolia',
      10: 'Optimism',
      11155420: 'Optimism Sepolia',
      137: 'Polygon',
      80002: 'Polygon Amoy',
    };
    return names[chainId] || `Chain ${chainId}`;
  };

  const getExplorerUrl = (contractAddress: string, tokenId: string) => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/nft/',
      11155111: 'https://sepolia.etherscan.io/nft/',
      8453: 'https://basescan.org/nft/',
      84532: 'https://sepolia.basescan.org/nft/',
      42161: 'https://arbiscan.io/nft/',
      421614: 'https://sepolia.arbiscan.io/nft/',
      10: 'https://optimistic.etherscan.io/nft/',
      11155420: 'https://sepolia-optimism.etherscan.io/nft/',
      137: 'https://polygonscan.com/nft/',
      80002: 'https://amoy.polygonscan.com/nft/',
    };
    return `${explorers[chainId] || explorers[1]}${contractAddress}/${tokenId}`;
  };

  if (totalNFTs === 0) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">NFTs Owned</CardTitle>
              <CardDescription>No NFTs found</CardDescription>
            </div>
            <Badge variant="outline">{getChainName(chainId)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>This wallet doesn't own any NFTs on {getChainName(chainId)}</p>
            <p className="text-sm mt-2">{shortenAddress(address)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">NFTs Owned</CardTitle>
            <CardDescription>
              {totalNFTs} NFT{totalNFTs !== 1 ? 's' : ''} across {collections.length} collection{collections.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Badge variant="outline">{getChainName(chainId)}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">Wallet</span>
          <span className="text-sm font-mono">{shortenAddress(address)}</span>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          {collections.map((collection) => {
            const isExpanded = expandedCollections.has(collection.name);

            return (
              <div key={collection.contract} className="border rounded-lg overflow-hidden">
                {/* Collection Header */}
                <button
                  onClick={() => toggleCollection(collection.name)}
                  className="w-full p-4 flex items-center justify-between bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-left">{collection.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {collection.nfts.length} item{collection.nfts.length !== 1 ? 's' : ''} • {collection.tokenType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {shortenAddress(collection.contract)}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>

                {/* NFT Grid */}
                {isExpanded && (
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collection.nfts.map((nft) => (
                      <div
                        key={`${nft.contract}-${nft.tokenId}`}
                        className="group relative rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all"
                      >
                        {/* NFT Image */}
                        <div className="aspect-square bg-muted/50 flex items-center justify-center overflow-hidden">
                          {nft.image ? (
                            <img
                              src={nft.image}
                              alt={nft.name || `#${nft.tokenId}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <div className={nft.image ? 'hidden' : ''}>
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        </div>

                        {/* NFT Info */}
                        <div className="p-3 space-y-1">
                          <div className="font-medium text-sm truncate">
                            {nft.name || `#${nft.tokenId}`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Token ID: {nft.tokenId.length > 8 ? `${nft.tokenId.slice(0, 8)}...` : nft.tokenId}
                          </div>

                          {/* Explorer Link */}
                          <a
                            href={getExplorerUrl(nft.contract, nft.tokenId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
