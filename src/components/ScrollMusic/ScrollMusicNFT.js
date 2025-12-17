/**
 * ScrollMusic NFT Component
 * Implements Spotify playlist to NFT transformation with audio-visual layers
 * 
 * @module ScrollMusicNFT
 * @version 2.0.0
 */

class ScrollMusicNFT {
  constructor() {
    this.playlistData = null;
    this.analysis = null;
    this.nftMetadata = null;
    this.isAnalyzed = false;
  }

  /**
   * Import Spotify playlist
   * @param {String} playlistId - Spotify playlist ID
   * @param {String} accessToken - Spotify access token
   * @returns {Promise<Object>} Import result
   */
  async importSpotifyPlaylist(playlistId, accessToken) {
    console.log('🎵 Importing Spotify playlist...');

    // Simulate Spotify API call
    this.playlistData = {
      id: playlistId,
      name: 'Divine Frequencies',
      description: 'A collection of spiritually aligned music',
      trackCount: 50,
      duration: 3600, // seconds
      tracks: this.generateSampleTracks(),
      owner: 'Mika',
      public: true,
      collaborative: false
    };

    return {
      status: 'imported',
      playlist: {
        id: this.playlistData.id,
        name: this.playlistData.name,
        trackCount: this.playlistData.trackCount,
        duration: this.formatDuration(this.playlistData.duration)
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate sample tracks for demonstration
   * @returns {Array} Sample tracks
   */
  generateSampleTracks() {
    const sampleTracks = [
      { name: 'Divine Awakening', artist: 'Sacred Sounds', duration: 240, frequency: 963 },
      { name: 'Heart Opening', artist: 'Love Frequency', duration: 300, frequency: 528 },
      { name: 'Cosmic Journey', artist: 'Stellar Harmony', duration: 360, frequency: 432 },
      { name: 'Inner Peace', artist: 'Tranquil Waves', duration: 280, frequency: 528 },
      { name: 'Spiritual Elevation', artist: 'Ascension Music', duration: 320, frequency: 963 }
    ];

    // Generate more tracks to reach 50
    const tracks = [];
    for (let i = 0; i < 50; i++) {
      const baseTrack = sampleTracks[i % sampleTracks.length];
      tracks.push({
        ...baseTrack,
        name: `${baseTrack.name} ${i + 1}`,
        spotifyId: `spotify:track:${this.generateRandomId()}`
      });
    }

    return tracks;
  }

  /**
   * Generate random ID
   * @returns {String} Random ID
   */
  generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Format duration in seconds to readable format
   * @param {Number} seconds - Duration in seconds
   * @returns {String} Formatted duration
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  }

  /**
   * Analyze playlist frequencies and energy
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePlaylist() {
    if (!this.playlistData) {
      throw new Error('No playlist data available. Import playlist first.');
    }

    console.log('🔍 Analyzing playlist frequencies and energy...');

    // Analyze tracks
    const frequencyAnalysis = this.analyzeFrequencies();
    const energyAnalysis = this.analyzeEnergy();
    const emotionalAnalysis = this.analyzeEmotionalMapping();
    const genreAnalysis = this.analyzeGenres();

    this.analysis = {
      dominantFrequency: frequencyAnalysis.dominant,
      frequencyDistribution: frequencyAnalysis.distribution,
      averageEnergy: energyAnalysis.average,
      energyRange: energyAnalysis.range,
      emotionalMapping: emotionalAnalysis,
      genres: genreAnalysis,
      cosmicAlignment: this.calculateCosmicAlignment(),
      timestamp: new Date().toISOString()
    };

    this.isAnalyzed = true;

    return this.analysis;
  }

  /**
   * Analyze frequency distribution in tracks
   * @returns {Object} Frequency analysis
   */
  analyzeFrequencies() {
    const tracks = this.playlistData.tracks;
    const frequencies = tracks.map(t => t.frequency);
    
    // Count frequency occurrences
    const distribution = {
      432: frequencies.filter(f => f === 432).length,
      528: frequencies.filter(f => f === 528).length,
      963: frequencies.filter(f => f === 963).length
    };

    // Find dominant frequency
    const dominant = Object.keys(distribution).reduce((a, b) => 
      distribution[a] > distribution[b] ? a : b
    );

    return {
      dominant: parseInt(dominant),
      distribution: distribution,
      total: frequencies.length
    };
  }

  /**
   * Analyze energy levels
   * @returns {Object} Energy analysis
   */
  analyzeEnergy() {
    // Simulate energy calculation based on tempo, intensity
    const energyLevels = this.playlistData.tracks.map(() => 
      Math.floor(Math.random() * 40) + 60 // 60-100 range
    );

    const average = Math.floor(
      energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length
    );

    return {
      average: average,
      range: {
        min: Math.min(...energyLevels),
        max: Math.max(...energyLevels)
      },
      distribution: this.categorizeEnergy(energyLevels)
    };
  }

  /**
   * Categorize energy levels
   * @param {Array} levels - Energy levels
   * @returns {Object} Categorization
   */
  categorizeEnergy(levels) {
    return {
      low: levels.filter(e => e < 70).length,
      medium: levels.filter(e => e >= 70 && e < 85).length,
      high: levels.filter(e => e >= 85).length
    };
  }

  /**
   * Analyze emotional mapping
   * @returns {Object} Emotional analysis
   */
  analyzeEmotionalMapping() {
    // Map frequencies to emotions
    const frequencyEmotions = {
      432: { peace: 80, grounding: 85, calm: 90 },
      528: { love: 90, joy: 80, healing: 85 },
      963: { transcendence: 95, unity: 90, enlightenment: 88 }
    };

    const tracks = this.playlistData.tracks;
    const emotionScores = {
      peace: 0,
      grounding: 0,
      calm: 0,
      love: 0,
      joy: 0,
      healing: 0,
      transcendence: 0,
      unity: 0,
      enlightenment: 0
    };

    // Calculate average emotion scores
    tracks.forEach(track => {
      const emotions = frequencyEmotions[track.frequency];
      if (emotions) {
        Object.keys(emotions).forEach(emotion => {
          emotionScores[emotion] += emotions[emotion];
        });
      }
    });

    // Average the scores
    Object.keys(emotionScores).forEach(emotion => {
      emotionScores[emotion] = Math.floor(emotionScores[emotion] / tracks.length);
    });

    return emotionScores;
  }

  /**
   * Analyze genres
   * @returns {Array} Genres
   */
  analyzeGenres() {
    return [
      'Meditation',
      'Sacred Music',
      'Ambient',
      'New Age',
      'Spiritual',
      'Healing Frequencies'
    ];
  }

  /**
   * Calculate cosmic alignment score
   * @returns {Object} Cosmic alignment
   */
  calculateCosmicAlignment() {
    const moonPhase = this.getCurrentMoonPhase();
    const planetaryAlignment = this.getPlanetaryAlignment();
    
    const baseScore = 75;
    const moonBonus = moonPhase === 'full' ? 15 : moonPhase === 'new' ? 10 : 5;
    const planetaryBonus = planetaryAlignment === 'favorable' ? 10 : 5;
    
    const totalScore = baseScore + moonBonus + planetaryBonus;

    return {
      score: totalScore,
      moonPhase: moonPhase,
      planetaryAlignment: planetaryAlignment,
      optimalMintTime: this.calculateOptimalMintTime(),
      cosmicRecommendation: totalScore >= 90 ? 'Highly Favorable' : 'Favorable'
    };
  }

  /**
   * Get current moon phase (simulated)
   * @returns {String} Moon phase
   */
  getCurrentMoonPhase() {
    const phases = ['new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 
                    'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'];
    const dayOfMonth = new Date().getDate();
    return phases[Math.floor(dayOfMonth / 3.75)];
  }

  /**
   * Get planetary alignment (simulated)
   * @returns {String} Alignment status
   */
  getPlanetaryAlignment() {
    return Math.random() > 0.5 ? 'favorable' : 'neutral';
  }

  /**
   * Calculate optimal mint time
   * @returns {String} Optimal time
   */
  calculateOptimalMintTime() {
    const now = new Date();
    const optimalHour = Math.floor(Math.random() * 4) * 6; // 0, 6, 12, or 18
    const optimal = new Date(now);
    optimal.setHours(optimalHour, 0, 0, 0);
    
    if (optimal < now) {
      optimal.setDate(optimal.getDate() + 1);
    }
    
    return optimal.toISOString();
  }

  /**
   * Generate NFT metadata
   * @param {String} ipfsHash - IPFS hash for audio/visual assets
   * @returns {Object} NFT metadata
   */
  generateNFTMetadata(ipfsHash) {
    if (!this.isAnalyzed) {
      throw new Error('Playlist not analyzed. Run analyzePlaylist() first.');
    }

    this.nftMetadata = {
      name: `ScrollMusic - ${this.playlistData.name}`,
      description: `Sacred musical journey NFT featuring ${this.playlistData.trackCount} tracks aligned with divine frequencies. Dominant frequency: ${this.analysis.dominantFrequency}Hz.`,
      image: `ipfs://${ipfsHash}/cover.png`,
      animation_url: `ipfs://${ipfsHash}/visualization.mp4`,
      external_url: 'https://scrollverse.io/scroll-music',
      attributes: [
        {
          trait_type: 'Playlist Name',
          value: this.playlistData.name
        },
        {
          trait_type: 'Track Count',
          value: this.playlistData.trackCount
        },
        {
          trait_type: 'Total Duration',
          value: this.formatDuration(this.playlistData.duration)
        },
        {
          trait_type: 'Dominant Frequency',
          value: `${this.analysis.dominantFrequency}Hz`
        },
        {
          trait_type: 'Energy Level',
          value: this.analysis.averageEnergy,
          max_value: 100
        },
        {
          trait_type: 'Cosmic Alignment',
          value: this.analysis.cosmicAlignment.score,
          max_value: 100
        }
      ],
      properties: {
        category: 'ScrollMusic NFT',
        collection: 'Divine Frequency Playlists',
        playlistId: this.playlistData.id,
        analysis: this.analysis,
        genres: this.analysis.genres,
        emotionalMapping: this.analysis.emotionalMapping,
        audioLayers: this.generateAudioLayers(),
        visualLayers: this.generateVisualLayers()
      }
    };

    return this.nftMetadata;
  }

  /**
   * Generate audio layers for NFT
   * @returns {Object} Audio layers
   */
  generateAudioLayers() {
    return {
      mainPlaylist: {
        format: 'mp3',
        quality: '320kbps',
        duration: this.playlistData.duration
      },
      frequencyLayer: {
        dominantFrequency: this.analysis.dominantFrequency,
        binaural: true,
        isochronic: true
      },
      ambientLayer: {
        type: 'celestial-soundscape',
        volume: 0.3,
        fadeIn: 3.0,
        fadeOut: 3.0
      },
      guidedMeditation: {
        enabled: false,
        voice: 'ethereal-feminine',
        intervals: []
      }
    };
  }

  /**
   * Generate visual layers for NFT
   * @returns {Object} Visual layers
   */
  generateVisualLayers() {
    const frequency = this.analysis.dominantFrequency;
    const color = this.getFrequencyColor(frequency);

    return {
      background: {
        type: 'cosmic-gradient',
        colors: [color, '#000428', '#004e92'],
        animation: 'slow-rotation'
      },
      waveform: {
        type: 'reactive',
        style: 'circular',
        color: color,
        thickness: 3,
        smoothing: 0.8
      },
      particles: {
        count: frequency,
        color: color,
        motion: 'frequency-reactive',
        size: [1, 3],
        trail: true
      },
      geometry: {
        type: 'sacred',
        pattern: this.getSacredGeometryPattern(frequency),
        rotation: 'auto',
        opacity: 0.5
      },
      text: {
        title: this.playlistData.name,
        subtitle: `${this.analysis.dominantFrequency}Hz Divine Frequency`,
        font: 'Sacred-Geometry-Display',
        color: '#FFFFFF',
        glow: true
      }
    };
  }

  /**
   * Get color for frequency
   * @param {Number} frequency - Frequency in Hz
   * @returns {String} Hex color
   */
  getFrequencyColor(frequency) {
    const colors = {
      432: '#8B4513',
      528: '#FFD700',
      963: '#00CED1'
    };
    return colors[frequency] || '#00CED1';
  }

  /**
   * Get sacred geometry pattern for frequency
   * @param {Number} frequency - Frequency in Hz
   * @returns {String} Pattern name
   */
  getSacredGeometryPattern(frequency) {
    const patterns = {
      432: 'Flower of Life',
      528: 'Metatrons Cube',
      963: 'Merkaba'
    };
    return patterns[frequency] || 'Merkaba';
  }

  /**
   * Create minting transaction data
   * @param {String} recipientAddress - Wallet address
   * @returns {Object} Mint transaction data
   */
  createMintTransaction(recipientAddress) {
    if (!this.nftMetadata) {
      throw new Error('NFT metadata not generated. Run generateNFTMetadata() first.');
    }

    return {
      to: recipientAddress,
      metadata: this.nftMetadata,
      contractAddress: '0x...', // ScrollMusic NFT contract address
      network: 'Polygon',
      estimatedGas: '0.05 MATIC',
      mintingFee: 'FREE',
      royalty: {
        percentage: 2.5,
        recipient: recipientAddress
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get complete ScrollMusic NFT data
   * @returns {Object} Complete NFT data
   */
  getCompleteNFTData() {
    return {
      playlist: this.playlistData,
      analysis: this.analysis,
      metadata: this.nftMetadata,
      status: {
        imported: this.playlistData !== null,
        analyzed: this.isAnalyzed,
        metadataGenerated: this.nftMetadata !== null,
        readyToMint: this.nftMetadata !== null
      }
    };
  }

  /**
   * Generate preview for NFT
   * @returns {Object} Preview data
   */
  generatePreview() {
    if (!this.isAnalyzed) {
      throw new Error('Playlist not analyzed. Run analyzePlaylist() first.');
    }

    return {
      title: this.playlistData.name,
      frequency: `${this.analysis.dominantFrequency}Hz`,
      energy: this.analysis.averageEnergy,
      trackCount: this.playlistData.trackCount,
      duration: this.formatDuration(this.playlistData.duration),
      dominantEmotion: this.getDominantEmotion(),
      cosmicScore: this.analysis.cosmicAlignment.score,
      visualPreview: this.generateVisualLayers(),
      audioSample: 'preview-30s.mp3'
    };
  }

  /**
   * Get dominant emotion from analysis
   * @returns {String} Dominant emotion
   */
  getDominantEmotion() {
    const emotions = this.analysis.emotionalMapping;
    const dominant = Object.keys(emotions).reduce((a, b) => 
      emotions[a] > emotions[b] ? a : b
    );
    return dominant.charAt(0).toUpperCase() + dominant.slice(1);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollMusicNFT;
}
