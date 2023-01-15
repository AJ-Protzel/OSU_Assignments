/*
 * Name: Adrien Protzel
 * Email: Protzela@oregonstate.edu
 */

#include <stdio.h>

#include "list_reverse.h"

struct node* list_reverse(struct node* first) {
  struct node* prev = NULL;
  struct node* curr = first;
  struct node* next = NULL;

  while(curr != NULL)
  {
    next = curr->next;
    curr->next = prev;
    prev = curr;
    curr = next;
  }
  first = prev;

  return first;
};
