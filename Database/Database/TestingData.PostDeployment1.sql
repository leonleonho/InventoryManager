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

MERGE INTO Items AS Target 
USING (VALUES 
        (1, 'MSR Whistper Lite', 'The best stove in the world', 'stove'),
		(2, 'MEC Phoenix Sleeping bag', 'A super warm sleeping bag', 'sleeping bag'),
		(3, 'MSR Hubba NX Tent', 'A bomb proof tent', 'tent'),
		(4, 'North Face Big Shot', 'A great backpack', 'back pack'),
		(5, 'MSR Base Camp', 'Light weight cook ware', 'cookset'),
		(6, 'GSI Wok small', 'Asian cooking machine', 'cookset'),
		(7, 'GSI Wok Large', 'Asian cooking machine but bigger', 'cookset'),
		(8, 'GSI Pinacle Dualist', 'Two person lightweight cookset', 'cookset'),
		(9, 'Colman White Gas', 'Large can of camp fuel', 'fuel'),
		(10,'Primus fuel cannister', 'Large can of butane', 'fuel'),
		(11, 'Colman Propane small', 'Single person can of propane', 'fuel'),
		(12, 'Primus Classic Trail', 'A small cheap stove', 'stove')  
) 
AS Source (itemID, itemName, itemDescription, type)
ON Target.itemID = Source.itemID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (itemName, itemDescription, type) 
VALUES (itemName, itemDescription, type);

MERGE INTO Inventory AS Target 
USING (VALUES 
        (1, 1, 99.99, 'MEC'),
		(2, 1, 99.99, 'MEC'),
		(3, 1, 99.99, 'MEC'),
		(4, 1, 89.99, 'MEC'),
		(5, 1, 99.99, 'MEC'),
		(6, 2, 130.21, 'MEC'),
		(7, 2, 130.21, 'MEC'),
		(8, 2, 130.21, 'MEC'),
		(9, 2, 130.21, 'MEC'),
		(10, 2, 130.21, 'MEC'),
		(11, 3, 231.31, 'MEC'),
		(12, 3, 243.31, 'MEC'),
		(13, 3, 130.31, 'MEC'),
		(14, 3, 243.39, 'MEC'),
		(15, 3, 243.39, 'MEC'),
		(16, 4, 75.99, 'MEC'),
		(17, 4, 75.99, 'MEC'),
		(18, 4, 75.99, 'MEC'),
		(19, 4, 75.99, 'MEC'),
		(20, 4, 75.99, 'MEC'),
		(21, 5, 40.0, 'MEC'),
		(22, 5, 40.0, 'MEC'),
		(23, 5, 40.0, 'MEC'),
		(24, 5, 40.0, 'MEC'),
		(25, 5, 40.0, 'MEC'),
		(26, 5, 40.0, 'MEC'),
		(27, 5, 40.0, 'Three Vets'),
		(28, 5, 40.0, 'MEC'),
		(29, 5, 40.0, 'MEC'),
		(30, 5, 40.0, 'MEC'),
		(31, 5, 40.0, 'MEC'),
		(32, 5, 40.0, 'MEC'),
		(33, 5, 40.0, 'MEC'),
		(34, 5, 40.0, 'Three Vets'),
		(35, 6, 35.0, 'MEC'),
		(36, 6, 35.0, 'MEC'),
		(37, 6, 35.0, 'MEC'),
		(38, 6, 35.0, 'MEC'),
		(39, 7, 65.21, 'MEC'),
		(40, 7, 65.21, 'MEC'),
		(41, 7, 65.21, 'MEC'),
		(42, 8, 25.28, 'Three vets'),
		(43, 8, 25.28, 'Three Vets'),
		(44, 8, 25.28, 'Three Vets'),
		(45, 9, 5.2, 'MEC'),
		(46, 10, 8.4, 'Canada Tire'),
		(47, 11, 4.5, 'Canadaian Tire'),
		(48, 12, 35.5, 'MEC')
) 
AS Source (inventoryID, itemID, price, purchasedAt)
ON Target.inventoryID = Source.inventoryID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (itemID, price, purchasedAt) 
VALUES (itemID, price, purchasedAt);


