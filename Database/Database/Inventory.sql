CREATE TABLE [dbo].[Inventory]
(
	[inventoryID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [itemID] INT NOT NULL, 
    [dateAdded] DATETIME NOT NULL DEFAULT getDate(), 
    [condition] NUMERIC(1) NOT NULL DEFAULT 9, 
    [price] MONEY NULL, 
    [purchasedAt] NVARCHAR(50) NULL, 
    CONSTRAINT [FK_Inventory_Item] FOREIGN KEY ([itemID]) REFERENCES [Items]([itemID])
)
