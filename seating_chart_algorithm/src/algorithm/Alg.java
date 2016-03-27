package algorithm;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;
import java.util.Collections;

public class Alg {

	private IOParser inputParser;
	
	public Chart Algorithm(File seatingChartFile, File employeeFile, File similarityFile, boolean defaultBool, boolean random, boolean chartJson, boolean employeeJson) throws FileNotFoundException{
		//Code for reading from our test file:
		File employeeInputFile;
		if(defaultBool){
			employeeInputFile = new File("C:\\Users\\Jack Bankston\\Desktop\\EmployeeTestData.csv");
		}
		else{
			employeeInputFile = employeeFile;
		}
		

		File chartInputFile;
		if(defaultBool){
			chartInputFile = new File("C:\\Users\\Jack Bankston\\Desktop\\ChartTestData.csv");
		}
		else{
			chartInputFile = seatingChartFile;
		}
		
		inputParser = new IOParser(employeeInputFile, chartInputFile, similarityFile, chartJson, employeeJson);
		
		ArrayList<Employee> listOfEmployees = inputParser.getEmployeeArrayList();
		int floorplan[][] = inputParser.getChartIntegerArray();
		
		
		
		Chart seatingChart = new Chart();
		
		//Handle SpecialLocations:
		seatingChart.findSpecialLocations(floorplan);
		//System.out.println("Number of special locations: " + seatingChart.getNumberOfSpecialLocations());
		
		//Handle Employees:
		seatingChart.setNumberOfEmployees(listOfEmployees.size());
		seatingChart.setEmployeeSimilaritiesArray(inputParser.getEmployeeSimilaritiesArray());
		
		/*if(similarityFile == null){
			seatingChart.findEmployeeSimilarities(listOfEmployees);
		}
		else{
			
		}*/
		
		//Handle Walls:
		seatingChart.newFindWalls(floorplan);
		//System.out.println("Number of walls: " + seatingChart.getNumberOfWalls());
		//seatingChart.printWalls();
	
		//Handle Clusters:
		seatingChart.findClusters(floorplan);
		seatingChart.findClusterSimilarities();
		//seatingChart.printClusters();
		
		
		if(random){
			randomAssignment(seatingChart, listOfEmployees);
			return seatingChart;
		}
	
		oneDeskClusterAssignments(seatingChart,listOfEmployees);
		Employee[][] pairs = findPairs(seatingChart, listOfEmployees);
		double[][] pairToPairSimilarities = computePairToPairSimilarities(seatingChart.getEmployeeSimilaritiesArray(), pairs);		
		//assignPairsToClusters(seatingChart,pairs,pairToPairSimilarities);
		newAssignPairsToClusters(seatingChart,pairs,pairToPairSimilarities);
		double[][] sharedSimilarities = computeSharedSimilarities(seatingChart, listOfEmployees);
		assignToClusters(seatingChart, sharedSimilarities, listOfEmployees);
		assignAllEmployees(seatingChart, sharedSimilarities, listOfEmployees);
		
		/*for(int i = 0; i < listOfEmployees.size(); i++){
			System.out.println("Employee " + i + ": " + listOfEmployees.get(i).getTotalSimilarity());
		}*/
		
		inputParser.createOutputFile(seatingChart);
		
		return seatingChart;
	}
	
