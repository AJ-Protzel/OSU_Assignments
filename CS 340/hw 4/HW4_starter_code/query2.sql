-- We want to find out how many of each category of film ED CHASE has starred in.
-- So return a table with "category_name" and the count of the "number_of_films" that ED was in that category.
-- Your query should return every category even if ED has been in no films in that category
-- Order by the category name in ascending order.

SELECT cat.name AS category_name, COUNT(a.actor_id) AS number_of_films

FROM `category` cat
LEFT JOIN `film_category` fcat ON cat.category_id = fcat.category_id
LEFT JOIN `film` film ON fcat.film_id = film.film_id
LEFT JOIN `film_actor` fact ON film.film_id = fact.film_id
LEFT JOIN `actor` a ON fact.actor_id = a.actor_id AND a.actor_id = 3

GROUP BY cat.category_id
ORDER BY cat.name ASC;