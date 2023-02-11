/*
 * Name: Adrien Protzel
 * Email: Protzela@oregonstate.edu
 */

#include <stdio.h>

#include <stdlib.h> // added for malloc(sizeof())
#include <assert.h> // added for assert

#include "stack.h"
#include "queue_from_stacks.h"

struct queue_from_stacks* queue_from_stacks_create() {
  struct queue_from_stacks* queue = malloc(sizeof(struct queue_from_stacks));

  struct stack* s1 = stack_create();
  struct stack* s2 = stack_create();

  queue->s1 = s1;
  queue->s2 = s2;

  return queue;
};

void queue_from_stacks_free(struct queue_from_stacks* queue) {
  if((stack_isempty(queue->s1)) == 0)
  {
    stack_free(queue->s1);
  }

  if((stack_isempty(queue->s1)) == 0)
  {
    stack_free(queue->s2);
  }
}

int queue_from_stacks_isempty(struct queue_from_stacks* queue) {
  if((stack_isempty(queue->s1) && stack_isempty(queue->s2)) == 1)
  {
    return 1; // both empty
  }
  else
  {
    return 0; // not empty
  }
}

void queue_from_stacks_enqueue(struct queue_from_stacks* queue, int value) {
  assert(value);

  stack_push(queue->s1, value);
}

int queue_from_stacks_front(struct queue_from_stacks* queue) {
  assert(queue->s2 != NULL);

  int value;

  if(stack_isempty(queue->s1))
  {
    while(!(stack_isempty(queue->s2)))
    {
      value = stack_pop(queue->s2);
      stack_push(queue->s1, value);
    }
  }

  value = stack_top(queue->s1);

  return value;
}

int queue_from_stacks_dequeue(struct queue_from_stacks* queue) {
  assert(queue->s1 != NULL);

  int value;

  if(stack_isempty(queue->s2))
  {
    while(!(stack_isempty(queue->s1)))
    {
      value = stack_pop(queue->s1);
      stack_push(queue->s2, value);
    }
  }

  value = stack_pop(queue->s2);

  return value;
}
