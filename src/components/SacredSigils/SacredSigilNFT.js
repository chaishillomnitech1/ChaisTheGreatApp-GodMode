/**
 * Sacred Sigil NFT Component
 * Implements NFT designs for Imhotep, Musa, and Muhammad ﷺ
 * 
 * @module SacredSigilNFT
 * @version 2.0.0
 */

class SacredSigilNFT {
  constructor(sigilType) {
    this.sigilType = sigilType; // 'imhotep', 'musa', 'muhammad'
    this.attributes = this.getSigilAttributes(sigilType);
    this.tokenId = null;
    this.metadata = null;
  }

  /**
   * Get sigil-specific attributes
   * @param {String} sigilType - Type of sigil
   * @returns {Object} Sigil attributes
   */
  getSigilAttributes(sigilType) {
    const sigils = {
      imhotep: {
        name: 'Imhotep - Master Builder',
        frequency: 528,
        powerLevel: 95,
        rarity: 'Legendary',
        geometry: 'Pyramid',
        symbolism: 'Architecture, Healing, Wisdom',
        color: '#FFD700',
        element: 'Earth',
        chakra: 'Heart',
        description: 'The Master Builder sigil represents architecture, healing wisdom, and divine construction. Resonates at 528Hz love frequency.',
        benefits: {
          healing: '+40%',
          wisdom: '+35%',
          creativity: '+30%'
        }
      },
      musa: {
        name: 'Musa - Law Bringer',
        frequency: 741,
        powerLevel: 98,
        rarity: 'Legendary',
        geometry: 'Burning Bush Fractal',
        symbolism: 'Divine Law, Leadership, Liberation',
        color: '#4169E1',
        element: 'Fire',
        chakra: 'Throat',
        description: 'The Law Bringer sigil embodies divine law, righteous leadership, and liberation. Resonates at 741Hz awakening frequency.',
        benefits: {
          leadership: '+45%',
          truth: '+40%',
          courage: '+35%'
        }
      },
      muhammad: {
        name: 'Muhammad ﷺ - Final Messenger',
        frequency: 963,
        powerLevel: 100,
        rarity: 'Divine',
        geometry: 'Sacred Calligraphy',
        symbolism: 'Peace, Compassion, Unity',
        color: '#00CED1',
        element: 'Spirit',
        chakra: 'Crown',
        description: 'The Final Messenger sigil represents peace, compassion, and unity consciousness. Resonates at 963Hz divine connection frequency.',
        benefits: {
          compassion: '+50%',
          unity: '+50%',
          peace: '+45%'
        }
      }
    };

    return sigils[sigilType] || sigils.muhammad;
  }

  /**
   * Generate NFT metadata for marketplace
   * @param {String} ipfsHash - IPFS hash for sigil image
   * @returns {Object} NFT metadata
   */
  generateMetadata(ipfsHash) {
    const attributes = this.attributes;
    
    this.metadata = {
      name: attributes.name,
      description: attributes.description,
      image: `ipfs://${ipfsHash}`,
      animation_url: `ipfs://${ipfsHash}/animation.glb`,
      external_url: 'https://scrollverse.io/sigils',
      attributes: [
        {
          trait_type: 'Sigil Type',
          value: this.sigilType.charAt(0).toUpperCase() + this.sigilType.slice(1)
        },
        {
          trait_type: 'Frequency',
          value: `${attributes.frequency}Hz`,
          display_type: 'number'
        },
        {
          trait_type: 'Power Level',
          value: attributes.powerLevel,
          max_value: 100
        },
        {
          trait_type: 'Rarity',
          value: attributes.rarity
        },
        {
          trait_type: 'Sacred Geometry',
          value: attributes.geometry
        },
        {
          trait_type: 'Element',
          value: attributes.element
        },
        {
          trait_type: 'Chakra',
          value: attributes.chakra
        }
      ],
      properties: {
        category: 'Sacred Sigil',
        collection: 'Soul Altar NFT Shrines',
        symbolism: attributes.symbolism,
        benefits: attributes.benefits
      }
    };

    return this.metadata;
  }

