CREATE VIEW [dbo].[InventoryItem]
	AS SELECT Inventory.inventoryID,
		Inventory.itemID,
		dateAdded,
		condition,
		price,
		purchasedAt,
		itemName,
		itemDescription,
		type
		 FROM [Inventory]
			INNER JOIN Items
				ON Inventory.itemID = Items.itemID
			INNER JOIN EventInventory
				ON EventInventory.inventoryID = Inventory.inventoryID
