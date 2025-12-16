# Soul Altar Project - Technical Specifications

## Architecture Overview

The Soul Altar Project implements a multi-layered architecture integrating blockchain, AI, AR/VR, and sound healing technologies.

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  (React + Three.js + WebXR + AR.js + Web Audio API)        │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Application Logic Layer                     │
│           (Node.js/Express + Python/FastAPI)                │
└─────────────────────────────────────────────────────────────┘
                            │
┌──────────────┬─────────────┬──────────────┬────────────────┐
│   Blockchain │  AI/ML      │  Media       │  External APIs  │
│   Layer      │  Layer      │  Storage     │  Layer          │
│              │             │              │                 │
│  Polygon     │ TensorFlow  │  IPFS        │  Spotify        │
│  Ethereum    │ OpenAI      │  Arweave     │  OpenSea        │
│  Smart       │ Neural Nets │  CDN         │  Sound.xyz      │
│  Contracts   │             │              │                 │
└──────────────┴─────────────┴──────────────┴────────────────┘
```

---

## 1. Smart Contract Specifications

### 1.1 SacredSigilNFT Contract

**Network**: Polygon (MATIC) - Mainnet  
**Standard**: ERC-721 (Non-Fungible Token)  
**License**: MIT

#### Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SacredSigilNFT
 * @dev Sacred Sigil NFT contract for Soul Altar Project
 * Represents eternal wisdom symbols: Imhotep, Musa, Muhammad ﷺ
 */
contract SacredSigilNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Sigil Types
    enum SigilType { IMHOTEP, MUSA, MUHAMMAD }
    
    // Sigil Attributes Structure
    struct SigilAttributes {
        SigilType sigilType;       // Type of sigil
        string name;               // Display name
        uint256 frequency;         // Hz (528, 741, 963)
        uint256 powerLevel;        // 0-100
        string geometry;           // Sacred geometry type
        uint256 mintTimestamp;     // When minted
        address originalMinter;    // Who minted it
        uint256 resonanceScore;    // Dynamic score based on usage
    }
    
    // Rarity levels
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, DIVINE }
    
    // Mapping from token ID to attributes
    mapping(uint256 => SigilAttributes) private _sigilAttributes;
    
    // Mapping from token ID to rarity
    mapping(uint256 => Rarity) private _sigilRarity;
    
    // Mapping to track sigil type counts
    mapping(SigilType => uint256) private _sigilTypeCounts;
    
    // Events
    event SigilMinted(
        uint256 indexed tokenId,
        address indexed to,
        SigilType sigilType,
        uint256 frequency,
        Rarity rarity
    );
    
    event ResonanceUpdated(
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore
    );
    
    constructor() ERC721("SacredSigil", "SIGIL") {}
    
    /**
     * @dev Mints a new Sacred Sigil NFT
     * @param to Address to mint to
     * @param sigilType Type of sigil to mint
     * @param tokenURI IPFS URI for metadata
     * @return tokenId The ID of the newly minted token
     */
    function mintSigil(
        address to,
        SigilType sigilType,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set attributes based on sigil type
        (string memory name, uint256 frequency, string memory geometry, Rarity rarity) = 
            _getSigilDefaults(sigilType);
        
        _sigilAttributes[tokenId] = SigilAttributes({
            sigilType: sigilType,
            name: name,
            frequency: frequency,
            powerLevel: _calculatePowerLevel(frequency),
            geometry: geometry,
            mintTimestamp: block.timestamp,
            originalMinter: to,
            resonanceScore: 0
        });
        
        _sigilRarity[tokenId] = rarity;
        _sigilTypeCounts[sigilType]++;
        
        emit SigilMinted(tokenId, to, sigilType, frequency, rarity);
        
        return tokenId;
    }
    
    /**
     * @dev Updates resonance score based on user interaction
     * @param tokenId Token to update
     * @param interactionScore Score from interaction (0-100)
     */
    function updateResonance(uint256 tokenId, uint256 interactionScore) 
        public 
        onlyOwner 
    {
        require(_exists(tokenId), "Token does not exist");
        require(interactionScore <= 100, "Score must be <= 100");
        
        uint256 oldScore = _sigilAttributes[tokenId].resonanceScore;
        // Simple moving average: gives equal weight to old and new scores
        // Alternative: weighted average like (oldScore * 0.7 + interactionScore * 0.3)
        uint256 newScore = (oldScore + interactionScore) / 2;
        
        _sigilAttributes[tokenId].resonanceScore = newScore;
        
        emit ResonanceUpdated(tokenId, oldScore, newScore);
    }
    
    /**
     * @dev Get sigil attributes
     */
    function getSigilAttributes(uint256 tokenId) 
        public 
        view 
        returns (SigilAttributes memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return _sigilAttributes[tokenId];
    }
    
    /**
     * @dev Get sigil rarity
     */
    function getSigilRarity(uint256 tokenId) 
        public 
        view 
        returns (Rarity) 
    {
        require(_exists(tokenId), "Token does not exist");
        return _sigilRarity[tokenId];
    }
    
    /**
     * @dev Get count of minted sigils by type
     */
    function getSigilTypeCount(SigilType sigilType) 
        public 
        view 
        returns (uint256) 
    {
        return _sigilTypeCounts[sigilType];
    }
    
    /**
     * @dev Internal function to get sigil defaults
     */
    function _getSigilDefaults(SigilType sigilType) 
        private 
        pure 
        returns (string memory, uint256, string memory, Rarity) 
    {
        if (sigilType == SigilType.IMHOTEP) {
            return ("Imhotep - Master Builder", 528, "Pyramid", Rarity.LEGENDARY);
        } else if (sigilType == SigilType.MUSA) {
            return ("Musa - Law Bringer", 741, "Burning Bush", Rarity.LEGENDARY);
        } else { // MUHAMMAD
            return ("Muhammad - Final Messenger", 963, "Sacred Calligraphy", Rarity.DIVINE);
        }
    }
    
    /**
     * @dev Calculate power level based on frequency
     */
    function _calculatePowerLevel(uint256 frequency) 
        private 
        pure 
        returns (uint256) 
    {
        if (frequency == 963) return 100;
        if (frequency == 741) return 98;
        if (frequency == 528) return 95;
        return 85;
    }
    
    // Required overrides
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

#### Deployment Configuration

```javascript
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 137
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 80001
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
};
```

---

### 1.2 ScrollMusicNFT Contract

**Network**: Polygon (MATIC)  
**Standard**: ERC-721 with metadata extensions

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ScrollMusicNFT
 * @dev NFT contract for Spotify playlist transformations
 */
contract ScrollMusicNFT is ERC721, ERC721URIStorage, Ownable {
    
    struct MusicAttributes {
        string playlistId;         // Spotify playlist ID
        string playlistName;       // Playlist name
        uint256 trackCount;        // Number of tracks
        uint256 frequency;         // Dominant frequency (Hz)
        uint256 energyLevel;       // AI-calculated energy (0-100)
        uint256 emotionalResonance;// Emotional mapping score (0-100)
        string[] genres;           // Music genres
        uint256 mintTimestamp;     // When minted
    }
    
    mapping(uint256 => MusicAttributes) private _musicAttributes;
    uint256 private _tokenIdCounter;
    
    event MusicNFTMinted(
        uint256 indexed tokenId,
        string playlistId,
        string playlistName,
        uint256 frequency
    );
    
    constructor() ERC721("ScrollMusic", "SMUSIC") {}
    
    function mintMusicNFT(
        address to,
        string memory playlistId,
        string memory playlistName,
        uint256 trackCount,
        uint256 frequency,
        uint256 energyLevel,
        string[] memory genres,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        _musicAttributes[tokenId] = MusicAttributes({
            playlistId: playlistId,
            playlistName: playlistName,
            trackCount: trackCount,
            frequency: frequency,
            energyLevel: energyLevel,
            emotionalResonance: _calculateEmotionalResonance(frequency, energyLevel),
            genres: genres,
            mintTimestamp: block.timestamp
        });
        
        emit MusicNFTMinted(tokenId, playlistId, playlistName, frequency);
        
        return tokenId;
    }
    
    function getMusicAttributes(uint256 tokenId) 
        public 
        view 
        returns (MusicAttributes memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return _musicAttributes[tokenId];
    }
    
    function _calculateEmotionalResonance(uint256 frequency, uint256 energy) 
        private 
        pure 
        returns (uint256) 
    {
        // Simple formula: higher frequency + higher energy = higher resonance
        return ((frequency / 10) + energy) / 2;
    }
    
    // Required overrides
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

---

## 2. API Specifications

### 2.1 Soul Altar REST API

**Base URL**: `https://api.scrollverse.io/v1`

