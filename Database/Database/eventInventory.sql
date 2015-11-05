CREATE TABLE [dbo].[EventInventory]
(
	[eventInventoryID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [eventID] INT NOT NULL, 
    [inventoryID] INT UNIQUE NOT NULL, 
    [memberID] INT NULL, 
    CONSTRAINT [FK_eventInventory_Event] FOREIGN KEY ([eventID]) REFERENCES [Events]([eventID]),
	CONSTRAINT [FK_eventInventory_Inventory] FOREIGN KEY ([inventoryID]) REFERENCES [Inventory]([inventoryID]),
	CONSTRAINT [FK_eventInventory_Members] FOREIGN KEY ([memberID]) REFERENCES [Members]([memberID]) 
)
