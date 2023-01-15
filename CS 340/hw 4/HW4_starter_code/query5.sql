-- Find the film_title of all films which feature both KIRSTEN PALTROW (21) and WARREN NOLTE (108)
-- Order the results by film_title in descending order.

SELECT f.title AS film_title

FROM `film` f 

WHERE EXISTS(
    SELECT film_id
    FROM `film_actor` fact
    WHERE f.film_id = fact.film_id AND actor_id = 21 AND EXISTS(
        SELECT film_id
        FROM `film_actor` fact
        WHERE f.film_id = fact.film_id AND actor_id = 108))

GROUP BY f.title
ORDER BY f.title DESC