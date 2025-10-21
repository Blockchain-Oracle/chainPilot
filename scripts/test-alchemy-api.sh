#!/bin/bash

# Test Alchemy API endpoints to verify return types and data structure
# This helps us confirm our tool implementations match the actual API responses

ALCHEMY_API_KEY="OlVl0UIl_97VncU6mNI2mNI3w4ne7D0Z"
TEST_ADDRESS="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"  # Vitalik
USDC_ADDRESS="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

echo "================================================================================================="
echo "🧪 Testing Alchemy API Endpoints"
echo "================================================================================================="
echo ""

# ==========================================
# 1. GET NATIVE BALANCE (ETH Balance)
# ==========================================
echo "📊 1. GET NATIVE BALANCE (eth_getBalance)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_getBalance\",
    \"params\": [\"${TEST_ADDRESS}\", \"latest\"],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 2. GET TOKEN BALANCES (alchemy_getTokenBalances)
# ==========================================
echo "📊 2. GET TOKEN BALANCES (alchemy_getTokenBalances)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getTokenBalances\",
    \"params\": [\"${TEST_ADDRESS}\"],
    \"id\": 1
  }" | jq '.result.tokenBalances[0:3]'
echo ""
echo ""

# ==========================================
# 3. GET TOKEN METADATA (alchemy_getTokenMetadata)
# ==========================================
echo "📊 3. GET TOKEN METADATA (alchemy_getTokenMetadata)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getTokenMetadata\",
    \"params\": [\"${USDC_ADDRESS}\"],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 4. GET TOKEN PRICE BY SYMBOL (Alchemy Prices API)
# ==========================================
echo "📊 4. GET TOKEN PRICE BY SYMBOL (Prices API)"
echo "================================================================================================="
curl -s -X GET \
  "https://api.g.alchemy.com/prices/v1/${ALCHEMY_API_KEY}/tokens/by-symbol?symbols=ETH" \
  -H "accept: application/json" | jq '.'
echo ""
echo ""

# ==========================================
# 5. GET TOKEN PRICE BY ADDRESS (Prices API)
# ==========================================
echo "📊 5. GET TOKEN PRICE BY ADDRESS (Prices API)"
echo "================================================================================================="
curl -s -X POST \
  "https://api.g.alchemy.com/prices/v1/${ALCHEMY_API_KEY}/tokens/by-address" \
  -H "accept: application/json" \
  -H "content-type: application/json" \
  -d "{
    \"addresses\": [{
      \"address\": \"${USDC_ADDRESS}\",
      \"network\": \"eth-mainnet\"
    }]
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 6. GET TRANSACTION HISTORY (alchemy_getAssetTransfers)
# ==========================================
echo "📊 6. GET TRANSACTION HISTORY (alchemy_getAssetTransfers)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getAssetTransfers\",
    \"params\": [{
      \"fromBlock\": \"0x0\",
      \"toBlock\": \"latest\",
      \"fromAddress\": \"${TEST_ADDRESS}\",
      \"category\": [\"external\", \"erc20\", \"erc721\", \"erc1155\"],
      \"maxCount\": \"0x5\",
      \"order\": \"desc\"
    }],
    \"id\": 1
  }" | jq '.result.transfers[0:2]'
echo ""
echo ""

# ==========================================
# 7. GET NFTs OWNED (alchemy_getNFTs)
# ==========================================
echo "📊 7. GET NFTs OWNED (alchemy_getNFTs)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"alchemy_getNFTs\",
    \"params\": [{
      \"owner\": \"${TEST_ADDRESS}\",
      \"pageSize\": 3
    }],
    \"id\": 1
  }" | jq '.result.ownedNfts[0:2]'
echo ""
echo ""

# ==========================================
# 8. ESTIMATE GAS (eth_estimateGas)
# ==========================================
echo "📊 8. ESTIMATE GAS (eth_estimateGas)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_estimateGas\",
    \"params\": [{
      \"from\": \"${TEST_ADDRESS}\",
      \"to\": \"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\",
      \"value\": \"0x38D7EA4C68000\"
    }],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 9. GET GAS PRICE (eth_gasPrice + eth_feeHistory)
# ==========================================
echo "📊 9. GET GAS PRICE (eth_gasPrice)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_gasPrice\",
    \"params\": [],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 10. RESOLVE ENS (alchemy_resolveENS)
# ==========================================
echo "📊 10. RESOLVE ENS (eth_call to ENS resolver)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_call\",
    \"params\": [{
      \"to\": \"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e\",
      \"data\": \"0x0178b8bf3cec2c7c8f9b2d5a2bc5ea07e4760821dcfc5723e8eb3b16edd49a8be36a6c92\"
    }, \"latest\"],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 11. GET MAX PRIORITY FEE (eth_maxPriorityFeePerGas)
# ==========================================
echo "📊 11. GET MAX PRIORITY FEE (eth_maxPriorityFeePerGas)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_maxPriorityFeePerGas\",
    \"params\": [],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

# ==========================================
# 12. GET BLOCK NUMBER (eth_blockNumber)
# ==========================================
echo "📊 12. GET BLOCK NUMBER (eth_blockNumber)"
echo "================================================================================================="
curl -s -X POST \
  "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"eth_blockNumber\",
    \"params\": [],
    \"id\": 1
  }" | jq '.'
echo ""
echo ""

echo "================================================================================================="
echo "✅ All API endpoint tests completed!"
echo "================================================================================================="

