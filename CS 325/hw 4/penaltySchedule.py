#---------------------------------------------------------------mergeSort
def mergeSort(arr):
  if(len(arr) > 1):
    mid = len(arr)//2

    L = arr[:mid]
    R = arr[mid:]

    mergeSort(L)
    mergeSort(R)

    curr = lin = rin = 0 # main ar index, left index, right index

    while lin < len(L) and rin < len(R):
      if(L[lin][0] < R[rin][0]):
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
penalty = 0
arr = [[4,7], [1,5], [2,3], [1,10], [4,9]]
mergeSort(arr) #sort the array by ascending deadline values
print(arr)

for i in range(len(arr)):
  if arr[i][0] <= i: # if the deadline is greater than the time already passed
    print("dropped:", arr[i])
    penalty += arr[i][1] # add penalty of that job to total penalty

print(penalty)