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
 * Deployed on Polygon network for low-cost, eco-friendly transactions
 */
contract SacredSigilNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Sigil Types
    enum SigilType { IMHOTEP, MUSA, MUHAMMAD }
    
    // Rarity levels
    enum Rarity { COMMON, RARE, EPIC, LEGENDARY, DIVINE }
    
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
    
    // Mapping from token ID to attributes
    mapping(uint256 => SigilAttributes) private _sigilAttributes;
    
    // Mapping from token ID to rarity
    mapping(uint256 => Rarity) private _sigilRarity;
    
    // Mapping to track sigil type counts
    mapping(SigilType => uint256) private _sigilTypeCounts;
    
    // Maximum supply per sigil type
    mapping(SigilType => uint256) private _maxSupply;
    
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
    
    constructor() ERC721("SacredSigil", "SIGIL") {
        // Set maximum supply for each sigil type
        _maxSupply[SigilType.IMHOTEP] = 1000;
        _maxSupply[SigilType.MUSA] = 750;
        _maxSupply[SigilType.MUHAMMAD] = 500;
    }
    
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
        // Check if max supply reached
        require(
            _sigilTypeCounts[sigilType] < _maxSupply[sigilType],
            "Max supply reached for this sigil type"
        );
        
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
     * @dev Get max supply for sigil type
     */
    function getMaxSupply(SigilType sigilType) 
        public 
        view 
        returns (uint256) 
    {
        return _maxSupply[sigilType];
    }
    
    /**
     * @dev Get remaining supply for sigil type
     */
    function getRemainingSupply(SigilType sigilType) 
        public 
        view 
        returns (uint256) 
    {
        return _maxSupply[sigilType] - _sigilTypeCounts[sigilType];
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
