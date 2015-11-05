CREATE TABLE [dbo].[EventMember]
(
	[EventMemberID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [memberID] INT NULL, 
    CONSTRAINT [FK_EventMember_Members] FOREIGN KEY ([memberID]) REFERENCES [Members]([memberID])
)
