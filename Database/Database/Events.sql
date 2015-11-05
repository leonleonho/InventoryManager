CREATE TABLE [dbo].[Events]
(
	[eventID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [hostID] INT NOT NULL, 
    [location] NVARCHAR(MAX) NULL, 
    [dateCreated] DATETIME NOT NULL DEFAULT getdate(), 
    [eventDate] DATETIME NULL, 
    CONSTRAINT [FK_Events_Users] FOREIGN KEY ([hostID]) REFERENCES [Users]([userID])
	
)
