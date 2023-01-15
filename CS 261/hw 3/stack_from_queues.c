/*
 * Name: Adrien Protzel
 * Email: Protzela@oregonstate.edu
 */

#include <stdio.h>

#include <stdlib.h> // added for malloc(sizeof())
#include <assert.h> // added for assert

#include "queue.h"
#include "stack_from_queues.h"

struct stack_from_queues* stack_from_queues_create() {
  struct stack_from_queues* stack = malloc(sizeof(struct stack_from_queues));

  struct queue* q1 = queue_create();
  struct queue* q2 = queue_create();

  stack->q1 = q1;
  stack->q2 = q2;

  return stack;
}

void stack_from_queues_free(struct stack_from_queues* stack) {
  if((queue_isempty(stack->q1)) == 0)
  {
   queue_free(stack->q1);
  }

  if((queue_isempty(stack->q2)) == 0)
  {
   queue_free(stack->q2);
  }
}

int stack_from_queues_isempty(struct stack_from_queues* stack) {
  if((queue_isempty(stack->q1) && queue_isempty(stack->q2)) == 1)
  {
    return 1; // both empty
  }
  else
  {
    return 0; // not empty
  }
}

void stack_from_queues_push(struct stack_from_queues* stack, int value) {
  assert(stack);

  queue_enqueue(stack->q1, value);
}

int stack_from_queues_top(struct stack_from_queues* stack) {
  assert(stack->q2 != NULL);
  int value;

  value = queue_front(stack->q1);
  return value;
}

int stack_from_queues_pop(struct stack_from_queues* stack) {
  assert(stack->q1 != NULL);

  int value;
  int v;
  int size = 0;

  while(!(queue_isempty(stack->q1)))
  {
    value = queue_dequeue(stack->q1);
    queue_enqueue(stack->q2, value);
    size++;
  }

  for (int i = 0; i < size-1; ++i)
    { 

      value = queue_dequeue(stack->q2); 
      queue_enqueue(stack->q2, value); 
    } 

  v = queue_dequeue(stack->q2);

  while(!(queue_isempty(stack->q2)))
  {
    value = queue_dequeue(stack->q2);
    queue_enqueue(stack->q1, value);
  }
  
  return v;
}
