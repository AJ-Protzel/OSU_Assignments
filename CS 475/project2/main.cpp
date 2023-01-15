// g++ -o3 main.cpp -o main -lm -fopenmp
// ./main

#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <time.h>
#include <omp.h>

#define XMIN -1.
#define XMAX 1.
#define YMIN -1.
#define YMAX 1.

const float N = 2.5f;
const float R = 1.2f;

int NUMT = 1;
int NUMNODES = 4;
int NUMTIMES = 20;

void TimeOfDaySeed() {
	struct tm y2k = {0};
	y2k.tm_hour = 0;   y2k.tm_min = 0; y2k.tm_sec = 0;
	y2k.tm_year = 100; y2k.tm_mon = 0; y2k.tm_mday = 1;

	time_t  timer;
	time(&timer);
	double seconds = difftime(timer, mktime(&y2k));
	unsigned int seed = (unsigned int)(1000.*seconds); // milliseconds
	srand(seed);
}

float Height(int iu, int iv){ // iu,iv = 0 .. NUMNODES-1
	float x = -1. + 2. * (float)iu / (float)(NUMNODES-1); // -1 to +1
	float y = -1. + 2. * (float)iv / (float)(NUMNODES-1); // -1 to +1

	float rn = pow(fabs(R), (double)N);
	float xn = pow(fabs(x), (double)N);
	float yn = pow(fabs(y), (double)N);
	float r = rn - xn - yn;

	if(r <= 0.)
		return 0.;

	float height = pow(r, 1. / (double)N);

	return height;
}

int main(int argc, char *argv[]){
	if(argc >= 2)
        NUMT = atoi(argv[1]);
    if(argc >= 3)
        NUMNODES = atoi(argv[2]);

	TimeOfDaySeed();
	omp_set_num_threads(NUMT);

	float area = (((XMAX - XMIN) / (float)(NUMNODES-1)) * ((YMAX - YMIN) / (float)(NUMNODES-1)));
	double maxPerformance = 0.;
	float volume;

	for(int times = 0; times < NUMTIMES; times++) {
        double time0 = omp_get_wtime();

		volume = 0;

		#pragma omp parallel for collapse(2) default(none), shared(NUMNODES, area), reduction(+:volume)
		for(int iv = 0; iv < NUMNODES; iv++){
			for(int iu = 0; iu < NUMNODES; iu++){
				float z = Height(iu, iv);

				if((iv==0 && iu==0) || (iv==NUMNODES-1 && iu==0) || (iv==0 && iu==NUMNODES-1) || (iv==NUMNODES-1 && iu==NUMNODES-1)){
				// corner = (area * z) * 0.25 = 0
					volume += (area * z) * 0.25;
				}
				else if(iv==0 || iu==0 || iv==NUMNODES-1 || iu==NUMNODES-1){
				// side = (area * z) * 0.5
					volume += (area * z) * 0.5;
				}
				else{
				// inner = (area * z)
					volume += (area * z);
				}
			}
		}
		double time1 = omp_get_wtime();
		// double dt = (time1 - time0) / (float)NUMTIMES;
		double dt = (float)(NUMNODES*NUMNODES)/((time1 - time0) / (float)NUMTIMES)/1000000.;
		if(dt > maxPerformance)
			maxPerformance = dt;

		// threads, sidexside, time, volume
		// fprintf(stderr, "%6d,%6d,%8.1f,%8.3f\n", NUMT, NUMNODES, (float)(NUMNODES*NUMNODES)/dt/1000000., volume);
	}
	fprintf(stderr, "%6d,%6d, %6.2lf\n", NUMT, NUMNODES, maxPerformance);
}