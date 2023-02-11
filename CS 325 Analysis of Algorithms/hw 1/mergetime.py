#---------------------------------------------------------------mergeSort
def mergeSort(arr):
  if len(arr) > 1:
    mid = len(arr)//2

    L = arr[:mid]
    R = arr[mid:]

    mergeSort(L)
    mergeSort(R)

    curr = lin = rin = 0 # main ar index, left index, right index

    while lin < len(L) and rin < len(R):
      if L[lin] < R[rin]:
        arr[curr] = L[lin]
        lin += 1
      else:
        arr[curr] = R[rin]
        rin += 1
      curr += 1

    while lin < len(L):
      arr[curr] = L[lin]
      lin += 1
      curr += 1

    while rin < len(R):
      arr[curr] = R[rin]
      rin += 1
      curr += 1

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
  mergeSort(arr)
  print("{}: {}".format(n, time.time() - start_time))
  n += 2000