MERGE INTO events AS Target 
USING (VALUES 
        (1, 1, 'Lumbermans Arch', 12/4/2015, 'Walk With the Dragon'),
		(2, 1, 'Camp McLean', 1/4/2016, 'Competition Camp'),
		(3, 1, 'Camp Sasamat', 12/3/2014, 'Leaders Retreat'),
		(4, 1, 'Chinese Cultural Center', 7/1/2014, 'Canada Day Parade'),
		(5, 2, 'Camp Whonnock', 6/28/2014, 'Family Camp'),
		(6, 2, 'Camp Byng', 6/20/2014, 'Pacific Jamboree'),
		(7, 2, 'Garibaldi Lake', 7/20/2013, 'Venture Camp'),
		(8, 3, 'Wedge mount', 4/3/2016, 'Queens Venture Camp')
) 
AS Source (eventID, hostID, location, eventDate, eventName)
ON Target.eventID = Source.eventID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (hostID, location, eventDate, eventName) 
VALUES (hostID, location, eventDate, eventName);

MERGE INTO eventInventory AS Target 
USING (VALUES 
        (1, 1, 1, 1),
		(2, 1, 2, 2),
		(3, 1, 3, 3),
		(4, 1, 4, 4),
		(5, 1, 5, 5),
		(6, 2, 6, 1),
		(7, 2, 7, 2),
		(8, 2, 8, 3),
		(9, 2, 9, 4),
		(10, 2, 10, 5),
		(11, 3, 11, 1),
		(12, 3, 12, 2),
		(13, 3, 13, 3),
		(14, 3, 14, 4),
		(15, 3, 15, 5),
		(16, 4, 16, 1),
		(17, 4, 17, 2),
		(18, 4, 18, 3),
		(19, 4, 19, 4),
		(20, 4, 20, 5),
		(21, 5, 21, 1),
		(22, 5, 22, 2),
		(23, 5, 23, 3),
		(24, 5, 24, 4),
		(25, 5, 25, 5),
		(26, 6, 26, 1),
		(27, 6, 27, 2),
		(28, 6, 28, 3),
		(29, 6, 29, 4),
		(30, 6, 30, 5),
		(31, 7, 31, 1),
		(32, 7, 32, 2),
		(33, 7, 33, 3),
		(34, 7, 34, 4),
		(35, 7, 35, 5),
		(36, 8, 36, 1),
		(37, 8, 37, 2),
		(38, 8, 38, 3),
		(39, 8, 39, 4),
		(40, 8, 40, 5)
) 
AS Source (eventInventoryID, eventID, inventoryID, memberID)
ON Target.eventInventoryID = Source.eventInventoryID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (eventID, inventoryID, memberID) 
VALUES (eventID, inventoryID, memberID);

MERGE INTO eventMember AS Target 
USING (VALUES 
        (1, 1, 1),
		(2, 2, 1),
		(3, 3, 1),
		(4, 4, 1),
		(5, 5, 1),
		(6, 1, 2),
		(7, 2, 2),
		(8, 3, 2),
		(9, 4, 2),
		(10, 5, 2 ),
		(11, 1, 3),
		(12, 2, 3),
		(13, 3, 3),
		(14, 4, 3),
		(15, 5, 3),
		(16, 1, 4),
		(17, 2, 4),
		(18, 3, 4),
		(19, 4, 4),
		(20, 5, 4),
		(21, 1, 5),
		(22, 2, 5),
		(23, 3, 5),
		(24, 4, 5),
		(25, 5, 5),
		(26, 1, 6),
		(27, 2, 6),
		(28, 3, 6),
		(29, 4, 6),
		(30, 5, 6),
		(31, 1, 7),
		(32, 2, 7),
		(33, 3, 7),
		(34, 4, 7),
		(35, 5, 7),
		(36, 1, 8),
		(37, 2, 8),
		(38, 3, 8),
		(39, 4, 8),
		(40, 5, 8)
) 
AS Source (eventMemberID, memberID, eventID)
ON Target.eventMemberID = Source.eventMemberID 
WHEN NOT MATCHED BY TARGET THEN 
INSERT (memberID, eventID) 
VALUES (memberID, eventID);