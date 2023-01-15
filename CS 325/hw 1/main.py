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
with open('data.txt') as f:
  while True:
    line = f.readline() # get line from file
    if not line: # check if line is eof
      break

    num = 0
    arr = []
    for word in line.split(): # get chars between space
      arr.append(int(word))

    num = int(arr.pop(0)) # remove length var
    marr = iarr = arr

    print("raw : ", arr)

    mergeSort(marr)
    print("mfix: ", marr)

    insertSort(iarr)
    print("ifix: ", iarr)
    
    print()