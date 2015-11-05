CREATE TABLE [dbo].[Members]
(
	[memberID] INT NOT NULL IDENTITY PRIMARY KEY, 
    [fName] NVARCHAR(30) NOT NULL, 
    [lName] NVARCHAR(30) NOT NULL, 
    [address] NVARCHAR(50) NULL, 
    [email] NVARCHAR(50) NULL, 
    [phone] NUMERIC(15) NULL
)
