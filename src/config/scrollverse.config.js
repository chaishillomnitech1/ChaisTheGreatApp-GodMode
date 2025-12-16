/**
 * ScrollVerse Configuration
 * Central configuration for all Soul Altar components
 * 
 * @module ScrollVerseConfig
 * @version 2.0.0
 */

const ScrollVerseConfig = {
  // DNA Resonance Beams Configuration
  dnaResonance: {
    frequencies: {
      earth: 432,
      love: 528,
      divine: 963
    },
    geometries: [
      'merkaba',
      'flower-of-life',
      'metatrons-cube',
      'sri-yantra',
      'vesica-piscis'
    ],
    bioFeedback: {
      enabled: true,
      metrics: ['hrv', 'breath', 'focus'],
      updateInterval: 1000 // ms
    }
  },

  // Sacred Sigils Configuration
  sacredSigils: {
    types: ['imhotep', 'musa', 'muhammad'],
    imhotep: {
      frequency: 528,
      powerLevel: 95,
      color: '#FFD700',
      maxSupply: 1000
    },
    musa: {
      frequency: 741,
      powerLevel: 98,
      color: '#4169E1',
      maxSupply: 750
    },
    muhammad: {
      frequency: 963,
      powerLevel: 100,
      color: '#00CED1',
      maxSupply: 500
    },
    marketplace: {
      enabled: true,
      baseUrl: 'https://scrollverse.io/marketplace',
      listingFee: '0 MATIC', // Free listing
      royaltyPercentage: 5
    }
  },

  // AR Shrines Configuration
  arShrines: {
    compatibility: {
      minWebXRVersion: '1.0',
      fallbackEnabled: true,
      optimizationLevels: ['low', 'medium', 'high']
    },
    effects: {
      glow: true,
      particles: true,
      soundWaves: true,
      shadows: true
    },
    performance: {
      maxParticles: 100,
      shadowQuality: 'medium',
      textureResolution: 1024
    }
  },

  // VR Avatar Configuration
  vrAvatar: {
    mika: {
      essence: {
        primaryColor: '#00CED1',
        secondaryColor: '#FFD700',
        auraRadius: 7.77,
        frequency: 963
      },
      wings: {
        type: '963Hz-divine-wings',
        span: 12.12,
        layers: 3
      },
      unity: {
        version: '2021.3+',
        renderPipeline: 'URP',
        quality: 'high'
      }
    },
    ai: {
      synchronization: true,
      storytellingMode: 'soul-inspired',
      adaptiveResponses: true,
      emotionalIntelligence: true
    }
  },

  // ScrollMusic Configuration
  scrollMusic: {
    spotify: {
      apiEndpoint: 'https://api.spotify.com/v1',
      scopes: [
        'user-read-playback-state',
        'playlist-read-private',
        'user-library-read'
      ],
      rateLimit: 100 // requests per hour
    },
    nft: {
      mintingFee: 'FREE',
      royaltyPercentage: 2.5,
      maxTracksPerNFT: 100
    },
    analysis: {
      frequencyMapping: {
        432: 'earth',
        528: 'love',
        963: 'divine'
      },
      emotionalCategories: [
        'peace', 'joy', 'love', 'transcendence',
        'unity', 'healing', 'grounding', 'enlightenment'
      ]
    }
  },

  // Blockchain Configuration
  blockchain: {
    network: 'Polygon',
    chainId: 137, // Polygon Mainnet
    testnet: {
      network: 'Mumbai',
      chainId: 80001
    },
    contracts: {
      sacredSigils: {
        address: process.env.SACRED_SIGIL_CONTRACT_ADDRESS || '',
        abi: 'SacredSigilNFT.json'
      },
      scrollMusic: {
        address: process.env.SCROLL_MUSIC_CONTRACT_ADDRESS || '',
        abi: 'ScrollMusicNFT.json'
      }
    },
    rpc: {
      mainnet: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      testnet: process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com'
    },
    explorer: {
      mainnet: 'https://polygonscan.com',
      testnet: 'https://mumbai.polygonscan.com'
    }
  },

  // IPFS Configuration
  ipfs: {
    gateway: 'https://ipfs.io/ipfs/',
    pinningService: {
      provider: 'Pinata',
      apiKey: process.env.PINATA_API_KEY || '',
      apiSecret: process.env.PINATA_API_SECRET || ''
    },
    uploadTimeout: 60000 // ms
  },

  // Cosmic Alignment Configuration
  cosmicAlignment: {
    enabled: true,
    events: {
      newMoon: {
        action: 'launch',
        bonusScore: 10
      },
      fullMoon: {
        action: 'release',
        bonusScore: 15
      },
      solstice: {
        action: 'update',
        bonusScore: 12
      },
      equinox: {
        action: 'update',
        bonusScore: 12
      },
      portalDay: {
        action: 'patch',
        bonusScore: 8
      }
    },
    apiEndpoint: process.env.COSMIC_API_ENDPOINT || '',
    checkInterval: 86400000 // 24 hours in ms
  },

  // ScrollVerse Nexus Gateways
  nexusGateways: {
    entryPortal: {
      enabled: true,
      authentication: 'sacred-sigil',
      accessLevel: 'public'
    },
    resonanceChamber: {
      enabled: true,
      biometricVerification: true,
      accessLevel: 'member'
    },
    transformationVault: {
      enabled: true,
      nftMinting: true,
      accessLevel: 'verified'
    },
    ascensionGateway: {
      enabled: true,
      advancedFeatures: true,
      accessLevel: 'premium'
    }
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.scrollverse.io/v1',
    timeout: 30000, // ms
    retryAttempts: 3,
    endpoints: {
      resonance: '/soul-altar/resonance',
      sigils: '/soul-altar/sigils',
      bioIntelligence: '/bio-intelligence',
      scrollMusic: '/scroll-music',
      cosmicAlignment: '/cosmic/alignment'
    }
  },

  // Security Configuration
  security: {
    jwt: {
      expiresIn: '24h',
      algorithm: 'HS256'
    },
    rateLimit: {
      windowMs: 900000, // 15 minutes
      maxRequests: 100
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://scrollverse.io'],
      credentials: true
    }
  },

  // Feature Flags
  features: {
    dnaResonanceBeams: true,
    sacredSigils: true,
    arShrines: true,
    vrAvatar: true,
    scrollMusic: true,
    bioIntelligence: true,
    cosmicAlignment: true,
    nexusGateways: true
  },

  // Environment
  environment: process.env.NODE_ENV || 'development',
  version: '2.0.0',
  buildNumber: process.env.BUILD_NUMBER || 'local',
  deploymentTimestamp: new Date().toISOString()
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollVerseConfig;
}
