CREATE VIEW [dbo].[EventsView]
	AS SELECT e.eventID, 
		location,
		dateCreated,
		eventName,
		inventory.inventoryID,
		inventory.itemID,
		dateAdded,
		condition,
		price,
		purchasedAt,
		itemName,
		itemDescription,
		type,
		Members.fName AS memberFName,
		Members.lName AS memberLName,
		Members.address AS memberAddress,
		Members.email AS memberEmail,
		Members.phone AS memberPhone,
		Users.fName AS hostFName,
		Users.lName AS hostLName,
		Users.email AS hostEmail,
		Users.phone AS hostPhone
	FROM [Events] e
	INNER JOIN EventInventory ei
		ON e.eventID = ei.eventID
	INNER JOIN EventMember em
		ON e.eventID = em.eventID
	INNER JOIN Members
		ON em.memberID = Members.memberID AND ei.memberID = Members.memberID
	INNER JOIN Inventory
		ON Inventory.inventoryID = ei.inventoryID
	INNER JOIN Items
		ON Inventory.itemID = Items.itemID
	INNER JOIN Users
		ON e.hostID = Users.userID
	
