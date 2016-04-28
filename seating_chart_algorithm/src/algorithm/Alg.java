package algorithm;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;

public class Alg{

	private IOParser inputParser;
	
	public void Algorithm(File seatingChartFile, File employeeFile, File similarityFile, File outputFile) throws FileNotFoundException{
		File employeeInputFile;
		employeeInputFile = employeeFile;
		
		File chartInputFile;
		chartInputFile = seatingChartFile;
		
		inputParser = new IOParser(employeeInputFile, chartInputFile, similarityFile);
		
		ArrayList<Employee> listOfEmployees = inputParser.getEmployeeArrayList();
		int floorplan[][] = inputParser.getChartIntegerArray();
		
		Chart seatingChart = new Chart();
		
		//Handle SpecialLocations:
		seatingChart.findSpecialLocations(floorplan);
		
		//Handle Employees:
		seatingChart.setNumberOfEmployees(listOfEmployees.size());
		seatingChart.setEmployeeSimilaritiesArray(inputParser.getEmployeeSimilaritiesArray(), listOfEmployees);
		
		//Handle Walls:
		seatingChart.findWalls(floorplan);
	
		//Handle Clusters:
		seatingChart.findClusters(floorplan);
		seatingChart.findClusterSimilarities();
		seatingChart.setSpecialLocationScores();
	
		oneDeskClusterAssignments(seatingChart,listOfEmployees);
		Employee[][] pairs = findPairs(seatingChart, listOfEmployees);
		double[][] pairToPairSimilarities = computePairToPairSimilarities(seatingChart.getEmployeeSimilaritiesArray(), pairs);		
		assignPairsToClusters(seatingChart,pairs,pairToPairSimilarities);
		double[][] sharedSimilarities = computeSharedSimilarities(seatingChart, listOfEmployees);
		assignAllEmployees(seatingChart, sharedSimilarities, listOfEmployees);

		
		inputParser.createOutputFile(seatingChart, outputFile);
	}
		
