/*
 * This is a small program to test your priority queue implementation.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "pq.h"

/*
 * This is a comparison function to be used with qsort() to sort an array of
 * integers into descending order.
 */
int descending_int_cmp(const void * a, const void * b) {
  return ( *(int*)b - *(int*)a );
}


int main(int argc, char** argv) {
  struct pq* pq;
  int* first, * removed;
  int i, k, p;
  const int n = 16, m = 16;
  int vals[n + m], ordered[n + m];

  /*
   * Seed the random number generator with a constant value, so it produces the
   * same sequence of pseudo-random values every time this program is run.
   */
  srand(0);

  /*
   * Create priority queue and insert pointers to pseudo-random integer values
   * into it with the same priority as the value.
   */
  pq = pq_create();
  printf("== Inserting some into PQ\n");
  for (int i = 0; i < n; i++) {
    vals[i] = rand() % 64;
    pq_insert(pq, &vals[i], vals[i]);
  }

  /*
   * Make a copy of the random value array and sort it by descending value.  We
   * make a copy here so we can maintain the original array in the same order,
   * thereby ensuring that pointer values stored in the priority queue always
   * point to the same integer values.
   */
  memcpy(ordered, vals, n * sizeof(int));
  qsort(ordered, n, sizeof(int), descending_int_cmp);

  /*
   * Examine and remove half of the values currently in the PQ.
   */
  k = 0;
  printf("\n== Removing some from PQ: first / removed / priority (expected)\n");
  while (k < n / 2) {
    //printf("getting priority\n");
    p = pq_max_priority(pq);
    //printf("done\n");
    //printf("getting data\n");
    first = pq_max(pq);
    //printf("done\n");
    //printf("getting dequeue\n");
    removed = pq_max_dequeue(pq);
    //printf("done\n");
    if (first && removed) {
      printf("  - %4d / %4d / %4d (%4d)\n", *first, *removed, p, ordered[k]);
    } else {
      printf("  - (NULL) / (NULL) / %4d (%4d)\n", p, ordered[k]);
    }
    k++;
  }

  /*
   * Add a second set of pseudo-random integer values to the end of the array,
   * and add pointers to those values into the priority queue with the same
   * priority as the value.
   */
  printf("\n== Inserting more into PQ\n");
  for (i = n; i < n + m; i++) {
    vals[i] = rand() % 64;
    pq_insert(pq, &vals[i], vals[i]);
  }

  /*
   * Copy the second array of random values to the end of the ordered array and
   * re-sort all of the the ordered array except the k values that were already
   * examined above (since they were already removed from the PQ, and we won't
   * see them again).  Again, we make a copy here so we can maintain the
   * original array in the same order, thereby ensuring that pointer values
   * stored in the priority queue always point to the same integer values.
   */
  memcpy(ordered + n, vals + n, m * sizeof(int));
  qsort(ordered + k, n - k + m, sizeof(int), descending_int_cmp);

  printf("\n== Removing remaining from PQ: first / removed / priority (expected)\n");
  while (k < n + m) {
    p = pq_max_priority(pq);
    first = pq_max(pq);
    removed = pq_max_dequeue(pq);
    if (first && removed) {
      printf("  - %4d / %4d / %4d (%4d)\n", *first, *removed, p, ordered[k]);
    } else {
      printf("  - (NULL) / (NULL) / %4d (%4d)\n", p, ordered[k]);
    }
    k++;
  }

  printf("\n== Is PQ empty (expect 1)? %d\n", pq_isempty(pq));

  pq_free(pq);
  return 0;

}
