/*
 * Name: Adrien Protzel
 * Email: protzela@oregonstate.edu
 */
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

#include "bst.h"

#include "stack.h"
#define bool int 

struct bst_node {
	int val;
	struct bst_node* left;
	struct bst_node* right;
};

struct bst {
	struct bst_node* root;
};

struct bst* bst_create() {
	struct bst* bst = malloc(sizeof(struct bst));
	assert(bst);
	bst->root = NULL;
	return bst;
}

void bst_free(struct bst* bst) {
	assert(bst);
	while (!bst_isempty(bst)) {
		bst_remove(bst->root->val, bst);
	}
	free(bst);
}

int bst_isempty(struct bst* bst) {
	assert(bst);
	return bst->root == NULL;
}

struct bst_node* _bst_node_create(int val) {
	struct bst_node* n = malloc(sizeof(struct bst_node));
	assert(n);
	n->val = val;
	n->left = n->right = NULL;
	return n;
}

struct bst_node* _bst_subtree_insert(int val, struct bst_node* n) {
	if (n == NULL) {
		return _bst_node_create(val);
	}
	else if (val < n->val) {
		n->left = _bst_subtree_insert(val, n->left);
	}
	else {
		n->right = _bst_subtree_insert(val, n->right);
	}
	return n;
}

void bst_insert(int val, struct bst* bst) {
	assert(bst);
	bst->root = _bst_subtree_insert(val, bst->root);
}

int _bst_subtree_min_val(struct bst_node* n) {
	while (n->left != NULL) {
		n = n->left;
	}
	return n->val;
}

struct bst_node* _bst_subtree_remove(int val, struct bst_node* n) {
	if (n == NULL) {
		return NULL;
	}
	else if (val < n->val) {
		n->left = _bst_subtree_remove(val, n->left);
		return n;
	}
	else if (val > n->val) {
		n->right = _bst_subtree_remove(val, n->right);
		return n;
	}
	else {
		if (n->left != NULL && n->right != NULL) {
			n->val = _bst_subtree_min_val(n->right);
			n->right = _bst_subtree_remove(n->val, n->right);
			return n;
		}
		else if (n->left != NULL) {
			struct bst_node* left_child = n->left;
			free(n);
			return left_child;
		}
		else if (n->right != NULL) {
			struct bst_node* right_child = n->right;
			free(n);
			return right_child;
		}
		else {
			free(n);
			return NULL;
		}
	}
}

void bst_remove(int val, struct bst* bst) {
	assert(bst);
	bst->root = _bst_subtree_remove(val, bst->root);
}

int bst_contains(int val, struct bst* bst) {
	assert(bst);
	struct bst_node* cur = bst->root;
	while (cur != NULL) {
		if (val == cur->val) {
			return 1;
		}
		else if (val < cur->val) {
			cur = cur->left;
		}
		else {
			cur = cur->right;
		}
	}
	return 0;
}
/*****************************************************************************
 *
 * Below are the functions and structures you'll implement in this assignment.
 *
 *****************************************************************************/
int bst_size(struct bst* bst) {
	assert(bst);
	struct bst_node* cur = bst->root;
	int size;

	if (cur == NULL)
	{
		return 0;
	}
	else
	{
		bst->root = cur->left;
		size = bst_size(bst);

		bst->root = cur->right;
		size += bst_size(bst);

		bst->root = cur;
		return size + 1;
	}
}

int bst_height(struct bst* bst) {
	assert(bst);
	struct bst_node* cur = bst->root;

	if (cur == NULL)
	{
		return -1;
	}
	else
	{
		bst->root = cur->left;
		int lheight = bst_height(bst);

		bst->root = cur->right;
		int rheight = bst_height(bst);

		if (lheight > rheight)
		{
			bst->root = cur;
			return lheight + 1;
		}
		else
		{
			bst->root = cur;
			return rheight + 1;
		}
	}
}

bool recur_sum(struct bst_node* cur, int sum)
{
	bool done = 0;
	int num = sum - cur->val;

	if (num == 0 && cur->left == NULL && cur->right == NULL)
	{
		return 1;
	}

	if (cur->left != NULL)
	{
		done = done || recur_sum(cur->left, num);
	}

	if (cur->right != NULL)
	{
		done = done || recur_sum(cur->right, num);
	}

	return done;
}

int bst_path_sum(int sum, struct bst* bst) {
	assert(bst);
	struct bst_node* cur = bst->root;
	return recur_sum(cur, sum);
}

struct bst_iterator {
	struct stack* s;
};

struct bst_iterator* bst_iterator_create(struct bst* bst) {
	assert(bst);

	struct bst_node* cur = bst->root;
	struct stack* stack = stack_create();
	struct bst_iterator* iter = malloc(sizeof(struct bst_iterator));

	iter->s = stack;
	stack_push(iter->s, cur);

	while (cur->left != NULL)
	{
		cur = cur->left;
		stack_push(iter->s, cur);
	}

	return iter;
};

int bst_iterator_has_next(struct bst_iterator* iter) {
	assert(iter);

	if (stack_isempty(iter->s))
	{
		return 0;
	}
	return 1;
}

int bst_iterator_next(struct bst_iterator* iter) {
	assert(iter);
  struct bst_node* pop = stack_pop(iter->s);

  if(pop->right != NULL)
  {
    stack_push(iter->s, pop->right);
    struct bst_node* top = stack_top(iter->s);

    while(top->left != NULL)
    {
      stack_push(iter->s, top->left);
      top = stack_top(iter->s);
    }
  }

  return pop->val;
}

void bst_iterator_free(struct bst_iterator* iter) {
	assert(iter);
	stack_free(iter->s);
	free(iter);
}
