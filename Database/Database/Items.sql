CREATE TABLE [dbo].[Items]
(
	[itemID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [itemName] NVARCHAR(50) NOT NULL, 
    [itemDescription] NVARCHAR(MAX) NULL, 
    [type] NVARCHAR(50) NOT NULL DEFAULT 'Unknown'
)

