/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
MERGE INTO Users AS Target 
USING (VALUES 
        (1, 'askho', 'password', 'ho.leon@yahoo.com', 6043278390, 1), 
        (2, 'lambmaster', 'password2', 'lambMaser@yahoo.com', 6043218230, 1), 
		(3, 'joJane', 'password3', 'jo.Jane@yahoo.com', 6043213254, 1),
		(4, 'ramoneT', 'password4', 'Ramone.Talone@yahoo.com', 6045678230, 1),
		(5, 'jerryV', 'password6', 'V.Jerry@yahoo.com', 6041298500, 1),
        (6, 'duyLea', 'password8', 'le.Duy@yahoo.com', 6043238120, 1)
) 
AS Source (userID, userName, password, email, phone, userType) 
ON Target.userID = Source.userID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (userName, password, email, phone, userType) 
VALUES (userName, password, email, phone, userType);

MERGE INTO Members AS Target 
USING (VALUES 
        (1, 'Leon', 'Ho', '1367 East 61 Ave Vancouver BC' , 'ho.leon@yahoo.com', 6043278390), 
        (2, 'Jens', 'Christiansen', '1023 West 2nd Ave Vancouver BC', 'undergroundViking@gmail.com', 6049080912),
		(3, 'Karen', 'Shim', '3024 Lansdown Road, Richmond BC', 'karen.shim@gmail.com', 60419203210),
		(4, 'Ken', 'Wu', '321 King Edward Road, Toronto Ontario', 'ken.wu@gmail.com', 641329190),
		(5, 'George', 'Wong', '9212 Dewdney Trunk Road, Port Moody BC', 'George.wong@hotmail.com', 6043219021)
) 
AS Source (memberID, fName, lName, address, email, phone) 
ON Target.memberID = Source.memberID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (fName, lName, address, email, phone) 
VALUES (fName, lName, address, email, phone);

