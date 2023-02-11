import HW1types

-------------------------------------------------------------- Exercise 1
--------------------------------------------------------------
b :: Bag Int
b = [(5,1),(7,3),(2,1),(3,2),(8,1)]

bb :: Bag Int
bb = [(5,1),(7,3)]

-------------------------------------------------------------- Part a
-- ins 2 b -- [(5,1),(7,3),(2,2),(3,2),(8,1)]
ins :: Eq a => a -> Bag a -> Bag a
ins n [] = [(n,1)]
ins n (x:xs) | n == fst x = (n,snd x + 1):xs
             | otherwise  = x:(ins n xs)

-------------------------------------------------------------- Part b 
-- del 2 b -- [(5,1),(7,3),(2,0),(3,2),(8,1)]
del :: Eq a => a -> Bag a -> Bag a
del n [] = [] -- return empty [] is empty
del n (x:xs) | n == fst x = (n,snd x - 1):xs
             | otherwise  = x:(del n xs)

-------------------------------------------------------------- Part c
-- bag [1,4,3,7,9] -- bag [1,4,3,7,9]
bag :: Eq a => [a] -> Bag a
bag [] = [] -- return empty [] is empty
bag (x:xs) = ins x (bag xs)

-------------------------------------------------------------- Part d
-- subbag bb b -- True
subbag :: Eq a => Bag a -> Bag a -> Bool
subbag [] yy = True
subbag xx [] = False
subbag (x:xx) yy = helper x yy && subbag xx yy

helper :: Eq t => t -> [t] -> Bool
helper x [] = False 
helper x (y:yy) | x == y = True 
                | otherwise = helper x yy

-------------------------------------------------------------- Part e
-- isSet b -- False
isSet :: Eq a => Bag a -> Bool
isSet [] = True
isSet ((x, xb):xs) | xb<=1 = isSet xs 
                   | otherwise = False

-------------------------------------------------------------- Part f
-- size b -- 8
size :: Bag a -> Int
size [] = 0 -- size should be 0 if array is empty
size ((x, xb):xs) = xb + size xs


-------------------------------------------------------------- Exercise 2
--------------------------------------------------------------
g :: Graph
g = [(1,2), (1,3), (2,3), (2,4), (3,4)]

gg :: Graph
gg = [(1,2), (1,3), (2,1), (3,2), (4,4)]
-------------------------------------------------------------- part a
-- nodes g -- [1,2,3,4]
nodes :: Graph -> [Node]
nodes [] = []
nodes (x:xx) = norm $[fst x, snd x] ++ nodes xx 

-------------------------------------------------------------- part b
-- suc 2 g -- [3,4]
-- suc 4 g -- []
suc :: Node -> Graph -> [Node]
suc x [] = []
suc x ((z1,z2): xz) | x == z1 = z2 : suc x xz
                    | otherwise = suc x xz

-------------------------------------------------------------- part c
-- detach 3 g -- [(1,2), (2,4)]
-- detach 2 gg -- [(1,3),(4,4)]
detach :: Node -> Graph -> Graph
detach _ [] = []
detach x p = [(z,y) | (z,y) <- p, not (z == x || y == x)]

-------------------------------------------------------------- part d
-- cyc 4 -- [(1,2),(2,3),(3,4),(4,1)]
cyc :: Int -> Graph
cyc 0 = []
cyc x = zip [1..x] ([2..x] ++ [1])



-------------------------------------------------------------- Exercise 3
-------------------------------------------------------------- part a
-- f = [Pt (4,4), Circle (5,5) 3, Rect (3,3) 7 2]
-- map width f -- [0,6,7]
width :: Shape -> Length
width (Pt x) = 0 -- x is a coordinate
width (Circle x xx) = 2 * xx -- xx is the radius
width (Rect x xx xxx) = xx -- xx is the width of the rectangle

-------------------------------------------------------------- part b
-- map bbox f = [((4,4),(4,4)),((2,2),(8,8)),((3,3),(10,5))]
bbox  :: Shape -> BBox
bbox (Pt x)  = (x ,x)
bbox (Circle x xx) = ((fst x - xx, snd x - xx),(fst x + xx, snd x + xx))
bbox (Rect x xx xxx) = (x , (fst x + xx, snd x + xxx))

-------------------------------------------------------------- part c
-- map minX f -- [4,2,3]
minX  :: Shape -> Number
minX (Pt x) = fst x
minX (Circle x xx) = fst x - xx
minX (Rect x xx xxx) = fst x

-------------------------------------------------------------- part d
addPt :: Point -> Point -> Point
addPt (x1,y1) (x2,y2) = (x1 + x2, y1 + y2)

move :: Shape -> Point -> Shape
move (Pt c) v = Pt $ addPt c v -- v is the vector
move (Circle c xx) v = Circle (addPt c v) xx
move (Rect c xx xxx) v = Rect (addPt c v) xx xxx