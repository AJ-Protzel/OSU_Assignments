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
      if(L[lin][1] < R[rin][1]):
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

#---------------------------------------------------------------schedule
def schedule(arr):
  ar = []

  ar.append(arr[0][0]) # take first
  num = arr[0][1] # start of last job

  for i in range(1, len(arr)):
    if(arr[i][2] <= num): # if deadline is less/equal to last start
      ar.append(arr[i][0]) # add to picked
      num = arr[i][1] # get new start

  return ar

#====================================================================main
def main():
  arr = [] # master array of file ints

  with open('act.txt', 'r') as f: # get file as master array
    while True:
      line = f.readline() # get line from file
      if(not line): # check if line is eof
        break
      for i in line.split(): # get chars between space
        arr.append(int(i))

  iter = 1
  while(arr):
    N = arr.pop(0) # get number of sets
    sets = [] # array of sets, activity number, start time, end time
    for i in range(N):
      tmp = []
      for ii in range(0, 3):
        tmp.append(arr.pop(0)) # get the three number of a set
      sets.append(tmp)

    mergeSort(sets) # sort by ascending start time
    sets.reverse()
    sets = schedule(sets) # call function to get picked jobs
    sets.reverse()

    print("Set", iter)
    print("Number of activities selected =", len(sets))
    for i in range(len(sets)):
      print(sets[i], end = ' ')
    print("\n")
    iter += 1

main()