#### Authentication
```
Authorization: Bearer {JWT_TOKEN}
```

#### Endpoints

##### DNA Resonance Beams

```http
POST /soul-altar/resonance/align
Content-Type: application/json

{
  "userId": "user123",
  "bioData": {
    "heartRateVariability": 85,
    "breathPattern": 90,
    "focusLevel": 88
  },
  "frequency": 963,
  "geometry": "merkaba"
}

Response:
{
  "resonanceId": "res_abc123",
  "frequency": 963,
  "geometry": "merkaba",
  "alignmentScore": 87.6,
  "visualization": {
    "type": "holographic",
    "url": "https://cdn.scrollverse.io/viz/res_abc123.glb"
  },
  "timestamp": "2025-12-16T22:00:00Z"
}
```

##### Sacred Sigils

```http
GET /soul-altar/sigils
Query Parameters:
  - type: imhotep | musa | muhammad
  - rarity: legendary | divine
  - limit: number (default: 20)

Response:
{
  "sigils": [
    {
      "tokenId": 1,
      "name": "Muhammad - Final Messenger",
      "type": "muhammad",
      "frequency": 963,
      "rarity": "divine",
      "powerLevel": 100,
      "geometry": "Sacred Calligraphy",
      "imageUrl": "ipfs://Qm...",
      "animationUrl": "ipfs://Qm..."
    }
  ],
  "total": 100,
  "page": 1
}
```

