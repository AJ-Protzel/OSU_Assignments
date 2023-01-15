/*
 * Name: Adrien Protzel
 * Email: protzela@oregonstate.edu
 */

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h> 

#include "pq.h"
#include "dynarray.h"

struct pq_node{
  void* data;
  int priority;
};

struct pq{
  struct dynarray* d;
};

struct pq* pq_create() {
  struct pq* pq = malloc(sizeof(struct pq));
  struct dynarray* dynarray = dynarray_create();

  pq->d = dynarray;
    
	return pq;
};

void pq_free(struct pq* pq) {
  assert(pq);
  dynarray_free(pq->d);
	free(pq);
}

int pq_isempty(struct pq* pq) {
  assert(pq);
  int n = dynarray_length(pq->d);
  if(n <= 0)
  {
    return true;
  }
  return false;
}

void pq_insert(struct pq* pq, void* data, int priority){
  struct pq_node* node1 = malloc(sizeof(struct pq_node));
  struct pq_node* node2 = malloc(sizeof(struct pq_node));

  node1->data = data;
  node1->priority = priority;

  int n = dynarray_length(pq->d);
  if(n <= 0)
  {
    dynarray_insert(pq->d, 0, node1);
  }
  else
  {
    bool done = false;
    for(int i = 0; i < n && done == false; ++i)
    {
      node2 = dynarray_get(pq->d, i);
      if(priority > node2->priority)
      {
        dynarray_insert(pq->d, i, node1);
        done = true;
      }
    }
    if(done == false)
    {
      dynarray_insert(pq->d, -1, node1);
      done = true;
    }
  }
}

int pq_max_priority(struct pq* pq) {
  struct pq_node* node = malloc(sizeof(struct pq_node));
  node = dynarray_get(pq->d, 0);

  return node->priority;
}

void* pq_max(struct pq* pq) {
  struct pq_node* node = malloc(sizeof(struct pq_node));
  node = dynarray_get(pq->d, 0);

  return node->data;
}

void* pq_max_dequeue(struct pq* pq) {
  struct pq_node* node = malloc(sizeof(struct pq_node));
  node = dynarray_get(pq->d, 0);
  dynarray_remove(pq->d, 0);
  return node->data;
}