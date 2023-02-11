-- Adrien Protzel
-- Huy Nguyen
-- Alaric Hartsock
-- Adam Oberg
-------------------------------------------------------------- Exercise 1
-------------------------------------------------------------- Mini Logo
-- cmd ::= pen mode
--      | moveto (pos, pos)
--      | def name (pars) cmd
--      | call name (vals)
--      | cmd; cmd
-- 
-- mode ::= up | down
-- pos ::= num | name
-- pars ::= name, pars | name
-- vals ::= num, vals | num

-- unspecifed nonterminals: [cmd, pos, name, pars, vals, mode, num]
-------------------------------------------------------------- Part a
-- define abstract syntax of mini logo as data type -- _con = constructor
data Cmd = Pen Mode
         | Moveto Pos Pos
         | Def String Pars Cmd
         | Call String Vals
         | Cmd_con [Cmd]

data Mode = Up | Down deriving(Show)
data Pos = Pos_int Int | Pos_str String

type Pars = [String]
type Vals = [Int]

-------------------------------------------------------------- Part b
-- Write mini logo macro vector to draw line from (x1, y1) to (x2, y2)
-- vector -- Def vector "x1", "y1", "x2", "y2" \n Moveto "x1" "y1" \n SetMode(Down) \n Moveto "x2" "y2"
vector :: Cmd 
commands = Cmd_con [
  Moveto (Pos_str "x1") (Pos_str "y1"),
  Pen Down, 
  Moveto (Pos_str "x2") (Pos_str "y2")
 ]
vector = Def "vector" 
    ["x1","y1","x2","y2"]
    (Cmd_con [
        Pen Up,
        Moveto (Pos_str "x1") (Pos_str "y1"),
        Pen Down,
        Moveto (Pos_str "x2")  (Pos_str "y2"),
        Pen Up
    ])

-------------------------------------------------------------- Part C 
-- Draws a stair of n steps
-- Prerequisites -- Moveto 0 0 \n SetMode(Down) \n Moveto 0 1 \n Moveto 1 1
line :: (Int,Int,Int,Int) -> Cmd
line (x1,y1,x2,y2) = Cmd_con [
    Pen Up,
    Moveto (Pos_int x1) (Pos_int y2),
    Pen Down,
    Moveto (Pos_int x2)  (Pos_int y2),
    Pen Up
  ]

steps :: Int -> Cmd
steps 1 = Cmd_con [
    line (1,1,1,1)
    ] -- base case
steps n = Cmd_con [
  steps (n-1),
  line (n-1,n,n,n),
  line (n-1,n-1,n-1,n)
  ]

-------------------------------------------------------------- Helper
-- Pen Up -- SetMode(Up/Down)
-- Moveto (Pos_int 1) (Pos_int 2) -- Moveto 1 2
instance Show Cmd where
  show (Pen x) = "SetMode("++show x++")\n"
  show (Moveto x y) = "Moveto "++show x++" "++show y++"\n"
  show (Def x y z) = "Def "++x++" "++show y++"\n"++show z
  show (Cmd_con xs) = show xs

instance Show Pos where -- show values but without the cmd
  show (Pos_int x) = show x
  show (Pos_str x) = show x 

-------------------------------------------------------------- Exercise 2
-------------------------------------------------------------- Regular Expression
-- regex ::= ε|.|c|regex?|regex*|regex+|regex regex|regex|regex|(regex)

-- unspecifed nonterminals: [c]
-------------------------------------------------------------- Part a
-- define abstract syntax for a regular expression
-- words = [char] = string
data RegEx = RegEmpty            -- matches the empty word, which is also often written as ε.
           | RegDot              -- matches any character in Σ.
           | RegChar Char        -- Each character c ∈ Σ matches itself.
           | RegQMark RegEx      -- RegEx? matches the empty word or whatever is matched by RegEx.
           | RegStar RegEx       -- RegEx* matches zero or more occurrences of the words matched by RegEx.
           | RegPlus RegEx       -- RegEx+ matches one or more occurrences of the words matched by RegEx.
           | RegAnd RegEx RegEx  -- RegEx RegEx′ matches any word ww′ when RegEx matches w and RegEx′ matches w′.
           | RegOr RegEx RegEx   -- regex | regex′ matches any word that is matched by either regex or regex′.

-------------------------------------------------------------- Part b
-- define a function thats takes a regular expression and string, returns T if they match
accept :: RegEx -> String -> Bool
accept RegEmpty str = str == ""
accept RegDot _ = True
accept (RegChar ch) str = [ch] == str
accept (RegQMark reg) str = accept (RegOr RegEmpty reg) str
accept (RegStar reg) str = accept (RegOr (RegPlus reg) RegEmpty) str
accept (RegPlus reg) str = accept (RegAnd reg (RegStar reg)) str
accept (RegAnd reg1 reg2) str = or [accept reg1 str1 && accept reg2 str2 | (str1, str2) <- splits str]
accept (RegOr reg1 reg2) str = accept reg1 str || accept reg2 str

regList :: String -> RegEx
regList "" = RegEmpty
regList (ch:str) = RegAnd (RegChar ch) (regList str)

splits :: [a] -> [([a],[a])]
splits [] = []
splits [x] = [([],[x]),([x],[])]
splits (x:xs) = [([],x:xs)] ++ [(x:s,t) | (s,t) <- splits xs]

-------------------------------------------------------------- Part c
-- define a value commaSep :: Regex to show a regular expression for comma seperated lists
-- classify commaSep commaSepTest -- ACCEPT:\n["cat", "cat,bat", "cat,cat", "bat"]\nREJECT: ~other stuff~
commaSep :: RegEx 
commaSep = RegAnd (RegOr (regList "cat") (regList "bat")) (RegStar (RegAnd (RegChar ',') (RegAnd (RegOr (RegChar 'c') (RegChar 'b')) (regList "at"))))
-- (cat|bat)(,(c|b)at)*

-------------------------------------------------------------- Helper
commaSepTest = ["cat","cat,bat","cat,cat","bat","",",","dog",",cat","cat,","catcat","cat,,bat","cat,bat," , "cat,cat,cat", "cat,cat,bat"]

classify :: RegEx -> [String] -> IO ()
classify e ws = putStrLn ("ACCEPT:\n"++show acc++"\nREJECT:\n"++show rej)
  where acc = filter (accept e) ws
        rej = filter (not.(accept e)) ws