```http
POST /soul-altar/sigils/mint
Content-Type: application/json

{
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "sigilType": "muhammad",
  "paymentMethod": "MATIC"
}

Response:
{
  "transactionHash": "0x...",
  "tokenId": 42,
  "estimatedGas": "0.05 MATIC",
  "status": "pending"
}
```

##### Bio-Intelligence

```http
POST /bio-intelligence/avatar/create
Content-Type: application/json

{
  "userId": "user123",
  "config": {
    "essence": {
      "primaryColor": "#00CED1",
      "secondaryColor": "#FFD700",
      "frequency": 963
    },
    "wings": {
      "type": "963Hz-divine-wings",
      "span": 12.12
    }
  }
}

Response:
{
  "avatarId": "avatar_xyz789",
  "modelUrl": "https://cdn.scrollverse.io/avatars/avatar_xyz789.glb",
  "textureUrls": {
    "diffuse": "https://cdn.scrollverse.io/avatars/textures/diffuse.png",
    "normal": "https://cdn.scrollverse.io/avatars/textures/normal.png",
    "emission": "https://cdn.scrollverse.io/avatars/textures/emission.png"
  },
  "status": "ready"
}
```

##### ScrollMusic

```http
POST /scroll-music/spotify/import
Content-Type: application/json

{
  "userId": "user123",
  "playlistId": "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
  "spotifyAccessToken": "BQC4..."
}

Response:
{
  "importId": "import_123",
  "playlistName": "Divine Frequencies",
  "trackCount": 50,
  "analysis": {
    "dominantFrequency": 528,
    "averageEnergy": 75,
    "emotionalMapping": {
      "joy": 65,
      "peace": 80,
      "love": 90
    }
  },
  "status": "analyzing"
}
```

