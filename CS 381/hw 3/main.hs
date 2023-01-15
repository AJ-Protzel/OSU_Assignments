-- Zinn Morton
-- Huy Nguyen
-- Adrien Protzel
-- Alaric Hartsock
-- Adam Oberg

-------------------------------------------------------------- Exercise 1
type Prog = [Cmd]
data Cmd = LD Int
         | ADD
         | MULT
         | DUP
         deriving(Show)

type Stack = [Int]
type D = Stack -> Maybe Stack

-------------------------------------------------------------- Stack language
-- sem [LD 3,DUP,ADD,DUP,MULT] -- Just [36]
-- sem [LD 3,DUP,ADD] -- Just [6]
-- sem [LD 3,ADD] -- Nothing
-- sem [] -- Nothing
--For individual commands
sem :: Prog -> Maybe Stack
sem [] = Nothing
sem allCmds | (semHelper allCmds []) == Nothing = Nothing
            | otherwise = (semHelper allCmds [])

--Semantic function
semCmd :: Cmd -> D
semCmd (LD num) curStack = Just (num:curStack)
semCmd ADD (elem1:elem2:nextStack) = Just ((elem1 + elem2):nextStack)
semCmd MULT (elem1:elem2:nextStack) = Just ((elem1 * elem2):nextStack)
semCmd DUP (elem1:nextStack) = Just (elem1:elem1:nextStack)
semCmd _ _ = Nothing

-------------------------------------------------------------- Helper
--Semantic function that doesn't need a second empty term. Wrapper function
semHelper :: Prog -> D
semHelper [] curStack = Just curStack
semHelper (curCmd:nextCmds) curStack = case (semCmd curCmd curStack) of
                                            Just newStack -> semHelper nextCmds newStack
                                            Nothing -> Nothing



-------------------------------------------------------------- Exercise 2
data Cmd' = Pen Mode
          | MoveTo Int Int
          | Seq Cmd' Cmd'

data Mode = Up | Down deriving (Eq, Show)
type State = (Mode,Int,Int)
type Line  = (Int,Int,Int,Int)
type Lines = [Line]

-------------------------------------------------------------- Mini Logo
-- sem' (Seq (Pen Down) (Seq (MoveTo 1 2) (Seq (Pen Up) (Seq (MoveTo 5 5) (Seq (Pen Down) (MoveTo 10 10))))))
-->  [(0,0,1,2),(5,5,10,10)]
semS :: Cmd' -> State -> (State,Lines)
semS (Pen Up) (_, curX, curY) = ((Up, curX, curY), [])
semS (Pen Down) (_, curX, curY) = ((Down, curX, curY), [])
semS (MoveTo newX newY) (curMode, curX, curY) | curMode == Up = ((curMode, newX, newY), [])
                                              | curMode == Down = ((curMode, newX, newY), [(curX, curY, newX, newY)])
semS (Seq curCmd nextCmd) (curMode, curX, curY) = (finalState, (curLines ++ nextLines))
    where
        curCmdOutput = semS curCmd (curMode, curX, curY)
        newState = fst curCmdOutput
        curLines = snd curCmdOutput
        nextCmdOutput = semS nextCmd newState
        finalState = fst nextCmdOutput
        nextLines = snd nextCmdOutput

sem' :: Cmd' -> Lines
sem' penCmds = snd (semS penCmds (Up, 0, 0))

-------------------------------------------------------------- Helper
instance Show Cmd' where
    show (Pen Up) = "Pen Up\n"
    show (Pen Down) = "Pen Down\n"
    show (MoveTo x y) = "Moveto " ++ (show x) ++ " " ++ (show y) ++ "\n"
    show (Seq cmd1 cmd2) = (show cmd1) ++ (show cmd2)