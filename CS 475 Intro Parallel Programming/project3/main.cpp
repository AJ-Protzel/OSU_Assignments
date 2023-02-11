// g++ -o3 main.cpp -o main -lm -fopenmp
// ./main >& out.csv

#define _USE_MATH_DEFINES
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <omp.h>
#include <math.h>

using namespace std;

int	NowMonth; // 1-12 
int month; // track 1-72
int	NowYear; // 2022-2027

float NowPrecip; // inches of rain per month
float precipFactor;
float NowTemp; // temperature this month
float tempFactor;
float NowHeight; // grain height in inches
int	NowNumDeer; // number of deer in the current population
int	NowNumWolf; // number of wolves in the current population

const float GRAIN_GROWS_PER_MONTH = 9.0 * 2.54; // Units of grain growth are cm.
const float ONE_DEER_EATS_PER_MONTH = 1.0; // cm

const float AVG_PRECIP_PER_MONTH = 7.0 * 2.54;	// average
const float AMP_PRECIP_PER_MONTH = 6.0 * 2.54;	// plus or minus
const float RANDOM_PRECIP = 2.0 * 2.54;	// plus or minus noise

const float AVG_TEMP = (5. / 9.) * (60.0 - 32);	// average
const float AMP_TEMP = (5. / 9.) * (20.0 - 32);	// plus or minus
const float RANDOM_TEMP = (5. / 9.) * (10.0 - 32);	// plus or minus noise

const float MIDTEMP = (5. / 9.) * (40.0 - 32); // Units of temperature are degrees Fahrenheit (°C).
const float MIDPRECIP = (5. / 9.) * (10.0 - 32); // Units of precipitation are cm.

// const float GRAIN_GROWS_PER_MONTH = 9.0; // Units of grain growth are inches.
// const float ONE_DEER_EATS_PER_MONTH = 1.0; // inches

// const float AVG_PRECIP_PER_MONTH = 7.0;	// average
// const float AMP_PRECIP_PER_MONTH = 6.0;	// plus or minus
// const float RANDOM_PRECIP = 2.0;	// plus or minus noise

// const float AVG_TEMP = 60.0;	// average
// const float AMP_TEMP = 20.0;	// plus or minus
// const float RANDOM_TEMP = 10.0;	// plus or minus noise

// const float MIDTEMP = 40.0; // Units of temperature are degrees Fahrenheit (°F).
// const float MIDPRECIP = 10.0; // Units of precipitation are inches.

omp_lock_t Lock;
volatile int NumInThreadTeam;
volatile int NumAtBarrier;
volatile int NumGone;

unsigned int seed = 0;

float Ranf(unsigned int *seedp,  float low, float high){
	float r = (float)rand_r(seedp); // 0-RAND_MAX

	return(low + r * (high - low) / (float)RAND_MAX);
}

int Ranf(unsigned int *seedp, int ilow, int ihigh){
	float low = (float)ilow;
	float high = (float)ihigh + 0.9999f;

	return (int)(Ranf(seedp, low,high));
}

float SQR(float x){
	return x * x;
}

void InitBarrier(int n){
	NumInThreadTeam = n;
	NumAtBarrier = 0;
	omp_init_lock(&Lock);
}

void WaitBarrier(){
	omp_set_lock(&Lock);{
		NumAtBarrier++;
		if(NumAtBarrier == NumInThreadTeam){
			NumGone = 0;
			NumAtBarrier = 0;

			while(NumGone != NumInThreadTeam-1);
			omp_unset_lock(&Lock);

			return;
		}
	}
	omp_unset_lock(&Lock);

	while(NumAtBarrier != 0); // this waits for the nth thread to arrive

	#pragma omp atomic 
		NumGone++; // this flags how many threads have returned
}

void Watcher(){
	while(NowYear <= 2027){
		#pragma omp barrier
		#pragma omp barrier
			NowMonth++;
			month++;
			if(NowMonth > 12){
				NowYear++;
				NowMonth = 1;
			}

			float ang = (30. * (float)NowMonth + 15.) * (M_PI / 180.);

			float temp = AVG_TEMP - AMP_TEMP * cos(ang);
			NowTemp = temp + Ranf(&seed, -RANDOM_TEMP, RANDOM_TEMP);

			float precip = AVG_PRECIP_PER_MONTH + AMP_PRECIP_PER_MONTH * sin(ang);
			NowPrecip = precip + Ranf(&seed, -RANDOM_PRECIP, RANDOM_PRECIP);
			if(NowPrecip < 0.)
				NowPrecip = 0.;

			tempFactor = exp(-SQR((NowTemp - MIDTEMP) / 10.));
			precipFactor = exp(-SQR((NowPrecip - MIDPRECIP) / 10.));

			printf("%d,%f,%f,%f,%d,%d\n", month, NowTemp, NowPrecip, NowHeight, NowNumDeer, NowNumWolf);

		#pragma omp barrier
	}
}

void Deer(){
	while(NowYear <= 2027){
			int nextNumDeer = NowNumDeer;
			int carryingCapacity = (int)(NowHeight);

			if(nextNumDeer <= carryingCapacity){
				nextNumDeer++;
			}
			else if(nextNumDeer > carryingCapacity){
				nextNumDeer--;
			}
			
			else if(NowNumWolf >= ceil(NowNumDeer*0.25)){
				nextNumDeer--;
			}
			
			else if(nextNumDeer < 0){
				nextNumDeer = 0;
			}

		#pragma omp barrier
			NowNumDeer = nextNumDeer;

		#pragma omp barrier
		#pragma omp barrier
	}
}

void Grain(){
	while(NowYear <= 2027){
			float nextHeight = NowHeight;

			nextHeight += tempFactor * precipFactor * GRAIN_GROWS_PER_MONTH;
			nextHeight -= (float)NowNumDeer * ONE_DEER_EATS_PER_MONTH;
			
			if(nextHeight < 0.){ 
				nextHeight = 0.;
			}

		#pragma omp barrier
			NowHeight = nextHeight;

		#pragma omp barrier
		#pragma omp barrier
	}
}

// more grain -> more deer -> more wolves -> less deer -> more grain
int Wolves(){
	while(NowYear <= 2027){
			int nextNumWolf = NowNumWolf;
			int carryingCapacity = (floor(NowNumDeer/2));

			if(nextNumWolf < carryingCapacity){
				nextNumWolf++;
			}
			else if(nextNumWolf > carryingCapacity){
				nextNumWolf--;
			}

			else if(nextNumWolf < 0){
				nextNumWolf = 0;
			}

		#pragma omp barrier
			NowNumWolf = nextNumWolf;

		#pragma omp barrier
		#pragma omp barrier
	}
}

int main(){
	printf("month, NowTemp, NowPrecip, NowHeight, NowNumDeer, NowNumWolf\n");

	float x = Ranf(&seed, -1.f, 1.f);

	NowMonth = 0;
	month = 0;
	NowYear = 2022;
	NowNumDeer = 1;
	NowHeight = 7.85;

	omp_set_num_threads(4);	// = # of sections
	InitBarrier(4);
	#pragma omp parallel sections
	{
		#pragma omp section
		{
			Watcher(); // thread 0
		}
		#pragma omp section
		{
			Deer(); // thread 1
		}
		#pragma omp section
		{
			Grain(); // thread 2
		}
		#pragma omp section
		{
			Wolves(); // thread 3
		}
	}
}