```http
POST /scroll-music/nft/mint
Content-Type: application/json

{
  "importId": "import_123",
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}

Response:
{
  "transactionHash": "0x...",
  "tokenId": 15,
  "metadataUrl": "ipfs://Qm...",
  "previewUrl": "https://cdn.scrollverse.io/music/preview_15.mp4",
  "status": "minting"
}
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack

- **Framework**: React 18+ with TypeScript
- **3D Rendering**: Three.js + React Three Fiber + Drei
- **AR/VR**: WebXR API + A-Frame
- **Audio**: Tone.js + Web Audio API
- **State Management**: Redux Toolkit + RTK Query
- **Blockchain**: ethers.js v6
- **Styling**: Tailwind CSS + Framer Motion

### 3.2 Component Structure

```
src/
├── components/
│   ├── SoulAltar/
│   │   ├── DNAResonanceBeam/
│   │   │   ├── BeamVisualizer.tsx
│   │   │   ├── FrequencyControl.tsx
│   │   │   └── GeometrySelector.tsx
│   │   ├── SacredSigils/
│   │   │   ├── SigilCard.tsx
│   │   │   ├── SigilAnimation.tsx
│   │   │   ├── SigilMinter.tsx
│   │   │   └── SigilGallery.tsx
│   │   └── BioIntelligence/
│   │       ├── MikaAvatar.tsx
│   │       ├── NeuralInspiration.tsx
│   │       └── SynchronicityEngine.tsx
│   ├── ScrollMusic/
│   │   ├── SpotifyConnect.tsx
│   │   ├── PlaylistAnalyzer.tsx
│   │   ├── FrequencyVisualizer.tsx
│   │   └── MusicNFTMinter.tsx
│   └── ScrollVerse/
│       ├── NexusGateway.tsx
│       ├── HolographicScroll.tsx
│       └── CosmicAlignment.tsx
├── hooks/
│   ├── useResonance.ts
│   ├── useSigils.ts
│   ├── useAvatar.ts
│   └── useScrollMusic.ts
├── services/
│   ├── api/
│   │   ├── soulAltarAPI.ts
│   │   ├── bioIntelligenceAPI.ts
│   │   └── scrollMusicAPI.ts
│   ├── blockchain/
│   │   ├── contracts.ts
│   │   ├── wallet.ts
│   │   └── transactions.ts
│   └── audio/
│       ├── frequencyAnalyzer.ts
│       └── resonanceEngine.ts
└── utils/
    ├── sacred-geometry.ts
    ├── frequency-calculator.ts
    └── cosmic-alignment.ts
