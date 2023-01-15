#include <omp.h>
#include <stdio.h>
#include <math.h>

// #define NUMT  1     // number of threads to use [1,4]
#define SIZE  16384 // array size
#define NUMTRIES  9 // how many times to run the timing

float A[SIZE];
float B[SIZE];
float C[SIZE];

double pass(int NUMT){
    // inialize the arrays:
	for(int i = 0; i < SIZE; i++) {
		A[i] = 1.;
		B[i] = 2.;
	}

    omp_set_num_threads(NUMT);

    double maxMegaMults = 0.;

    for(int t = 0; t < NUMTRIES; t++) {
        double start = omp_get_wtime();

        #pragma omp parallel for
        for(int i = 0; i < SIZE; i++) {
            C[i] = A[i] * B[i];
        }

        double stop = omp_get_wtime();
        double megaMults = (double)SIZE/(stop-start)/1000000.;
        if(megaMults > maxMegaMults)
            maxMegaMults = megaMults;
    }

    printf("[%d] Peak Performance = %8.2lf MegaMults/Sec\n", NUMT, maxMegaMults);

    return maxMegaMults;
}

int main() {
    #ifndef _OPENMP
        fprintf(stderr, "OpenMP is not supported here -- sorry.\n");

        return 1;
    #endif

    double perf1 = pass(1);
    double perf4 = pass(4);

    double S = perf4 / perf1;
    float Fp = (4./3.) * (1. - (1./S));

    printf("S = %8.2lf , Fp = %8.2lf \n", S, Fp);

    return 0;
}