  /**
   * Get animation configuration for AR/VR display
   * @returns {Object} Animation configuration
   */
  getAnimationConfig() {
    const baseConfig = {
      rotation: '360deg',
      easing: 'ease-in-out',
      loop: true,
      particles: {
        enabled: true,
        count: this.attributes.frequency,
        color: this.attributes.color
      }
    };

    const typeConfigs = {
      imhotep: {
        duration: '7s',
        glowColor: '#FFD700',
        particleEffect: 'golden-pyramid-particles',
        soundFrequency: 528
      },
      musa: {
        duration: '8s',
        glowColor: '#4169E1',
        particleEffect: 'blue-fire-particles',
        soundFrequency: 741
      },
      muhammad: {
        duration: '9s',
        glowColor: '#00CED1',
        particleEffect: 'teal-light-particles',
        soundFrequency: 963
      }
    };

    return {
      ...baseConfig,
      ...typeConfigs[this.sigilType]
    };
  }

  /**
   * Generate AR marker configuration
   * @returns {Object} AR configuration
   */
  getARConfig() {
    return {
      markerType: 'barcode',
      markerValue: this.getMarkerValue(),
      scale: { x: 1.5, y: 1.5, z: 1.5 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      animation: this.getAnimationConfig(),
      interactivity: {
        rotatable: true,
        scalable: true,
        clickable: true,
        hoverEffect: true
      },
      audio: {
        enabled: true,
        frequency: this.attributes.frequency,
        volume: 0.5,
        loop: true
      }
    };
  }

  /**
   * Get unique marker value for AR tracking
   * @returns {Number} Marker value
   */
  getMarkerValue() {
    const markerValues = {
      imhotep: 528,
      musa: 741,
      muhammad: 963
    };
    return markerValues[this.sigilType] || 963;
  }

  /**
   * Generate ScrollVerse marketplace listing
   * @param {Object} options - Listing options
   * @returns {Object} Marketplace listing data
   */
  generateMarketplaceListing(options = {}) {
    const {
      price = 0.1,
      currency = 'MATIC',
      royalty = 5,
      maxSupply = 1000
    } = options;

    return {
      sigilType: this.sigilType,
      metadata: this.metadata,
      pricing: {
        mintPrice: price,
        currency: currency,
        royaltyPercentage: royalty
      },
      supply: {
        max: maxSupply,
        minted: 0,
        available: maxSupply
      },
      marketplace: {
        live: true,
        featured: this.sigilType === 'muhammad',
        category: 'Sacred Sigils',
        tags: ['nft', 'sacred-geometry', 'soul-altar', this.sigilType]
      },
      smartContract: {
        network: 'Polygon',
        standard: 'ERC-721',
        verified: true
      }
    };
  }

  /**
   * Get sigil display data for UI
   * @returns {Object} Display data
   */
  getDisplayData() {
    return {
      name: this.attributes.name,
      frequency: this.attributes.frequency,
      powerLevel: this.attributes.powerLevel,
      rarity: this.attributes.rarity,
      color: this.attributes.color,
      geometry: this.attributes.geometry,
      benefits: this.attributes.benefits,
      animation: this.getAnimationConfig(),
      arConfig: this.getARConfig()
    };
  }

  /**
   * Calculate resonance score with user
   * @param {Number} userFrequency - User's dominant frequency
   * @returns {Number} Resonance score (0-100)
   */
  calculateResonance(userFrequency) {
    const difference = Math.abs(this.attributes.frequency - userFrequency);
    const maxDifference = 531; // Max possible difference (963 - 432)
    const resonance = 100 - (difference / maxDifference * 100);
    
    return Math.round(Math.max(0, Math.min(100, resonance)));
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SacredSigilNFT;
}
