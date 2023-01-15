# credits for base: https://www.educative.io/edpresso/merge-sort-in-python
#---------------------------------------------------------------mergeSort3
# this catches an array,
# splits into thirds recursily
# then sorts and returns
def mergeSort3(arr):
  if len(arr) > 1:
    if len(arr) % 3 == 0: # check if array size is %3
      m1 = (len(arr))//3
    else:
      m1 = (len(arr)+1)//3 # size up for odd split
    if m1 <= 0: # fill from first to last array
      m1 = 1
    m2 = m1+m1

    arr1 = arr[:m1]
    arr2 = arr[m1:m2]
    arr3 = arr[m2:]

    mergeSort3(arr1)
    mergeSort3(arr2)
    mergeSort3(arr3)

    i1 = i2 = 0 # indexes
    arrt = [] # tmp array

    while i1 < len(arr1) and i2 < len(arr2): # sort arr1 and arr2 into array tmp
      if arr1[i1] < arr2[i2]:
        arrt.append(arr1[i1])
        i1 += 1
      else:
        arrt.append(arr2[i2])
        i2 += 1

    while i1 < len(arr1): # clean up arr1
      arrt.append(arr1[i1])
      i1 += 1

    while i2 < len(arr2): # clean up arr2
      arrt.append(arr2[i2])
      i2 += 1

    curr = it = i3 = 0

    while it < len(arrt) and i3 < len(arr3): # sort array tmp and arr3 into arr
      if arrt[it] < arr3[i3]:
        arr[curr] = arrt[it]
        it += 1
      else:
        arr[curr] = arr3[i3]
        i3 += 1
      curr += 1

    while it < len(arrt): # clean up array tmp
      arr[curr] = arrt[it]
      it += 1
      curr += 1

    while i3 < len(arr3): # clean up arr3
      arr[curr] = arr3[i3]
      i3 += 1
      curr += 1

#====================================================================main
from numpy import random # random
import time

print("Running, please wait...")

MAX = 10 # number of iterations for average
coutner = 0 # counter for MAX
times = [] # array to store times
row = []
while coutner < MAX:
  n = 2000 # start at 2000
  while n <= 20000: # run 10 iterations
    i = 0
    arr = []
    while i < n: # load array with random numbers
      arr.append(random.randint(10000))
      i += 1
    start_time = time.time() # start time
    mergeSort3(arr)
    row.append(time.time() - start_time)
    n += 2000 # increment to next iteration
  times.append(row)
  row = []
  coutner += 1

print("----------------------------")

n = 2000
a = []
for i in range(MAX): # get ave of each n time
  sum = 0
  a = [row[i] for row in times]
  for elem in a:
    sum += elem
  sum /= MAX
  print("{}: {}".format(n, sum))
  n += 2000