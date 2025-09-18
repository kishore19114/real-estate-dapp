// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstateToken {
    uint256 public nextPropertyId;
    
    struct Property {
        uint256 id;
        string name;
        string location;
        uint256 value;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => address) public propertyOwner;
    
    event PropertyMinted(uint256 indexed id, string name, string location, uint256 value);
    event PropertyDeleted(uint256 indexed id);
    
    function mintProperty(
        string memory _name,
        string memory _location,
        uint256 _value
    ) external {
        nextPropertyId++;
        uint256 newId = nextPropertyId;
        properties[newId] = Property(newId, _name, _location, _value);
        propertyOwner[newId] = msg.sender;
        emit PropertyMinted(newId, _name, _location, _value);
    }
    
    function getProperty(uint256 _id) external view returns (Property memory) {
        return properties[_id];
    }

    function deleteProperty(uint256 _id) external {
        require(propertyOwner[_id] == msg.sender, "Only creator can delete");
        require(properties[_id].id != 0, "Property does not exist");
        delete properties[_id];
        delete propertyOwner[_id];
        emit PropertyDeleted(_id);
    }
}