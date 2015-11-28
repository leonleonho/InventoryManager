CREATE VIEW [dbo].[EventsItemUsage]
	AS SELECT 
		ei.eventID,
		ISNULL(it.itemName,'Unknown') itemName,
		COUNT(*) AS CheckedOut,
		AVG(inv.price) AS price
	FROM EventInventory ei
		LEFT JOIN Inventory inv
			ON inv.inventoryID = ei.inventoryID
		LEFT JOIN Items it
			ON it.itemID = inv.itemID
	GROUP BY ei.eventID, it.itemName
	
