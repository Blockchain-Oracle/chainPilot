#!/bin/bash

# Test NFT endpoints with addresses that actually own NFTs

ALCHEMY_API_KEY="OlVl0UIl_97VncU6mNI2mNI3w4ne7D0Z"

# Known NFT holder addresses
BAYC_HOLDER="0x8ad272ac86c6c88683d9a60eb8ed57e6c304bb0c"  # Known BAYC holder
CRYPTOPUNK_HOLDER="0xb88f61e6fbda83fbfffabe364112137480398018"  # Known CryptoPunk holder

echo "================================================================================================="
echo "🎨 Testing NFT Endpoints with Real NFT Holders"
echo "================================================================================================="
echo ""

# Test 1: Get NFTs for BAYC holder
echo "📊 1. GET NFTs for BAYC Holder"
echo "Address: $BAYC_HOLDER"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getNFTs\",
    \"params\": [{
      \"owner\": \"${BAYC_HOLDER}\",
      \"pageSize\": 5
    }],
    \"id\": 1
  }" | jq '{totalCount: .result.totalCount, firstNFT: .result.ownedNfts[0]}'
echo ""
echo ""

# Test 2: Get NFTs for CryptoPunk holder
echo "📊 2. GET NFTs for CryptoPunk Holder"
echo "Address: $CRYPTOPUNK_HOLDER"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getNFTs\",
    \"params\": [{
      \"owner\": \"${CRYPTOPUNK_HOLDER}\",
      \"pageSize\": 5
    }],
    \"id\": 1
  }" | jq '{totalCount: .result.totalCount, firstNFT: .result.ownedNfts[0]}'
echo ""
echo ""

# Test 3: Get NFT metadata for specific token
echo "📊 3. GET NFT METADATA (alchemy_getNFTMetadata)"
echo "BAYC #1000"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getNFTMetadata\",
    \"params\": [{
      \"contractAddress\": \"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\",
      \"tokenId\": \"1000\"
    }],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

echo "================================================================================================="
echo "✅ NFT tests completed!"
echo "================================================================================================="

