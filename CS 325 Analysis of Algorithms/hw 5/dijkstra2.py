#---------------------------------------------------------------dijkstra
def dijkstra(graph, V):
  distances = {vertex: float('infinity') for vertex in graph} # initialize, tmpay of shortest paths
  distances[V] = 0 # distance from V to V is 0
  tmp = [(V, 0)] # load start vertex, stack
  while len(tmp) > 0:
    currVertex, currDist = tmp.pop()
    if currDist > distances[currVertex]:
      continue # if shorter distance found previously, skip replacement
    
    for nextV, weight in graph[currVertex].items(): # check in order
      distance = currDist + weight # weight of (walk + new vertex)
      if distance < distances[nextV]: # relaxation
        distances[nextV] = distance # replace shorter walk
        tmp.append((nextV, distance)) 
  return distances

#---------------------------------------------------------------getDouble
# returns merged paths v with largest weight path between them
def getDouble(sources, paths):
  arr = []
  for i in range(len(sources)): # point 1
    tmp1 = []
    for v, w in paths[i].items():
      tmp1.append(w)

    for ii in range(i+1, len(sources)): # point 2
      tmp2 = tmp1[:] # copy

      iter = 0
      for v, w in paths[ii].items(): # merge point 1 & 2
        if(w < tmp2[iter]):
          tmp2[iter] = w
        iter += 1
      
      max = 0
      for w in tmp2: # get largest path
        if(w > max):
          max = w

      arr.append((sources[i]+sources[ii], max))
  return arr

#---------------------------------------------------------------output
# get paths from dijkstra, merge and sort double points, print best
def output(sources, graph):
  paths = []
  for source in sources:
    paths.append(dijkstra(graph, source)) # get shortest paths

  oVertex = getDouble(sources, paths)

  min = float('infinity')
  id = ''
  for v, w in oVertex:
    if(w < min):
      min = w
      id = v

  print(id)
      
#====================================================================main
def main():
  sources = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  graph = { 
    'A': {'C': 4, 'F': 7},
    'B': {'E': 9, 'H': 3},
    'C': {'A': 4, 'D': 3, 'F': 2, 'G': 9},
    'D': {'C': 3, 'E': 3, 'G': 7},
    'E': {'B': 9, 'D': 3, 'G': 2, 'H': 7},
    'F': {'A': 7, 'C': 2, 'G': 8},
    'G': {'C': 9, 'D': 7, 'E': 2, 'F': 8, 'H': 3},
    'H': {'B': 3, 'E': 7, 'G': 3}
  }
  output(sources, graph)

main()