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
  
#====================================================================main
def main():
  V = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
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

  oVertex = []
  Viter = 0

  for source in V:
    arr = dijkstra(graph, source) # get shortest paths
    ver = ''
    max = 0
    for vertex, path in arr.items():
      if(path > max): # find longest path in V arr
        max = path
        ver = V[Viter]
    oVertex.append([ver, max])
    Viter += 1

  ver = ''
  min = float('infinity')
  for vertex, path in oVertex: # find shortest longest path of V's
    if(path < min):
      min = path
      ver = vertex
  print(ver, min)

main()