CREATE TABLE [dbo].[Users]
(
	[userID] INT NOT NULL IDENTITY(1,1) PRIMARY KEY, 
    [userName] NVARCHAR(50) UNIQUE NOT NULL, 
    [password] NVARCHAR(MAX) NOT NULL, 
    [email] NVARCHAR(50) NULL, 
    [phone] NUMERIC(15) NULL, 
    [userType] NUMERIC(5) NOT NULL, 
    [fName] NVARCHAR(50) NULL, 
    [lName] NVARCHAR(50) NULL
)
