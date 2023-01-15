#--------------------------------------------------------------insertSort
def insertSort(arr):
  for i in range(1, len(arr)): 
    key = arr[i] 
    j = i-1
    while j >=0 and key < arr[j]: 
      arr[j+1] = arr[j] 
      j -= 1
    arr[j+1] = key 

#====================================================================main
from numpy import random # random
import time

n = 2000 # start at 2000
while n <= 20000:
  i = 0
  arr = []
  while i < n:
    arr.append(random.randint(10000))
    i += 1
  start_time = time.time()
  insertSort(arr)
  print("{}: {}".format(n, time.time() - start_time))
  n += 2000