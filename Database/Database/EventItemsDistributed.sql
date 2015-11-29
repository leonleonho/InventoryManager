CREATE VIEW [dbo].[EventItemsDistributed]
	AS SELECT 
		em.eventID,
		mem.memberID,
		mem.name,
		COUNT(*) AS checkedOut
		FROM eventMember em
		LEFT JOIN Members mem
			ON mem.memberID = em.memberID
		INNER JOIN EventInventory ei
			ON ei.eventID = em.eventID AND ei.memberID = em.memberID
		GROUP BY em.eventID, mem.memberID, mem.name



