// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ScrollMusicNFT
 * @dev NFT contract for Spotify playlist transformations
 * Mints musical journey NFTs with frequency analysis and emotional mapping
 */
contract ScrollMusicNFT is ERC721, ERC721URIStorage, Ownable {
    
    struct MusicAttributes {
        string playlistId;         // Spotify playlist ID
        string playlistName;       // Playlist name
        uint256 trackCount;        // Number of tracks
        uint256 frequency;         // Dominant frequency (Hz)
        uint256 energyLevel;       // AI-calculated energy (0-100)
        uint256 emotionalResonance;// Emotional mapping score (0-100)
        uint256 cosmicAlignment;   // Cosmic alignment score (0-100)
        uint256 mintTimestamp;     // When minted
    }
    
    mapping(uint256 => MusicAttributes) private _musicAttributes;
    mapping(string => uint256) private _playlistToToken; // Playlist ID to token ID
    uint256 private _tokenIdCounter;
    
    event MusicNFTMinted(
        uint256 indexed tokenId,
        string playlistId,
        string playlistName,
        uint256 frequency,
        uint256 cosmicAlignment
    );
    
    event AttributesUpdated(
        uint256 indexed tokenId,
        uint256 energyLevel,
        uint256 emotionalResonance
    );
    
    constructor() ERC721("ScrollMusic", "SMUSIC") {}
    
    /**
     * @dev Mint a new ScrollMusic NFT from playlist analysis
     * @param to Address to mint to
     * @param playlistId Spotify playlist ID
     * @param playlistName Playlist name
     * @param trackCount Number of tracks
     * @param frequency Dominant frequency
     * @param energyLevel Energy level (0-100)
     * @param cosmicAlignment Cosmic alignment score
     * @param tokenURI IPFS URI for metadata
     * @return tokenId The ID of the newly minted token
     */
    function mintMusicNFT(
        address to,
        string memory playlistId,
        string memory playlistName,
        uint256 trackCount,
        uint256 frequency,
        uint256 energyLevel,
        uint256 cosmicAlignment,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(bytes(playlistId).length > 0, "Playlist ID cannot be empty");
        require(_playlistToToken[playlistId] == 0, "Playlist already minted");
        require(trackCount > 0, "Track count must be greater than 0");
        require(energyLevel <= 100, "Energy level must be <= 100");
        require(cosmicAlignment <= 100, "Cosmic alignment must be <= 100");
        
        uint256 tokenId = _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        uint256 emotionalResonance = _calculateEmotionalResonance(frequency, energyLevel);
        
        _musicAttributes[tokenId] = MusicAttributes({
            playlistId: playlistId,
            playlistName: playlistName,
            trackCount: trackCount,
            frequency: frequency,
            energyLevel: energyLevel,
            emotionalResonance: emotionalResonance,
            cosmicAlignment: cosmicAlignment,
            mintTimestamp: block.timestamp
        });
        
        _playlistToToken[playlistId] = tokenId;
        
        emit MusicNFTMinted(tokenId, playlistId, playlistName, frequency, cosmicAlignment);
        
        return tokenId;
    }
    
    /**
     * @dev Update music attributes based on community interaction
     * @param tokenId Token ID to update
     * @param energyLevel New energy level
     * @param emotionalResonance New emotional resonance
     */
    function updateAttributes(
        uint256 tokenId,
        uint256 energyLevel,
        uint256 emotionalResonance
    ) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(energyLevel <= 100, "Energy level must be <= 100");
        require(emotionalResonance <= 100, "Emotional resonance must be <= 100");
        
        _musicAttributes[tokenId].energyLevel = energyLevel;
        _musicAttributes[tokenId].emotionalResonance = emotionalResonance;
        
        emit AttributesUpdated(tokenId, energyLevel, emotionalResonance);
    }
    
    /**
     * @dev Get music attributes for a token
     */
    function getMusicAttributes(uint256 tokenId) 
        public 
        view 
        returns (MusicAttributes memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return _musicAttributes[tokenId];
    }
    
    /**
     * @dev Get token ID for a playlist
     */
    function getTokenByPlaylist(string memory playlistId) 
        public 
        view 
        returns (uint256) 
    {
        uint256 tokenId = _playlistToToken[playlistId];
        require(tokenId != 0, "Playlist not minted");
        return tokenId;
    }
    
    /**
     * @dev Check if playlist has been minted
     */
    function isPlaylistMinted(string memory playlistId) 
        public 
        view 
        returns (bool) 
    {
        return _playlistToToken[playlistId] != 0;
    }
    
    /**
     * @dev Calculate emotional resonance based on frequency and energy
     */
    function _calculateEmotionalResonance(uint256 frequency, uint256 energy) 
        private 
        pure 
        returns (uint256) 
    {
        // Formula: (normalized_frequency + energy) / 2
        // Normalize frequency: 432Hz->43, 528Hz->53, 963Hz->96
        uint256 normalizedFreq = frequency / 10;
        return (normalizedFreq + energy) / 2;
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
