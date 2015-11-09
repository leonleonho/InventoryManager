CREATE TABLE [dbo].[EventMember]
(
	[eventMemberID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [memberID] INT NOT NULL, 
    [eventID] INT NOT NULL, 
    CONSTRAINT [FK_EventMember_Members] FOREIGN KEY ([memberID]) REFERENCES [Members]([memberID]),
	CONSTRAINT [FK_EventMember_Event] FOREIGN KEY ([eventID]) REFERENCES [Events]([eventID])
	ON DELETE CASCADE
)
