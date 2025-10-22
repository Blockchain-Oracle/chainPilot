'use client';

/**
 * NFTs Owned Display Card
 *
 * Displays NFTs owned by a wallet address
 * Shows collection grouping, NFT images, metadata
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/validation';
import { NFTImage } from '@/components/ui/optimized-image';

interface NFT {
  contract: string;
  tokenId: string;
  name: string;
  description?: string;
  image?: string;
  collection: string;
  tokenType: string;
}

interface Collection {
  name: string;
  contract: string;
  tokenType: string;
  nfts: NFT[];
}

interface NftsOwnedCardProps {
  result: {
    success: boolean;
    data: {
      address: string;
      chainId: number;
      totalNFTs: number;
      collections: Collection[];
      nfts: NFT[];
    };
  };
}

export function NftsOwnedCard({ result }: NftsOwnedCardProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  // Handle undefined or error results
  if (!result || !result.success || !result.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="vet-glass-card"
      >
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-vet-error">NFT Query Failed</h3>
          <p className="text-sm text-vet-text-secondary mt-1">
            {!result?.success || 'Failed to fetch NFTs'}
          </p>
        </div>
      </motion.div>
    );
  }

  const { address, chainId, totalNFTs, collections = [], nfts = [] } = result.data;

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
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="vet-glass-card"
      >
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-vet-accent">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-vet-text-primary">NFTs Owned</h3>
            </div>
            <Badge variant="outline" className="border-vet-accent/30 text-vet-accent">
              {getChainName(chainId)}
            </Badge>
          </div>
          <p className="text-sm text-vet-text-secondary mt-1">No NFTs found</p>
        </div>
        <div className="px-6 pb-6">
          <div className="text-center py-8 text-vet-text-secondary">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>This wallet doesn't own any NFTs on {getChainName(chainId)}</p>
            <p className="text-sm mt-2">{shortenAddress(address)}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="vet-glass-card"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-vet-accent">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-vet-text-primary">NFTs Owned</h3>
          </div>
          <Badge variant="outline" className="border-vet-accent/30 text-vet-accent">
            {getChainName(chainId)}
          </Badge>
        </div>
        <p className="text-sm text-vet-text-secondary mt-1">
          {totalNFTs} NFT{totalNFTs !== 1 ? 's' : ''} across {collections.length} collection{collections.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        {/* Wallet Address */}
        <div className="vet-tool-card flex justify-between items-center">
          <span className="text-sm text-vet-text-secondary">Wallet</span>
          <span className="text-sm font-mono text-vet-text-primary">{shortenAddress(address)}</span>
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
                  className="w-full p-4 flex items-center justify-between bg-vet-surface/50 hover:bg-vet-surface/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-left text-vet-text-primary">{collection.name}</div>
                      <div className="text-sm text-vet-text-secondary">
                        {collection.nfts.length} item{collection.nfts.length !== 1 ? 's' : ''} • {collection.tokenType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-vet-accent/20 text-vet-accent border-vet-accent/30">
                      {shortenAddress(collection.contract)}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-vet-text-secondary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-vet-text-secondary" />
                    )}
                  </div>
                </button>

                {/* NFT Grid */}
                {isExpanded && (
                  <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collection.nfts.map((nft) => (
                      <div
                        key={`${nft.contract}-${nft.tokenId}`}
                        className="group relative rounded-lg overflow-hidden border border-vet-border bg-vet-surface/30 hover:shadow-lg transition-all cursor-pointer"
                      >
                        {/* NFT Image */}
                        <div className="aspect-square bg-gradient-to-br from-vet-surface/30 to-vet-surface/10 flex items-center justify-center overflow-hidden relative">
                          <NFTImage
                            image={{
                              cachedUrl: nft.image,
                              originalUrl: nft.image,
                            }}
                            alt={nft.name || `#${nft.tokenId}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            fallback={
                              <div className="absolute inset-0 bg-vet-surface/50 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-vet-text-secondary/50" />
                              </div>
                            }
                          />

                          {/* Token Type Badge */}
                          <Badge variant="secondary" className="absolute top-2 right-2 text-xs bg-vet-accent/20 text-vet-accent border-vet-accent/30">
                            {nft.tokenType}
                          </Badge>
                        </div>

                        {/* NFT Info */}
                        <div className="p-3 space-y-1">
                          <div className="font-medium text-sm truncate text-vet-text-primary" title={nft.name}>
                            {nft.name || `#${nft.tokenId}`}
                          </div>

                          {nft.description && (
                            <div className="text-xs text-vet-text-secondary line-clamp-2" title={nft.description}>
                              {nft.description}
                            </div>
                          )}

                          <div className="text-xs text-vet-text-secondary">
                            Token ID: {nft.tokenId.length > 8 ? `${nft.tokenId.slice(0, 8)}...` : nft.tokenId}
                          </div>

                          {/* Explorer Link */}
                          <a
                            href={getExplorerUrl(nft.contract, nft.tokenId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-vet-accent hover:underline mt-2"
                            onClick={(e) => e.stopPropagation()}
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
      </div>
    </motion.div>
  );
}
