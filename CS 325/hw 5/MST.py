import math # for math.sqrt()

#---------------------------------------------------------------minW
def minW(W, MST, V): 
  min = float('infinity')
  for i in range(V):
    if(W[i] < min and MST[i] == False): # smaller edge found
      min = W[i] 
      index = i 
  return index 

#---------------------------------------------------------------prim
def prim(V, graph): 
  W = [float('infinity')]*V # array of weights
  W[0] = 0 # set first to 0
  optimalV = [0]*V # array of optimal V's
  MST = [False]*V # array of checked V's with found smallest edge to it
  for count in range(V): 
    min = minW(W, MST, V) # get index of closest V
    MST[min] = True # current V
    for i in range(V): # check for smaller weights of V[min] neighbors
      if((graph[min][i] > 0) and (MST[i] == False) and (W[i] > graph[min][i])): 
        W[i] = graph[min][i] 
        optimalV[i] = min 
  return optimalV

#---------------------------------------------------------------output
def output(V, graph): 
  max = 0
  optimalV = prim(V, graph)
  for i in range(V): # add weights together
    max += graph[i][optimalV[i]]
  print(max)

#====================================================================main
def main():
  arr = [] # master array of file ints
  with open('graph.txt', 'r') as f: # get file as master array
    while True:
      line = f.readline() # get line from file
      if(not line): # check if line is eof
        break
      for i in line.split(): # get chars between space
        arr.append(int(i))

  cases = arr.pop(0) # get num of test cases
  for count in range(cases):
    print("Test case", count+1, ": MST weight", end = ' ')
    V = arr.pop(0) # get number of vertices
    sets = []
    for i in range(V): # get x, y of V's,put in sets
      tmp = []
      for ii in range(2):
        tmp.append(arr.pop(0))
      sets.append(tmp)

    graph = []
    for x1, y1 in sets: # get weights between V's, put in graph
      tmp = []
      for x2, y2 in sets:
        tmp.append(round(math.sqrt(pow((x1-x2),2) + pow((y1-y2),2))))
      graph.append(tmp)
    output(V, graph)

main()