	public void printDistances(Chart chart){
		System.out.println("DISTANCES:");
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			for(int j = 0; j < chart.getNumberOfClusters(); j++){
				System.out.println("\t" + i + " to " + j + ": " + chart.getCluster(i).getMiddle().squaredDistanceToPoint(chart.getCluster(j).getMiddle()));
			}
		}
	}
		
	//Returns an array with all of the pairs of employees. 
	public Employee[][] findPairs(Chart chart, ArrayList<Employee> employees){
		double similarities[][] = chart.getEmployeeSimilaritiesArray();
		
		//Find the most similar pairs, and assign one to each cluster in the chart. 
		double currentHighest;
		int x = 0; 
		int y = 0;
		
		int numberOfOneDeskClusters = 0;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			if(chart.getCluster(i).onlyOneDesk()){
				numberOfOneDeskClusters++;
			}
		}
		
		//System.out.println("Number of one desk clusters: " + numberOfOneDeskClusters);
		
		Employee pairedEmployees[][] = new Employee[chart.getNumberOfClusters() - numberOfOneDeskClusters][2];
		
		int numberOfEmployees = employees.size();
		int c = 0;
		for(int n = 0; n < chart.getNumberOfClusters(); n++){ //We want one pair for each cluster.
			if(!chart.getCluster(n).onlyOneDesk()){ //If the current cluster has more than one desk.
				currentHighest = 0;
				for(int i = 0; i < numberOfEmployees; i++){ //Go through every spot in the array.
					for(int j = 0; j < numberOfEmployees; j++){
						//If we've found a new highest pair and neither is already in a pair. 
						if(similarities[i][j] > currentHighest && !employees.get(i).partOfPair() && !employees.get(j).partOfPair()){ 
							currentHighest = similarities[i][j];
							x = i;
							y = j;
						}
					}
				}	
				pairedEmployees[c][0] = employees.get(x);
				employees.get(x).setPartOfPair(true);
				pairedEmployees[c][1] = employees.get(y);
				employees.get(y).setPartOfPair(true);
				c++;
			}
		}
		
		return pairedEmployees;
	}
	
	//Returns an array containing each pair's similarity to all of the other pairs.
	public double[][] computePairToPairSimilarities(double[][] similarities, Employee[][] pairs){
		double[][] pairToPair = new double[pairs.length][pairs.length]; 
		double similarity1, similarity2;
		
		for(int i = 0; i < pairs.length; i++){ //For each pair:
			//Compute the first employee in the pair's similarity to each other pair (by 
			//	averaging the employee's similarity to the two employees in a given pair).
			for(int j = 0; j < pairs.length; j++){//For each pair:
				if(i == j){ //Are we comparing this employee to its own pair?
					pairToPair[i][j] = -1000;
				}
				else{ //Okay, we're not comparing this employee to its own pair.
					//We want to assign pairToPair[i][j] to be equal to the average of
					//	this employee's similarity to each of the employees in the jth pair.
					similarity1 = similarities[pairs[i][0].getSpotInArray()][pairs[j][0].getSpotInArray()];
					similarity2 = similarities[pairs[i][0].getSpotInArray()][pairs[j][1].getSpotInArray()];
					if(similarity1 < 0 || similarity2 < 0){ //One of these employees has been blacklisted.
						pairToPair[i][j] = -1.0;
					}
					else{
						pairToPair[i][j] = (similarity1 + similarity2) / 2;
					}
				}
			}
			
			//Now let's do the same thing with the second employee in the pair, and average these similarities
			//	with the similarities from the first employee in the pair.
			for(int j = 0; j < pairs.length; j++){//For each pair:
				if(i != j){ //Okay, we're not comparing this employee to its own pair.
					//We want to assign pairToPair[i][j] to be equal to the average of
					//	this employee's similarity to each of the employees in the jth pair.
					similarity1 = similarities[pairs[i][1].getSpotInArray()][pairs[j][0].getSpotInArray()];
					similarity2 = similarities[pairs[i][1].getSpotInArray()][pairs[j][1].getSpotInArray()];
					if(similarity1 < 0 || similarity2 < 0){ //One of these employees has been blacklisted.
						pairToPair[i][j] = -1.0;
					}
					else if (pairToPair[i][j] >= 0){ //Making sure it wasn't blacklisted by the first employee somehow.
						pairToPair[i][j] = (pairToPair[i][j] + ((similarity1 + similarity2) / 2)) / 2; //Average this employees scores with the first's. 
					}
				}
			}
		}
		
		return pairToPair;
	}
	
	public void newAssignPairsToClusters(Chart chart, Employee[][] pairs, double[][] pairToPairSimilarities){
		int numberOfPairs = pairToPairSimilarities.length;
		int numberOfClusters = chart.getNumberOfClusters();
		//System.out.println("Number of clusters: " + numberOfClusters);
		
		Cluster currentMostSimilarPairOfClusters[];
		int currentMostSimilarPairOfPairs[]; //Indexes of employees
		int firstPairIndex, secondPairIndex;
		for(int i = 0; i < numberOfClusters; i++){
			currentMostSimilarPairOfClusters = getMostSimilarPairOfClusters(chart);
			//Assign a pair of pairs to the pair of clusters.
			//3 scenarios:
			//	A) neither cluster has been assigned a pair
			//  B) cluster 0 has been assigned a pair but not cluster 1
			//  C) cluster 1 has been assigned a pair but not cluster 0
			
			if(!(currentMostSimilarPairOfClusters[0].hasBeenAssignedAPair() || currentMostSimilarPairOfClusters[1].hasBeenAssignedAPair())){ //Scenario A
				//Assign the most similar pair of pairs (where neither pair has been assigned to a cluster) to this pair of clusters
				currentMostSimilarPairOfPairs = getMostSimilarPairOfPairs(pairToPairSimilarities, pairs);
				firstPairIndex = currentMostSimilarPairOfPairs[0];
				secondPairIndex = currentMostSimilarPairOfPairs[1];
				//System.out.println("First pair: " + firstPairIndex + "\nSecond pair: " + secondPairIndex);
				currentMostSimilarPairOfClusters[0].assignPairOfEmployees(pairs[firstPairIndex][0],pairs[firstPairIndex][1]);
				currentMostSimilarPairOfClusters[1].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
				i++; //An extra increment, since two clusters were assigned this time instead of 1. 
			}
			else if(currentMostSimilarPairOfClusters[0].hasBeenAssignedAPair()){ //Scenario B
				//Assign the pair that is most similar to the pair at cluster 0 to cluster 1.
				int lockedPairIndex = 0;
				Employee firstPairedEmployee = currentMostSimilarPairOfClusters[0].getPairedEmployee1();
				boolean looking = true;
			
				while(looking){
					if(pairs[lockedPairIndex][0].getSpotInArray() == firstPairedEmployee.getSpotInArray()){
						looking = false;
					}
					else{
						lockedPairIndex++;
					}
				}
				currentMostSimilarPairOfPairs = getMostSimilarPairOfPairs(pairToPairSimilarities, lockedPairIndex, pairs);
				
				secondPairIndex = currentMostSimilarPairOfPairs[1];
				
				//System.out.println("First pair: " + lockedPairIndex + "\nSecond pair: " + secondPairIndex);
				currentMostSimilarPairOfClusters[1].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
			}
			else{ //Scenario C
				//Assign the pair that is most similar to the pair at cluster 1 to cluster 0.
				int lockedPairIndex = 0;
				Employee firstPairedEmployee = currentMostSimilarPairOfClusters[1].getPairedEmployee1();
				boolean looking = true;
			
				while(looking){
					if(pairs[lockedPairIndex][0].getSpotInArray() == firstPairedEmployee.getSpotInArray()){
						looking = false;
					}
					else{
						lockedPairIndex++;
					}
				}
				currentMostSimilarPairOfPairs = getMostSimilarPairOfPairs(pairToPairSimilarities, lockedPairIndex, pairs);
				
				secondPairIndex = currentMostSimilarPairOfPairs[1];
				
				//System.out.println("First pair: " + secondPairIndex + "\nSecond pair: " + lockedPairIndex);
				currentMostSimilarPairOfClusters[0].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
			}
		}
		
	}
	
	private int[] getMostSimilarPairOfPairs(double[][] pairToPairSimilarities, Employee[][] pairs){
		int pair[] = new int[2];
		double maxSimilarity = 0;
		int numberOfPairs = pairToPairSimilarities.length;
		boolean firstPairAvailable, secondPairAvailable;
		for(int i = 0; i < numberOfPairs; i++){
			firstPairAvailable = pairs[i][0].waitingToBeAssigned();
			
			if(firstPairAvailable){
				for(int j = 0; j < numberOfPairs; j++){
					secondPairAvailable = pairs[j][0].waitingToBeAssigned();
					if(pairToPairSimilarities[i][j] > maxSimilarity && secondPairAvailable){
						//System.out.println("Max: " + maxSimilarity + " Pair 1: " + i + " Pair 2: " + j);
						maxSimilarity = pairToPairSimilarities[i][j];
						pair[0] = i;
						pair[1] = j;
					}
				}				
			}
		}
		return pair;
	}
	
	private int[] getMostSimilarPairOfPairs(double[][] pairToPairSimilarities, int lockedPair, Employee[][] pairs){
		int pair[] = new int[2];
		pair[0] = lockedPair;
		double maxSimilarity = 0;
		int numberOfPairs = pairToPairSimilarities.length;
		boolean pairAvailable;
		for(int i = 0; i < numberOfPairs; i++){
			pairAvailable = pairs[i][0].waitingToBeAssigned();
			if(pairToPairSimilarities[lockedPair][i] > maxSimilarity && pairAvailable){
				//System.out.println("Max: " + maxSimilarity + " Pair 1: " + lockedPair + " Pair 2: " + i);
				maxSimilarity = pairToPairSimilarities[lockedPair][i];
				pair[1] = i;
			}
		}
		return pair;
	}
	
	//Assigns employees to every cluster that has only one desk.
	private void oneDeskClusterAssignments(Chart chart, ArrayList<Employee> employees){
		//Iterate through clusters.
		//	- If a cluster has only one desk, assign it the employee with the lowest total similarity.
		
		int numberOfClusters = chart.getNumberOfClusters();
		for(int i = 0; i < numberOfClusters; i++){
			if(chart.getCluster(i).onlyOneDesk()){
				Employee lowestSimilarityEmployee = getLowestSimilarityEmployee(employees);
				chart.getCluster(i).assignToDesk(lowestSimilarityEmployee);
				lowestSimilarityEmployee.setPartOfPair(true);
			}
		}
		

	}
	
	private Employee getLowestSimilarityEmployee(ArrayList<Employee> employees){
		int numberOfEmployees = employees.size();
		double currentLowestSimilarity = 1000000;
		Employee lowestEmployee = null;
		
		for(int i = 0; i < numberOfEmployees; i++){
			if(currentLowestSimilarity == 1000000 && employees.get(i).waitingToBeAssigned()){
				currentLowestSimilarity = employees.get(i).getTotalSimilarity();
				lowestEmployee = employees.get(i);
			}
			else if((employees.get(i).getTotalSimilarity() < currentLowestSimilarity) && employees.get(i).waitingToBeAssigned()){
				lowestEmployee = employees.get(i);
				currentLowestSimilarity = employees.get(i).getTotalSimilarity();
			}
		}
		return lowestEmployee;
	}
	
	private Cluster[] getMostSimilarPairOfClusters(Chart chart){
		Cluster pair[] = new Cluster[2];
		double maxSimilarity = -1;
		double currentSimilarity;
		int numberOfClusters = chart.getNumberOfClusters();
		int currMaxI = 0;
		int currMaxJ = 0;
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				currentSimilarity = chart.getSpecificClusterSimilarity(i, j);
				if(currentSimilarity > maxSimilarity && (!chart.getCluster(i).hasBeenAssignedAPair() || !chart.getCluster(j).hasBeenAssignedAPair())){
					maxSimilarity = currentSimilarity;
					currMaxI = i;
					currMaxJ = j;
				}
			}
		}
		pair[0] = chart.getCluster(currMaxI);
		pair[1] = chart.getCluster(currMaxJ);
		//System.out.println("Clusters " + currMaxI + " and " + currMaxJ);
		return pair;
	}
	
	//Assigns pairs to clusters in the chart, based on the clusters' similarities to each other and the pairs'
	//	similarities to each other.
	public void assignPairsToClusters(Chart chart, Employee[][] pairs, double[][] pairToPairSimilarities){
		//I have no proof that the below method is that great, but it will have to work for now:
		
		//Works as long as the number of pairs is the same as the number of clusters we're working with at this point.
		int numberOfPairs = pairToPairSimilarities.length;
		double pairToPairSums[][] = new double[2][numberOfPairs];
		double clusterSums[][] = new double[2][numberOfPairs];
		for(int i = 0; i < numberOfPairs; i++){
			pairToPairSums[0][i] = i;
			clusterSums[0][i] = i;
			for(int j = 0; j < numberOfPairs; j++){
				pairToPairSums[1][i] += pairToPairSimilarities[i][j];
				clusterSums[1][i] += chart.getSpecificClusterSimilarity(i, j);
			}
		}
		
		//System.out.println("Pair to Pair Array (unsorted):");
		//printSumArray(pairToPairSums);
		//System.out.println("Pair to Pair Array (sorted):");
		pairToPairSums = sortArrayOfSums(pairToPairSums);
		//printSumArray(pairToPairSums);
		
		//System.out.println("Cluster Array (unsorted):");
		//printSumArray(clusterSums);
		//System.out.println("Cluster Array (sorted):");
		clusterSums = sortArrayOfSums(clusterSums);
		//printSumArray(clusterSums);
		
		//Okay, now we assign the most popular pair to the most popular cluster, and the 
		//	second most popular pair to the second most popular cluster, and so on...
		for(int i = 0; i < numberOfPairs; i++){
			//Assign the pair at spot i in array of pairToPairSums to the cluster at 
			//	spot i in the array of clusterSums;
			chart.getCluster((int)clusterSums[0][i]).assignPairOfEmployees(pairs[(int)pairToPairSums[0][i]][0], pairs[(int)pairToPairSums[0][i]][1]);
		}
	}
	
	//For testing
	public void printSumArray(double[][] sumArray){
		for(int i = 0; i < sumArray[0].length; i++){
			System.out.println("" + sumArray[0][i] + ": " + sumArray[1][i]);
		}
	}
	
	//For use within the assignPairsToClusters(...) method.
	public double[][] sortArrayOfSums(double[][] arrayOfSums){
		//Sort into descending order (using insertion sort):
		double tempIndex, tempValue;
		int j;
		for(int i = 1; i < arrayOfSums[0].length; i++){
			j = i;
			while(j > 0 && arrayOfSums[1][j - 1] < arrayOfSums[1][j]){
				//Swap arrayOfSums[1][j - 1] and arrayOfSums[1][j].
				tempIndex = arrayOfSums[0][j - 1];
				tempValue = arrayOfSums[1][j - 1];
				arrayOfSums[0][j - 1] = arrayOfSums[0][j];
				arrayOfSums[1][j - 1] = arrayOfSums[1][j];
				arrayOfSums[0][j] = tempIndex;
				arrayOfSums[1][j] = tempValue;
				
				j--;
			}
		}
		
		return arrayOfSums;
	}
	
	public void randomAssignment(Chart chart, ArrayList<Employee> employees){
		//First we need a random list of numbers the same length as the employees ArrayList.
		int numberOfEmployees = employees.size();
		ArrayList<Integer> indices = new ArrayList<Integer>();
		for(int i = 0; i < numberOfEmployees; i++){
			indices.add(i);
		}
		
		
		Random rand = new Random();
		
		int numberOfShuffles = 0;
		while(numberOfShuffles == 0){
			numberOfShuffles = rand.nextInt(15);
		}
		
		//Collections.shuffle(indices, rand);
		
		/*for(int i = 0; i < numberOfEmployees; i++){
			System.out.print("" + indices.get(i) + " ");
		}
		System.out.println();
		*/
		
		/*for(int i = 0; i < numberOfEmployees; i++){
			System.out.print("" + indices.get(i) + " ");
		}
		System.out.println();*/
		

		for(int i = 0; i < numberOfShuffles; i++){
			Random rand1 = new Random();
			Collections.shuffle(indices, rand1); //That randomizes the list. I am very proud of this
		}
		
		/*for(int i = 0; i < numberOfEmployees; i++){
			System.out.print("" + indices.get(i) + " ");
		}
		System.out.println();*/
		
		//Now go through the list, and add employees to the Chart.
		int counter = 0;
		boolean waitingForPair;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			waitingForPair = true;
			if(chart.getCluster(i).onlyOneDesk()){
				chart.getCluster(i).assignToDesk(employees.get(indices.get(counter)));
				employees.get(indices.get(counter)).setPartOfPair(true);
				counter++;
			}
			else{
				while(chart.getCluster(i).getNumberOfOpenDesks() > 0){
					if(waitingForPair){
						chart.getCluster(i).assignPairOfEmployees(employees.get(indices.get(counter)), employees.get(indices.get(counter + 1)));
						counter++;
						counter++;
						waitingForPair = false;
					}
					else{
						chart.getCluster(i).assignToDesk(employees.get(indices.get(counter)));
						counter++;
					}
				}
			}
		}
	}
	
	public void computePairs(Chart chart, double[][] similarities, ArrayList<Employee> employees){
		//Find the most similar pairs, and assign one to each cluster in the chart. 
		double currentHighest;
		int x = 0; 
		int y = 0;
		
		int numberOfEmployees = employees.size();
		for(int c = 0; c < chart.getNumberOfClusters(); c++){ //For each cluster
			currentHighest = 0;
			for(int i = 0; i < numberOfEmployees; i++){ //Go through every spot in the array.
				for(int j = 0; j < numberOfEmployees; j++){
					//If we've found a new highest pair and neither is already in a pair. 
					if(similarities[i][j] > currentHighest && !employees.get(i).partOfPair() && !employees.get(j).partOfPair()){ 
						currentHighest = similarities[i][j];
						x = i;
						y = j;
					}
				}
			}	
			//Time to assign the pair we've just found to the current cluster:
			chart.getCluster(c).setPairedEmployee1(employees.get(x));
			chart.getCluster(c).setPairedEmployee2(employees.get(y));
			employees.get(x).setPartOfPair(true);
			employees.get(y).setPartOfPair(true);
		}	
	}
	
	public double[][] computeSharedSimilarities(Chart chart, ArrayList<Employee> employees){
		double[][] similarities = chart.getEmployeeSimilaritiesArray();
		double[][] sharedSimilarities = chart.getEmployeeSimilaritiesArray();
		
		int pair1, pair2;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			//System.out.println("i: " + i);
			pair1 = chart.getCluster(i).getPairedEmployee1().getSpotInArray();
			pair2 = chart.getCluster(i).getPairedEmployee2().getSpotInArray();
			
			for(int j = 0; j < employees.size(); j++){
				if(!employees.get(j).partOfPair()){ //If the current employee isn't part of a pair:
					if(similarities[pair1][j] < 0 || similarities[pair2][j] < 0){
						sharedSimilarities[pair1][j] = -1.0;
					}
					else{
						sharedSimilarities[pair1][j] = (similarities[pair1][j] + similarities[pair2][j]) / 2;
					}
				}
			}
		}
		return sharedSimilarities;
	}
	
	public void assignAllEmployees(Chart chart, double[][] sharedSimilarities, ArrayList<Employee> employees){
		// Okay, at this point, every cluster has been assigned a pair of employees. 
		// - We want to iterate through all of the unchosen employees and assign them to clusters.
		//		- But in what order?!
		//			- Three ideas: random, least popular (overall) to most popular, most popular to least popular
		//			- My gut feeling is that most popular to least popular might work best? I don't know. I know nothing.
		//			- We need a better scoring system.
		
		// Let's just try something.
		// Let's do most popular to least popular.
		// - First we have to sort. We have a sorting function, but it needs them in an array of this form:
		//		[id 0][totalSimilarity 0]
		//		[id 1][totalSimilarity 1]
		//		[....][.................]
		// - Then we have to iterate through that array, and assign each employee (if they haven't yet been
		//	  assigned, of course) to the pair to which they are most similar.

		
		// Getting an array in the correct form.
		int numberOfEmployees = employees.size();
		//System.out.println("Number of employees: " + numberOfEmployees);
		double employeeTotalSimilarities[][] = new double[2][numberOfEmployees];
		for(int i = 0; i < numberOfEmployees; i++){
			employeeTotalSimilarities[0][i] = employees.get(i).getSpotInArray(); 
			employeeTotalSimilarities[1][i] = employees.get(i).getTotalSimilarity(); 
		}
		
		// Sort that array:
		//System.out.println("Unsorted employee total similarities array:");
		//printSumArray(employeeTotalSimilarities);
		employeeTotalSimilarities = sortArrayOfSums(employeeTotalSimilarities);
		//System.out.println("Sorted employee total similarities array:");
		//printSumArray(employeeTotalSimilarities);
		
		//Assign employees to clusters.
		int currentEmployeeId; //Not strictly necessary, but should make the code a little more readable.
		double currentHighestSimilarity, currentSimilarity; 
		int indexOfCurrentHighestCluster;
		for(int i = 0; i < numberOfEmployees; i++){
			currentEmployeeId = (int) employeeTotalSimilarities[0][i];
			//System.out.println("Current employee id: " + currentEmployeeId);
			if(employees.get(currentEmployeeId).waitingToBeAssigned()){ //Meaning it has not already been assigned a desk.
				//Assign our employee to the pair to which it is the most similar.
				currentHighestSimilarity = -1;
				indexOfCurrentHighestCluster = -1;
				for(int j = 0; j < chart.getNumberOfClusters(); j++){
					if(chart.getCluster(j).getNumberOfOpenDesks() > 0){
						//Determine our employee's similarity to the pair at the current cluster. If it's higher than the 
						//	currentHighestSimilarity, mark it as the new highest (including noting the index of the cluster).
						currentSimilarity = sharedSimilarities[chart.getCluster(j).getPairedEmployee1().getSpotInArray()][currentEmployeeId];
						if(currentSimilarity > currentHighestSimilarity){
							//Make this the new highest cluster.
							indexOfCurrentHighestCluster = j;
							currentHighestSimilarity = currentSimilarity;
						}	
					}
				}
				if(currentHighestSimilarity < 0){
					return; //We're out of options.
				}
				//Assign the employee to the cluster. 
				chart.getCluster(indexOfCurrentHighestCluster).assignToDesk(employees.get(currentEmployeeId));
			}
		}
		
		
	}
	
	public void assignToClusters(Chart chart, double[][] sharedSimilarities, ArrayList<Employee> employees){
		int numberOfUnassignedEmployees = employees.size() - (chart.getNumberOfClusters() * 2);
		
		int numberOfAvailableClusters = 0;
		for(int c = 0; c < chart.getNumberOfClusters(); c++){
			if(chart.getCluster(c).getNumberOfOpenDesks() > 0){
				numberOfAvailableClusters++;
			}
		}
		
		int pair1, candidate;
		double currentMax;
		while(numberOfUnassignedEmployees > 0 && numberOfAvailableClusters > 0){
			for(int i = (chart.getNumberOfClusters() - 1); i >= 0; i--){ //Iterate through the clusters backwards.
				pair1 = chart.getCluster(i).getPairedEmployee1().getSpotInArray();
				currentMax = -1000; //Default, really bad similarity.
				candidate = -1; //Default, empty candidate.
				if(chart.getCluster(i).getNumberOfOpenDesks() > 0){
					for(int j = 0; j < employees.size(); j++){
						if(employees.get(j).waitingToBeAssigned()){ //If the current employee hasn't been assigned to a desk.
							if(currentMax < sharedSimilarities[pair1][j]){
								currentMax = sharedSimilarities[pair1][j];
								candidate = j;
							}
						}
					} //For j (Employees)
					if(candidate == -1){
						i = -1;
						numberOfUnassignedEmployees = -1;
					}
					else{
						//Assign employee at candidate spot to this cluster.
						chart.getCluster(i).assignToDesk(employees.get(candidate));
						numberOfUnassignedEmployees--;
						if(chart.getCluster(i).getNumberOfOpenDesks() == 0){
							numberOfAvailableClusters--;
						}
					}
				}
			} //For i (clusters)
		} //While

	}

}
