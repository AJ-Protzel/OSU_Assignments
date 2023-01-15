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

    num = int(arr.pop(0))
    print("raw : ", arr)
    insertSort(arr)
    print("ifix: ", arr)
    print()