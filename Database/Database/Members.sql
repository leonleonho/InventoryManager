CREATE TABLE [dbo].[Members]
(
	[memberID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [name] NVARCHAR(30) NOT NULL, 
    [address] NVARCHAR(50) NULL, 
    [email] NVARCHAR(50) NULL, 
    [phone] NUMERIC(15) NULL
)
