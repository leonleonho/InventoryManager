CREATE VIEW [dbo].[ItemsCheckedOut]
	AS SELECT ei.memberID,
		mem.name,
		it.itemName,
		inv.inventoryID,
		ei.eventID

	 FROM Members mem
		LEFT JOIN EventInventory ei
			ON mem.memberID = ei.memberID
		LEFT JOIN Inventory inv
			ON inv.inventoryID = ei.inventoryID
		LEFT JOIN Items it
			ON it.itemID = inv.itemID
