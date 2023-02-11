// g++ -o3 main.cpp -o main -lm -fopenmp
// ./main >& out.csv

#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <ctime>
#include <sys/time.h> // ignor error
#include <sys/resource.h> // ignor error
#include <omp.h>

#define SSE_WIDTH 4
#define ALIGNED __attribute__((aligned(16)))

#ifndef NUMTRIES
	#define NUMTRIES 100
#endif

#ifndef ARRAYSIZE
	#define ARRAYSIZE 1024*1024
#endif

ALIGNED float A[ARRAYSIZE];
ALIGNED float B[ARRAYSIZE];
ALIGNED float C[ARRAYSIZE];

//-----------------------------------------------------------------------------------------------------------------------------NonSimdMul
void NonSimdMul(float *A, float *B, float *C, int n){
	for(int i = 0; i < n; i++){
		C[i] = A[i] * B[i];
	}
}

//-----------------------------------------------------------------------------------------------------------------------------NonSimdMulSum
float NonSimdMulSum(float *A, float *B, int n){
	for(int i = 0; i < n; i++){
		C[i] = A[i] * B[i];
	}

	float sum;
	for(int i = 0; i < n; i++){
		sum += C[i];
	}

	return sum;
}

//-----------------------------------------------------------------------------------------------------------------------------SimdMul
void SimdMul(float *a, float *b, float *c, int len){
	int limit = (len/SSE_WIDTH) * SSE_WIDTH;
	__asm(
		".att_syntax\n\t"
		"movq    -24(%rbp), %r8\n\t" // a
		"movq    -32(%rbp), %rcx\n\t" // b
		"movq    -40(%rbp), %rdx\n\t" // c
	);

	for(int i = 0; i < limit; i += SSE_WIDTH){
		__asm(
			".att_syntax\n\t"
			"movups	(%r8), %xmm0\n\t" // load the first sse register
			"movups	(%rcx), %xmm1\n\t" // load the second sse register
			"mulps	%xmm1, %xmm0\n\t" // do the multiply
			"movups	%xmm0, (%rdx)\n\t" // store the result
			"addq $16, %r8\n\t"
			"addq $16, %rcx\n\t"
			"addq $16, %rdx\n\t"
		);
	}

	for(int i = limit; i < len; i++){
		c[i] = a[i] * b[i];
	}
}

//-----------------------------------------------------------------------------------------------------------------------------SimdMulSum
float SimdMulSum(float *a, float *b, int len){
	float sum[4] = { 0., 0., 0., 0. };
	int limit = ( len/SSE_WIDTH ) * SSE_WIDTH;

	__asm(
		".att_syntax\n\t"
		"movq    -40(%rbp), %r8\n\t" // a
		"movq    -48(%rbp), %rcx\n\t" // b
		"leaq    -32(%rbp), %rdx\n\t" // &sum[0]
		"movups	 (%rdx), %xmm2\n\t" // 4 copies of 0. in xmm2
	);

	for(int i = 0; i < limit; i += SSE_WIDTH){
		__asm(
			".att_syntax\n\t"
			"movups	(%r8), %xmm0\n\t" // load the first sse register
			"movups	(%rcx), %xmm1\n\t" // load the second sse register
			"mulps	%xmm1, %xmm0\n\t" // do the multiply
			"addps	%xmm0, %xmm2\n\t" // do the add
			"addq $16, %r8\n\t"
			"addq $16, %rcx\n\t"
		);
	}

	__asm(
		".att_syntax\n\t"
		"movups	 %xmm2, (%rdx)\n\t" // copy the sums back to sum[]
	);

	for(int i = limit; i < len; i++){
		sum[0] += a[i] * b[i];
	}

	return sum[0] + sum[1] + sum[2] + sum[3];
}

//-----------------------------------------------------------------------------------------------------------------------------multi
double multi(float *a, float *b){
	double maxPerformance = 0.;
	for(int t = 0; t < NUMTRIES; t++){
		double time0 = omp_get_wtime();
		NonSimdMul(A, B, C, ARRAYSIZE);
		double time1 = omp_get_wtime();
		double perf = (double)ARRAYSIZE / (time1 - time0);
		if(perf > maxPerformance)
			maxPerformance = perf;
	}
	double megaMults = maxPerformance / 1000000.;
	double mmn = megaMults;

	maxPerformance = 0.;
	for(int t = 0; t < NUMTRIES; t++){
		double time0 = omp_get_wtime();
		SimdMul(A, B, C, ARRAYSIZE);
		double time1 = omp_get_wtime();
		double perf = (double)ARRAYSIZE / (time1 - time0);
		if(perf > maxPerformance)
			maxPerformance = perf;
	}
	megaMults = maxPerformance / 1000000.;
	double mms = megaMults;
	double speedup = mms/mmn;

	fprintf(stderr, "%8.1f,%8.1f,%8.1f,", mmn, mms, speedup);
}

//-----------------------------------------------------------------------------------------------------------------------------sum
double sum(float *a, float *b){
	double maxPerformance = 0.;
	float sumn, sums;
	for(int t = 0; t < NUMTRIES; t++){
		double time0 = omp_get_wtime();
		sumn = NonSimdMulSum(A, B, ARRAYSIZE);
		double time1 = omp_get_wtime();
		double perf = (double)ARRAYSIZE / (time1 - time0);
		if(perf > maxPerformance)
			maxPerformance = perf;
	}
	double megaMultAdds = maxPerformance / 1000000.;
	double mmn = megaMultAdds;

	maxPerformance = 0.;
	for(int t = 0; t < NUMTRIES; t++){
		double time0 = omp_get_wtime();
		sums = SimdMulSum(A, B, ARRAYSIZE);
		double time1 = omp_get_wtime();
		double perf = (double)ARRAYSIZE / (time1 - time0);
		if(perf > maxPerformance)
			maxPerformance = perf;
	}
	megaMultAdds = maxPerformance / 1000000.;
	double mms = megaMultAdds;
	double speedup = mms/mmn;

	fprintf(stderr, "%8.1f,%8.1f,%8.1f\n", mmn, mms, speedup);
}

//=============================================================================================================================main
int main(int argc, char *argv[]){
	for(int i = 0; i < ARRAYSIZE; i++){
		A[i] = sqrtf((float)(i+1));
		B[i] = sqrtf((float)(i+1));
	}

	// ARRAYSIZE, NonSimdMul, SimdMul, MultiS, NonSimdMulSum, SimdMulSum, SumS
	fprintf(stderr, "%d,", ARRAYSIZE);

	double sm = multi(A, B);
	double ss = sum(A, B);
	
	return 0;
}