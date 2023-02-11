-- Find the actor_id first_name, last_name and total_combined_film_length 
-- of Sci-Fi films for every actor.
-- That is the result should list the actor ids, names of all of the actors(even if an actor has not been in any Sci-Fi films) 
-- and the total length of Sci-Fi films they have been in.
-- Look at the category table to figure out how to filter data for Sci-Fi films.
-- Order your results by the actor_id in descending order.
-- Put query for Q3 here

SELECT a.actor_id, a.first_name, a.last_name, COALESCE(SUM(film.length),0) AS total_combined_film_length

FROM `actor` a
LEFT JOIN `film_actor` fact ON a.actor_id = fact.actor_id 
LEFT JOIN `film_category` fcat ON fact.film_id = fcat.film_id AND fcat.category_id = 14
LEFT JOIN `film` film ON fcat.film_id = film.film_id 

GROUP BY a.actor_id
ORDER BY a.actor_id DESC