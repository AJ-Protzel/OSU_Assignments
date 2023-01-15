-- Find the actor_id, first_name and last_name of all actors who have never been in a Sci-Fi film.
-- Order by the actor_id in ascending order.
-- Put your query for Q4 here

SELECT a.actor_id, a.first_name, a.last_name 

FROM `actor` a 

WHERE NOT EXISTS(
    SELECT actor_id 
    FROM `film_actor` fact 
    WHERE fact.actor_id = a.actor_id AND EXISTS(
        SELECT film_id 
        FROM `film_category` fcat 
        WHERE fcat.film_id = fact.film_id AND fcat.category_id = 14))

GROUP BY a.actor_id
ORDER BY a.actor_id ASC