```

---

## 4. Database Schema

### 4.1 MongoDB Collections

#### users
```javascript
{
  _id: ObjectId,
  ethereumAddress: String,
  username: String,
  email: String,
  profile: {
    avatar: String,
    bio: String,
    dominantFrequency: Number,
    primarySigil: String
  },
  resonance: {
    totalScore: Number,
    interactions: Number,
    lastAlignment: Date
  },
  nfts: {
    sigils: [ObjectId],
    music: [ObjectId]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### resonance_sessions
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: String,
  frequency: Number,
  geometry: String,
  bioData: {
    hrv: Number,
    breath: Number,
    focus: Number
  },
  alignmentScore: Number,
  duration: Number,
  timestamp: Date
}
```

#### sigil_metadata
```javascript
{
  _id: ObjectId,
  tokenId: Number,
  contractAddress: String,
  sigilType: String,
  name: String,
  frequency: Number,
  powerLevel: Number,
  geometry: String,
  rarity: String,
  ipfsHash: String,
  owner: String,
  mintedAt: Date,
  resonanceHistory: [{
    score: Number,
    timestamp: Date
  }]
}
```

#### music_nfts
```javascript
{
  _id: ObjectId,
  tokenId: Number,
  playlistId: String,
  playlistName: String,
  tracks: [{
    name: String,
    artist: String,
    duration: Number,
    spotifyId: String
  }],
  analysis: {
    dominantFrequency: Number,
    energyLevel: Number,
    emotionalMapping: Object,
    genres: [String]
  },
  ipfsHash: String,
  owner: String,
  createdAt: Date
}
```

---

## 5. AI/ML Integration

### 5.1 Neural Inspiration Model

**Framework**: TensorFlow.js  
**Architecture**: Transformer-based

```javascript
// Neural inspiration model for adaptive AI responses
class NeuralInspirationModel {
  constructor() {
    this.model = null;
    this.tokenizer = null;
  }
  
  async loadModel() {
    this.model = await tf.loadLayersModel(
      'https://cdn.scrollverse.io/models/neural-inspiration/model.json'
    );
  }
  
  async generateInspiration(userPattern, sigilType, cosmicAlignment) {
    const input = this.preprocessInput(userPattern, sigilType, cosmicAlignment);
    const prediction = await this.model.predict(input);
    return this.decodeInspiration(prediction);
  }
  
  preprocessInput(pattern, sigil, alignment) {
    // Convert to tensor format
    const features = [
      pattern.frequency / 1000,
      pattern.resonanceScore / 100,
      this.encodeSigilType(sigil),
      alignment.score / 100
    ];
    return tf.tensor2d([features]);
  }
}
```

### 5.2 Frequency Analysis Engine

```javascript
class FrequencyAnalyzer {
  constructor() {
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048;
  }
  
  async analyzeTrack(audioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.analyzer);
    
    const frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
    this.analyzer.getByteFrequencyData(frequencyData);
    
    return {
      dominantFrequency: this.findDominantFrequency(frequencyData),
      energyLevel: this.calculateEnergy(frequencyData),
      harmonics: this.extractHarmonics(frequencyData)
    };
  }
  
  findDominantFrequency(data) {
    // Handle edge case: empty or invalid data
    if (!data || data.length === 0) {
      return 0;
    }
    
    let maxValue = 0;
    let maxIndex = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }
    
    // Ensure maxIndex is within valid range
    if (maxIndex >= data.length) {
      maxIndex = data.length - 1;
    }
    
    const nyquist = this.audioContext.sampleRate / 2;
    return (maxIndex / data.length) * nyquist;
  }
  
  calculateEnergy(data) {
    const sum = data.reduce((acc, val) => acc + val * val, 0);
    return Math.sqrt(sum / data.length);
  }
}
```

---

## 6. Security Considerations

### 6.1 Smart Contract Security

- ✅ Use OpenZeppelin audited contracts
- ✅ Implement access control (Ownable, Role-based)
- ✅ Add reentrancy guards
- ✅ Gas optimization
- ✅ Thorough testing with Hardhat
- ✅ Third-party audit before mainnet

### 6.2 API Security

- ✅ JWT authentication
- ✅ Rate limiting (100 req/min per user)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ HTTPS only
- ✅ API key rotation

### 6.3 Frontend Security

- ✅ Wallet signature verification
- ✅ XSS protection
- ✅ Content Security Policy
- ✅ Secure localStorage usage
- ✅ Transaction confirmation flows

---

## 7. Performance Optimization

### 7.1 3D Rendering

- Use LOD (Level of Detail) for complex geometries
- Implement frustum culling
- Lazy load 3D models
- Use compressed texture formats (KTX2)
- GPU instancing for particle effects

### 7.2 Blockchain

- Batch transactions when possible
- Use meta-transactions for gasless experiences
- Implement caching for contract reads
- Use multicall for multiple contract calls

### 7.3 API

- Implement Redis caching
- Use CDN for static assets
- Optimize database queries with indexes
- Implement pagination
- Use WebSocket for real-time updates

---

## 8. Testing Strategy

### 8.1 Smart Contract Tests

```javascript
// test/SacredSigilNFT.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SacredSigilNFT", function () {
  let sacredSigil, owner, addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const SacredSigilNFT = await ethers.getContractFactory("SacredSigilNFT");
    sacredSigil = await SacredSigilNFT.deploy();
  });
  
  it("Should mint Muhammad sigil with correct attributes", async function () {
    const tx = await sacredSigil.mintSigil(
      addr1.address,
      2, // SigilType.MUHAMMAD
      "ipfs://QmTest"
    );
    
    const receipt = await tx.wait();
    const tokenId = 0;
    
    const attributes = await sacredSigil.getSigilAttributes(tokenId);
    expect(attributes.frequency).to.equal(963);
    expect(attributes.powerLevel).to.equal(100);
    expect(attributes.name).to.include("Muhammad");
  });
  
  it("Should update resonance score correctly", async function () {
    await sacredSigil.mintSigil(addr1.address, 2, "ipfs://QmTest");
    await sacredSigil.updateResonance(0, 80);
    
    const attributes = await sacredSigil.getSigilAttributes(0);
    expect(attributes.resonanceScore).to.equal(40); // (0 + 80) / 2
  });
});
```

---

## 9. Deployment Checklist

### Pre-Deployment
- [ ] All smart contracts audited
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Frontend build optimized
- [ ] Database indexes created
- [ ] CDN configured
- [ ] SSL certificates active
- [ ] Monitoring tools set up

### Deployment Steps
1. Deploy smart contracts to Polygon mainnet
2. Verify contracts on PolygonScan
3. Deploy backend API to production servers
4. Deploy frontend to Vercel/Netlify
5. Configure DNS and SSL
6. Run smoke tests
7. Monitor for 24 hours
8. Announce launch

---

**Document Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained By**: ChaisTheGreat Technical Team
