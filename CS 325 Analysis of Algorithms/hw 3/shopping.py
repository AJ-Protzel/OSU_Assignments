# T(1 ≤ T ≤ 100) is given on the first line of the input file.
# Each test case begins with a line containing a single integer 
# number N that indicates the number of items (1 ≤ N ≤ 100) 
# in that test case
# Followed by N lines, each containing two integers: P and W. 
# The first integer (1 ≤ P ≤ 5000) corresponds to
# price of object and the second integer (1 ≤ W ≤ 100) corresponds to
# weight of object.
# The next line contains one integer (1 ≤ F ≤ 30) 
# which is the number of people in that family.
# The next F lines contains the maximum weight (1 ≤ M ≤ 200) 
# that can be carried by the ith person in the family (1 ≤ i ≤ F).

#---------------------------------------------------------------Knapsack
# credit: https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/
def knapsack(n, W, wt, val): 
  V = [[0 for x in range(W + 1)] for x in range(n + 1)] # table, set all to 0

  for i in range(n+1): # col
    for ii in range(W+1): # row
      if(i == 0 or ii == 0): # first line is 0, skip
        V[i][ii] = 0
      elif(wt[i-1] <= ii): # carry up largest number
        V[i][ii] = max(val[i-1] + V[i-1][ii-wt[i-1]], V[i-1][ii]) 
      else: # set new number
        V[i][ii] = V[i-1][ii] 
  return unpack(n, W, wt, val, V) # get which items were picked
#---------------------------------------------------------------unpack
# loops through V to get which items were picked
# returns array of picked items
def unpack(n, W, wt, val, V): 
  items = []
  for i in range(n):
    if(V[n][W] != V[n-1][W]):
      items.append(n)
      n -= 1
      W -= wt[n]
    else:
      n -= 1
  items.reverse()
  return items

#====================================================================main
import random # random
import datetime # time, format

arr = [] # master array of file ints

with open('shopping.txt', 'r') as f: # get file as master array
  while True:
    line = f.readline() # get line from file
    if(not line): # check if line is eof
      break
    for i in line.split(): # get chars between space
      arr.append(int(i))

f = open('results.txt', 'w') # open output file

T = arr.pop(0) # get case number
for n in range(T):
  N = arr.pop(0) # get number of items, [price, weight]
  val = [] # values of items
  wt = [] # weights of items
  cap = [] # carry capasity of each member

  for i in range(N):
    val.append(arr.pop(0)) # get price
    wt.append(arr.pop(0)) # get weight

  F = arr.pop(0) # get number of family members
  
  for i in range(F):
    cap.append(arr.pop(0))

  sack = [] # array of loot
  loot = [] # member items
  total = 0
  for i in range(len(cap)): # count items
    loot = knapsack(N, cap[i], wt, val) # get items
    sack.append(loot)
    for ii in range(len(loot)): # count toal
      total += val[loot[ii]-1]

  s = ("Test Case {}\nTotal Price {}\nMember Items:\n".format(n+1, total))
  f.write(str(s))
  for i in range(F):
    s = ("{}:".format(i+1))
    f.write(str(s))
    for ii in range(len(sack[i])):
      s = (" {}".format(sack[i][ii]))
      f.write(str(s))
    f.write("\n")
  f.write("\n") # end case

f.close()