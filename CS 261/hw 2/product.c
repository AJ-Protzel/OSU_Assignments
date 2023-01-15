/*
 * Name: Adrien Protzel
 * Email: Protzela@oregonstate.edu
 */

#include<stdlib.h>
#include<string.h>

#include <stdio.h>
#include "products.h"
#include "dynarray.h"

struct product* create_product(char* name, int inventory, float price) {
  struct product* new_product = malloc(sizeof(struct product));
    char* allocated_string = malloc(sizeof(char) * (strlen(name) + 1)); //in notes
    //char* allocated_string = malloc(sizeof(char) * (strlen(name)));
    strcpy(allocated_string, name);

    new_product->name = allocated_string;
    new_product->inventory = inventory;
    new_product->price = price;
    
    return new_product;
};

void free_product(struct product* product) {
  //free(product->allocated_string);
  free(product->name);
  free(product);
}

struct dynarray* create_product_array(int num_products, char** names, int* inventory, float* prices) {
  struct dynarray* new_array = dynarray_create();

  for(int i = 0; i < num_products; ++i){
    dynarray_insert(new_array, i, create_product(names[i], inventory[i], prices[i]));
  }

  return new_array;
};

void free_product_array(struct dynarray* products) {
  struct product* data = malloc(sizeof(struct product));
  int size = dynarray_length(products);

  for(int i = 0; i < size; ++i){
    data = dynarray_get(products, i);
    free_product(data);
  }

  dynarray_free(products);
}

void print_products(struct dynarray* products) {
  struct product* data = malloc(sizeof(struct product));
  int size = dynarray_length(products);

  for(int i = 0; i < size; ++i){
    data = dynarray_get(products, i);
    printf("  - name: %s\tid: %d\tprice: %f\n", data->name, data->inventory, data->price);
  }
}

struct product* find_max_price(struct dynarray* products) {
  int n; // the n'th index which has the highest price
  float max = 0; // current highest price

  struct product* data = malloc(sizeof(struct product));
  int size = dynarray_length(products);

  for(int i = 0; i < size; ++i){
    data = dynarray_get(products, i);
    if(data->price > max){
      max = data->price;
      n = i;
    }
  }

  data = dynarray_get(products, n);

  return data; // is this a copy or pointer?
}

struct product* find_max_investment(struct dynarray* products) {
  int n; // the n'th index which has the highest price
  float max = 0; // current highest price

  struct product* data = malloc(sizeof(struct product));
  int size = dynarray_length(products);

  for(int i = 0; i < size; ++i){
    data = dynarray_get(products, i);
    if((data->price * data->inventory) > max){
      max = (data->price * data->inventory);
      n = i;
    }
  }

  data = dynarray_get(products, n);

  return data; // is this a copy or pointer?
}

void sort_by_inventory(struct dynarray* products) {
  int min; // min index
  struct product* mindata = malloc(sizeof(struct product));
  struct product* idata = malloc(sizeof(struct product));
  struct product* iidata = malloc(sizeof(struct product));
  struct product* tmpdata = malloc(sizeof(struct product));

  int size = dynarray_length(products);
  for(int i = 0; i < size-1; ++i){
    min = i;
    mindata = dynarray_get(products, i);

    for(int ii = i+1; ii < size; ++ii){
      iidata = dynarray_get(products, ii);

      if (iidata->inventory < mindata->inventory){
        min = ii;
        mindata = dynarray_get(products, min);
      }
    }
    mindata = dynarray_get(products, min);
    idata = dynarray_get(products, i);

    tmpdata = mindata;
    dynarray_set(products, min, idata);
    dynarray_set(products, i, tmpdata);
  }
}