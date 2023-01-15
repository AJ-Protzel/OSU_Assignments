-- Zinn Morton
-- Huy Nguyen
-- Adrien Protzel
-- Alaric Hartsock
-- Adam Oberg

-------------------------------------------------------------- Exercise 1
type Prog = [Cmd]
data Cmd = LD Int
         | ADD -- add top two numbers, add new push of sum to top
         | MULT -- multiply top two numbers, add new push of sum to top
         | DUP -- duplicate top number, add new push of number to top
         | DEC -- decrement stack top
         | SWAP -- swap top two numbers
         | POP Int -- pops k elements from stack 
         deriving(Show)

type Stack = [Int]
type D = Stack -> Maybe Stack

type Rank = Int
type CmdRank = (Int, Int)

-------------------------------------------------------------- Type System Rank
-------------------------------------------------------------- a
-- semCmd DEC [4,3,2] -- Just [3,3,2]
-- semCmd SWAP [4,3,2] -- Just [3,4,2]
-- semCmd POP 2 [4,3,2] -- Just [2]
-- rankP [(LD 1), (LD 2), ADD] -- Just 1
-- rankP [(LD 1), ADD] -- Nothing
-- rankP [DUP] -- Nothing
-- rankP [(LD 1), DUP] -- Just 2
-- rankP [DEC] -- Nothing
-- rankP [(LD 1), DEC] -- Just 1
-- rankP [SWAP] -- Nothing
-- rankP [(LD 1), SWAP] -- Nothing
-- rankP [(LD 1), (LD 1), SWAP] -- Just 2

sem :: Prog -> Maybe Stack
sem [] = Nothing
sem allCmds | (semHelper allCmds []) == Nothing = Nothing
            | otherwise = (semHelper allCmds [])

-------------------------------------------------------------- Helper
-- Semantic function that doesn't need a second empty term.
-- Wrapper function
semHelper :: Prog -> D
semHelper [] curStack = Just curStack
semHelper (curCmd:nextCmds) curStack = case (semCmd curCmd curStack) of
                                            Just newStack -> semHelper nextCmds newStack
                                            Nothing -> Nothing

semCmd :: Cmd -> D
semCmd (LD num) curStack = Just (num:curStack)
semCmd ADD (elem1:elem2:nextStack) = Just ((elem1 + elem2):nextStack)
semCmd MULT (elem1:elem2:nextStack) = Just ((elem1 * elem2):nextStack)
semCmd DUP (elem1:nextStack) = Just (elem1:elem1:nextStack)
semCmd DEC (elem1:nextStack) = Just ((elem1 - 1):nextStack)
semCmd SWAP (elem1:elem2:nextStack) = Just (elem2:elem1:nextStack)
semCmd (POP 0) curStack = Just curStack
semCmd (POP n) (elem1:nextStack) = (semCmd (POP (n-1)) nextStack)
semCmd _ _ = Nothing

rankC :: Cmd -> CmdRank
rankC (LD _) = (0, 1)
rankC ADD = (2, 1)
rankC MULT = (2, 1)
rankC DUP = (1, 2)
rankC DEC = (1, 1)
rankC SWAP = (2, 2)
rankC (POP n) = (n, 0)

rankP :: Prog -> Maybe Rank
rankP curProg = (rankPHelper curProg 0)

-------------------------------------------------------------- Helper
-- Helper function that keeps track of current rank
rankPHelper :: Prog -> Rank -> Maybe Rank
rankPHelper [] curRank = Just curRank
rankPHelper (cmd1:nextCmds) curRank | (curRank < curCmdIn) = Nothing
                                    | otherwise = (rankPHelper nextCmds (curRank - curCmdIn + curCmdOut))
                                    where
                                    curCmdRank = (rankC cmd1)
                                    curCmdIn = (fst curCmdRank)
                                    curCmdOut = (snd curCmdRank)

-------------------------------------------------------------- b
-- ANSWER: Since the program is type checked before running sem in semStatTC,
-- sem doesn't need to produce a Maybe Stack anymore. It can now just produce a Stack
-- semStatTC definition using the type-changed sem:

-- sem :: Prog -> Stack

-- semStatTC :: Prog -> Maybe Stack
-- semStatTC curProg | ((rankP curProg) /= Nothing) = (Just (sem curProg))
--                   | otherwise = Nothing

-------------------------------------------------------------- Exercise 2
-------------------------------------------------------------- Shape Language
data Shape = X
           | TD Shape Shape
           | LR Shape Shape
           deriving(Show)

type BBox = (Int,Int)

-------------------------------------------------------------- a
-- bbox X -- (1, 1)
-- bbox (TD X X) -- (1, 2)
-- bbox (TD (TD X X) X) -- (1, 3)
-- bbox (LR (TD (TD X X) X) X) -- (2, 3)

bbox :: Shape -> BBox
bbox X = (1, 1)
bbox (TD shape1 shape2) = ((max shape1Width shape2Width), (shape1Height + shape2Height))
                        where
                        shape1Bbox = (bbox shape1)
                        shape1Width = (fst shape1Bbox)
                        shape1Height = (snd shape1Bbox)
                        shape2Bbox = (bbox shape2)
                        shape2Width = (fst shape2Bbox)
                        shape2Height = (snd shape2Bbox)
bbox (LR shape1 shape2) = ((shape1Width + shape2Width), (max shape1Height shape2Height))
                        where
                        shape1Bbox = (bbox shape1)
                        shape1Width = (fst shape1Bbox)
                        shape1Height = (snd shape1Bbox)
                        shape2Bbox = (bbox shape2)
                        shape2Width = (fst shape2Bbox)
                        shape2Height = (snd shape2Bbox)

-------------------------------------------------------------- b
-- rect X -- Just (1, 1)
-- rect (TD X X) -- Just (1, 2)
-- rect (TD (TD X X) X) -- Just (1, 3)
-- rect (LR (TD (TD X X) X) X) -- Nothing
-- rect (TD (TD (LR X X) X) (LR X X)) -- Nothing

rect :: Shape -> Maybe BBox
rect X = (Just (1, 1))
rect (TD shape1 shape2) | (shape1Width == shape2Width) && ((rect shape1) /= Nothing) && ((rect shape2) /= Nothing) = (Just ((max shape1Width shape2Width), (shape1Height + shape2Height)))
                        | otherwise = Nothing
                        where
                        shape1Bbox = (bbox shape1)
                        shape1Width = (fst shape1Bbox)
                        shape1Height = (snd shape1Bbox)
                        shape2Bbox = (bbox shape2)
                        shape2Width = (fst shape2Bbox)
                        shape2Height = (snd shape2Bbox)
rect (LR shape1 shape2) | (shape1Height == shape2Height) && ((rect shape1) /= Nothing) && ((rect shape2) /= Nothing) = (Just ((shape1Width + shape2Width), (max shape1Height shape2Height)))
                        | otherwise = Nothing
                        where
                        shape1Bbox = (bbox shape1)
                        shape1Width = (fst shape1Bbox)
                        shape1Height = (snd shape1Bbox)
                        shape2Bbox = (bbox shape2)
                        shape2Width = (fst shape2Bbox)
                        shape2Height = (snd shape2Bbox)