	//Returns an array with all of the pairs of employees. 
	private Employee[][] findPairs(Chart chart, ArrayList<Employee> employees){
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

		int desiredNumberOfPairs;
		if((employees.size() - numberOfOneDeskClusters)<((chart.getNumberOfClusters() - numberOfOneDeskClusters) * 2)){
			desiredNumberOfPairs = (employees.size() - numberOfOneDeskClusters)/2;
		}
		else{
			desiredNumberOfPairs = chart.getNumberOfClusters() - numberOfOneDeskClusters;
		}
		Employee pairedEmployees[][] = new Employee[desiredNumberOfPairs][2];
		
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
				if(c < desiredNumberOfPairs){
					pairedEmployees[c][0] = employees.get(x);
					employees.get(x).setPartOfPair(true);
					pairedEmployees[c][1] = employees.get(y);
					employees.get(y).setPartOfPair(true);
					c++;
				}
			}
		}
		
		return pairedEmployees;
	}
	
	//Returns an array containing each pair's similarity to all of the other pairs.
	private double[][] computePairToPairSimilarities(double[][] similarities, Employee[][] pairs){
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
	
	private void assignPairsToClusters(Chart chart, Employee[][] pairs, double[][] pairToPairSimilarities){
		int numberOfClusters = chart.getNumberOfClusters();
		int numberOfPairs = pairs.length;
		
		//First assign pairs that have bathroom usage > 7 to a cluster close to a bathroom
		boolean flag = true;
		double maxBathroom, maxClusterBathroom;
		int maxPair, maxCluster;
		int numberOfBathroomPairs = 0;
		while(flag){
			maxBathroom = 0;
			maxPair = 0;
			
			for(int i = 0; i < numberOfPairs; i++){
				if(pairs[i][0].waitingToBeAssigned()){
					if((pairs[i][0].getRestroomUsage() + pairs[i][1].getRestroomUsage()) > maxBathroom){
						maxBathroom = pairs[i][0].getRestroomUsage() + pairs[i][1].getRestroomUsage();
						maxPair = i;
					}
				}
			}
			
			if(maxBathroom > 6){
				maxClusterBathroom = 0;
				maxCluster = 0;
				for(int i = 0; i < numberOfClusters; i++){
					if(!chart.getCluster(i).hasBeenAssignedAPair()){
						if(chart.getCluster(i).getRestroomScore() > maxClusterBathroom){
							maxClusterBathroom = chart.getCluster(i).getRestroomScore();
							maxCluster = i;
						}						
					}
				}
				if(maxClusterBathroom > 0){
					chart.getCluster(maxCluster).assignPairOfEmployees(pairs[maxPair][0], pairs[maxPair][1]);
					numberOfBathroomPairs++;
				}
				else{
					flag = false;
				}
			}
			else{
				flag = false;
			}
		}
		
		numberOfClusters = numberOfClusters - numberOfBathroomPairs;
		
		Cluster currentMostSimilarPairOfClusters[];
		int currentMostSimilarPairOfPairs[]; //Indexes of employees
		int firstPairIndex, secondPairIndex;
		
		for(int i = 0; i < numberOfClusters; i++){
			
			if(i >= (numberOfPairs - numberOfBathroomPairs)){
				return;
			}
			currentMostSimilarPairOfClusters = getMostSimilarPairOfClusters(chart);

			//Assign a pair of pairs to the pair of clusters.
			//3 scenarios:
			//	A) neither cluster has been assigned a pair
			//  B) cluster 0 has been assigned a pair but not cluster 1
			//  C) cluster 1 has been assigned a pair but not cluster 0
			
			if(!(currentMostSimilarPairOfClusters[0].hasBeenAssignedAPair() || currentMostSimilarPairOfClusters[1].hasBeenAssignedAPair()) && !(currentMostSimilarPairOfClusters[0].onlyOneDesk()) && !(currentMostSimilarPairOfClusters[1].onlyOneDesk())){ //Scenario A
				//Assign the most similar pair of pairs (where neither pair has been assigned to a cluster) to this pair of clusters
				if(!((i+2) > (numberOfPairs - numberOfBathroomPairs))){
					currentMostSimilarPairOfPairs = getMostSimilarPairOfPairs(pairToPairSimilarities, pairs);
					firstPairIndex = currentMostSimilarPairOfPairs[0];
					secondPairIndex = currentMostSimilarPairOfPairs[1];
					currentMostSimilarPairOfClusters[0].assignPairOfEmployees(pairs[firstPairIndex][0],pairs[firstPairIndex][1]);
					currentMostSimilarPairOfClusters[1].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
					i++; //An extra increment, since two clusters were assigned this time instead of 1. 	
				}
				else{
					currentMostSimilarPairOfPairs = getMostSimilarPairOfPairs(pairToPairSimilarities, pairs);
					firstPairIndex = currentMostSimilarPairOfPairs[0];
					
					currentMostSimilarPairOfClusters[0].assignPairOfEmployees(pairs[firstPairIndex][0],pairs[firstPairIndex][1]);
					return;
				}
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
				
				currentMostSimilarPairOfClusters[1].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
			}
			else if(currentMostSimilarPairOfClusters[1].hasBeenAssignedAPair()){ //Scenario C+
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
				
				currentMostSimilarPairOfClusters[0].assignPairOfEmployees(pairs[secondPairIndex][0],pairs[secondPairIndex][1]);
			}
			else{
				//One cluster has one employee. The other cluster needs a pair.
				Employee soleEmployee = null;
				int identifier;
				if(currentMostSimilarPairOfClusters[0].onlyOneDesk()){
					soleEmployee = currentMostSimilarPairOfClusters[0].getEmployeeByIndex(0);
					identifier = 1;
				}
				else{
					soleEmployee = currentMostSimilarPairOfClusters[1].getEmployeeByIndex(0);
					identifier = 0;
				}
				
				//Find the pair that's most similar to this employee and assign it to the array.
				double currMax = -10000;
				int chosenPair = 0;
				for(int k = 0; k < pairs.length; k++){
					double currSim1 = chart.getSpecificEmployeeSimilarity(pairs[k][0].getSpotInArray(), soleEmployee.getSpotInArray());
					double currSim2 = chart.getSpecificEmployeeSimilarity(pairs[k][1].getSpotInArray(), soleEmployee.getSpotInArray());
					if((currSim1 + currSim2) > currMax && pairs[k][0].waitingToBeAssigned()){
						chosenPair = k;
						currMax = currSim1 + currSim2;
					}
				}
				currentMostSimilarPairOfClusters[identifier].assignPairOfEmployees(pairs[chosenPair][0], pairs[chosenPair][1]);
			}
		}
		
	}
	
	private int[] getMostSimilarPairOfPairs(double[][] pairToPairSimilarities, Employee[][] pairs){
		int pair[] = new int[2];
		double maxSimilarity = 0;
		int numberOfPairs = pairToPairSimilarities.length;
		boolean firstPairAvailable, secondPairAvailable;
		boolean foundAPair = false;
		for(int i = 0; i < numberOfPairs; i++){
			firstPairAvailable = pairs[i][0].waitingToBeAssigned();
			
			if(firstPairAvailable){
				for(int j = 0; j < numberOfPairs; j++){
					secondPairAvailable = pairs[j][0].waitingToBeAssigned();
					if(pairToPairSimilarities[i][j] > maxSimilarity && secondPairAvailable){
						maxSimilarity = pairToPairSimilarities[i][j];
						foundAPair = true;
						pair[0] = i;
						pair[1] = j;
					}
				}				
			}
		}
		
		if(!foundAPair){
			for(int i = 0; i < numberOfPairs; i++){
				if(pairs[i][0].waitingToBeAssigned()){
					pair[0] = i;
					pair[1] = i;
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
				if(currentSimilarity > maxSimilarity && ((!chart.getCluster(i).hasBeenAssignedAPair() && !chart.getCluster(i).onlyOneDesk())||(!chart.getCluster(j).hasBeenAssignedAPair() && !chart.getCluster(j).onlyOneDesk()))){
					maxSimilarity = currentSimilarity;
					currMaxI = i;
					currMaxJ = j;
				}
			}
		}

		pair[0] = chart.getCluster(currMaxI);
		pair[1] = chart.getCluster(currMaxJ);
		return pair;
	}
	
	//For use within the assignPairsToClusters(...) method.
	private double[][] sortArrayOfSums(double[][] arrayOfSums){
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
	
	private double[][] computeSharedSimilarities(Chart chart, ArrayList<Employee> employees){
		double[][] similarities = chart.getEmployeeSimilaritiesArray();
		double[][] sharedSimilarities = chart.getEmployeeSimilaritiesArray();
		
		int pair1, pair2;
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			
			if(chart.getCluster(i).hasBeenAssignedAPair()){
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
		}
		return sharedSimilarities;
	}
	
	private void assignAllEmployees(Chart chart, double[][] sharedSimilarities, ArrayList<Employee> employees){
		// Okay, at this point, every cluster has been assigned a pair of employees. 
		// - We want to iterate through all of the unchosen employees and assign them to clusters.
		//		- But in what order?!
		//			- Three ideas: random, least popular (overall) to most popular, most popular to least popular
		//			- My gut feeling is that most popular to least popular might work best.
		
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
		double employeeTotalSimilarities[][] = new double[2][numberOfEmployees];
		for(int i = 0; i < numberOfEmployees; i++){
			employeeTotalSimilarities[0][i] = employees.get(i).getSpotInArray(); 
			employeeTotalSimilarities[1][i] = employees.get(i).getTotalSimilarity(); 
		}
		
		// Sort that array:
		employeeTotalSimilarities = sortArrayOfSums(employeeTotalSimilarities);
		
		//Assign employees to clusters.
		int currentEmployeeId; //Not strictly necessary, but should make the code a little more readable.
		double currentHighestSimilarity, currentSimilarity; 
		int indexOfCurrentHighestCluster;
		for(int i = 0; i < numberOfEmployees; i++){
			currentEmployeeId = (int) employeeTotalSimilarities[0][i];
	
			if(employees.get(currentEmployeeId).waitingToBeAssigned()){ //Meaning it has not already been assigned a desk.
				//Assign our employee to the pair to which it is the most similar.
				currentHighestSimilarity = -1;
				indexOfCurrentHighestCluster = -1;
				for(int j = 0; j < chart.getNumberOfClusters(); j++){
					if(chart.getCluster(j).getNumberOfOpenDesks() > 0 && chart.getCluster(j).hasBeenAssignedAPair()){
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
}
