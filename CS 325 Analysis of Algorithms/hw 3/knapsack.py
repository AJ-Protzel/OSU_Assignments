# determine the maximum value subset of val[]
# such that sum of the weights of this subset is ≤ W
# Items cannot be broken or used more than once
# Implement both a recursive and dynamic programming algorithm
# Both algorithms should return the maximum total value of items
# randomly generate test cases
# Output: 
#   n, W, time for the DP algorithm, 
#   max for the DP, time for the Recursive algorithm, 
#   max for Recursive

#---------------------------------------------------------------Knapsack
# credit: https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/
#---------------------------------------------------------------dynamic
def dynamic(n, W, wt, val): 
  V = [[0 for x in range(W + 1)] for x in range(n + 1)] # table, set all to 0

  for i in range(n+1): # col
    for ii in range(W+1): # row
      if(i == 0 or ii == 0): # first line is 0, skip
        V[i][ii] = 0
      elif(wt[i-1] <= ii): # carry up largest number
        V[i][ii] = max(val[i-1] + V[i-1][ii-wt[i-1]], V[i-1][ii]) 
      else: # set new number
        V[i][ii] = V[i-1][ii] 
  return V[n][ii] # return bottom right (largest) number

#---------------------------------------------------------------Recursion
def recursion(n, W, wt, val): 
  if(n == 0 or W == 0): # base
    return 0
  if(wt[n-1] > W): # check weight, start from end
    return recursion(n-1, W, wt, val) 
  else: # included, not included
    return max(val[n-1] + recursion(n-1, W-wt[n-1], wt, val), recursion(n-1, W, wt, val)) 

#====================================================================main
import random # random
import datetime # time, format

W = 100 # max pack weight, constant
Max = 0 # max value
wt = [] # weights of items
val = [] # values of items

for n in range(10, 55, 5):
  for i in range(n):
    wt.append(random.randrange(1, 100))
    val.append(random.randrange(1, 100))

  print("Items :", n, "| Weight :", W)

  start = datetime.datetime.now()
  Max = dynamic(n, W, wt, val)
  end = datetime.datetime.now()
  print("Dynamic   :", Max, ":", (end-start).microseconds, "microseconds")

  start = datetime.datetime.now()
  Max = recursion(n, W, wt, val)
  end = datetime.datetime.now()
  print("Recursion :", Max, ":", (end-start).microseconds, "microseconds")
  print()

print("------------------------------------------------")

n = 25 # max items, constant
Max = 0 # max value
wt = [] # weights of items
val = [] # values of items

for W in range(100, 1100, 100):
  for i in range(n):
    wt.append(random.randrange(1, 100))
    val.append(random.randrange(1, 100))

  print("Items :", n, "| Weight :", W)

  start = datetime.datetime.now()
  Max = dynamic(n, W, wt, val)
  end = datetime.datetime.now()
  print("Dynamic   :", Max, ":", (end-start).microseconds, "microseconds")

  start = datetime.datetime.now()
  Max = recursion(n, W, wt, val)
  end = datetime.datetime.now()
  print("Recursion :", Max, ":", (end-start).microseconds, "microseconds")
  print()
