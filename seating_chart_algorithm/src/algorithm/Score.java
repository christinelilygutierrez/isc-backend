package algorithm;
import java.util.Arrays;

class Score {
	private Chart chart;
	private int clusterScore, employeeScore, numClusters, numEmployees;
	
	Score(Chart c){
		chart = c;
		clusterScore = 0;
		employeeScore = 0;
		numClusters = 0;
		numEmployees = 0;
	}
	
	private void updateClusterScore(int newScore){
		clusterScore += newScore;
		numClusters++;
	}
	
	private void updateEmployeeScore(int newScore){
		employeeScore += newScore;
		numEmployees++;
	}
	
	double getClusterAverage(){
		if(numClusters > 0){
			return clusterScore / numClusters;
		}
		else
			return 0;
	}
	
	double getEmployeeAverage(){
		if(numEmployees > 0){
			return employeeScore/numEmployees;
		}
		else
			return 0;
	}
	
	int computeScoreOutOf100(){
		chart.findPostAssignmentClusterSimilarities();
		
		//Compute individual cluster score for each cluster in the chart.
		int clustersInChart = chart.getNumberOfClusters();
		int totalClusterScore = 0;
		for(int i = 0; i < clustersInChart; i++){
			totalClusterScore += computeClusterScoreOutOf100(chart.getCluster(i), i);
		}
		return totalClusterScore / clustersInChart;
	}
	
	private int computeClusterScoreOutOf100(Cluster cluster, int clusterIndex){
		//Get an array of all of the employees in the cluster.
		Employee employeesInCluster[] = new Employee[cluster.getNumberOfEmployees()];
		int totalNumberOfEmployees = 0;
		for(int i = 0; i < cluster.getNumberOfDesks(); i++){
			if(!cluster.getDesk(i).checkIfOpen()){
				employeesInCluster[totalNumberOfEmployees] = cluster.getDesk(i).getEmployee();
				totalNumberOfEmployees++;
			}
		}
		
		//Have to find the similarity scores of all of the employees in the cluster to one another.
		double withinClusterScores[] = new double[totalNumberOfEmployees];
		for(int i = 0; i < totalNumberOfEmployees; i++){
			withinClusterScores[i] = 0;
			for(int j = 0; j < totalNumberOfEmployees; j++){
				if(i != j){
					withinClusterScores[i] += chart.getSpecificEmployeeSimilarity(employeesInCluster[i].getSpotInArray(), employeesInCluster[j].getSpotInArray());
				}
			}
			withinClusterScores[i] = withinClusterScores[i] / (totalNumberOfEmployees - 1);
		}

		//Now add up all the individual employee scores. 
		int totalEmployeeScore = 0;
		int currentEmployeeScore;
		double currentSimilaritiesArray[][];
		for(int i = 0; i < totalNumberOfEmployees; i++){
			currentSimilaritiesArray = chart.getEmployeeSimilaritiesArray();
			currentEmployeeScore = computeEmployeeScoreOutOf100(employeesInCluster[i], withinClusterScores[i], currentSimilaritiesArray[i]);
			updateEmployeeScore(currentEmployeeScore);
			totalEmployeeScore += currentEmployeeScore;
		}
		double employeeClusterScore = totalEmployeeScore / totalNumberOfEmployees;
		double locationClusterScore = computeClusterLocationScoreOutOf100(cluster, clusterIndex);
		updateClusterScore((int)locationClusterScore);
		return (int)((employeeClusterScore * .7) + (locationClusterScore * .3));
	}
	
	//Kind of based on the assumption that scores are randomly distributed:
	private int computeEmployeeScoreOutOf100(Employee employee, double clusterSimilarity, double[] overallSimilarities){
		//Time to rework all of this:
		double lower25, median, upper25;
		
		//Sort overall similarities:
		double similarities[] = overallSimilarities;
		similarities = sortArray(similarities);
		
		//Find median:
		median = findMedian(similarities);
		
		//Find lower25 value:
		lower25 = findLower25(similarities);
		
		//Find upper25 value:
		upper25 = findUpper25(similarities);
		
		if(clusterSimilarity < lower25){
			return 0;
		}
		if(clusterSimilarity < median){
			return 34;
		}
		if(clusterSimilarity < upper25){
			return 66;
		}
		return 100; // Because it's between upper25 and being perfect. 
	}
	
	private int computeClusterLocationScoreOutOf100(Cluster cluster, int clusterIndex){
		//We're including the original cluster in the close cluster average. 
		int numberOfCloseClusters = chart.getNumberOfClusters() / 4;
		if(numberOfCloseClusters == 1 && chart.getNumberOfClusters() > 2){
			numberOfCloseClusters = 2;
		}
		
		double closeClusterAverage = 0;
		
		double lower25, median, upper25;
		
		double[] preAssignmentSimilarities = (chart.getClusterSimilaritiesArray())[clusterIndex];
		
		//Sort pre assignment similarities:
		double preSimilarities[][] = new double[2][chart.getNumberOfClusters()];
		
		for(int i = 0; i < chart.getNumberOfClusters(); i++){
			preSimilarities[0][i] = i;
			preSimilarities[1][i] = preAssignmentSimilarities[i];
		}
		
		preSimilarities = sortArray(preSimilarities);
		
		double[] postAssignmentSimilarities = (chart.getPostAssignmentClusterSimilarities())[clusterIndex];
		
		for(int i = 0; i < numberOfCloseClusters; i++){
			closeClusterAverage += postAssignmentSimilarities[(int)preSimilarities[0][i]];
		}
		
		closeClusterAverage = closeClusterAverage / numberOfCloseClusters;
		
		postAssignmentSimilarities = sortArray(postAssignmentSimilarities);
		//Find median:
		median = findMedian(postAssignmentSimilarities);
		
		//Find lower25 value:
		lower25 = findLower25(postAssignmentSimilarities);
		
		//Find upper25 value:
		upper25 = findUpper25(postAssignmentSimilarities);
		
		if(closeClusterAverage < lower25){
			return 0;
		}
		if(closeClusterAverage < median){
			return 34;
		}
		if(closeClusterAverage < upper25){
			return 66;
		}
		
		return 100; // Because it's between upper25 and being perfect. 
	}
	
	private double findMedian(double[] array){
		int numberOfOverallSimilarities = array.length;
		
		if((numberOfOverallSimilarities % 2) == 0){
			return (array[numberOfOverallSimilarities/2] + array[(numberOfOverallSimilarities/2) - 1]) / 2;
		}
		else{
			return array[numberOfOverallSimilarities/2];
		}
	}
	
	private double findLower25(double[] array){
		int numberOfOverallSimilarities = array.length;

		if((numberOfOverallSimilarities / 2) == 0){
			return findMedian(Arrays.copyOfRange(array, 0, numberOfOverallSimilarities / 2));
		}
		else{
			return findMedian(Arrays.copyOfRange(array, 0, (numberOfOverallSimilarities / 2) + 1));
		}
	}
	
	private double findUpper25(double[] array){
		int numberOfOverallSimilarities = array.length;

		if((numberOfOverallSimilarities / 2) == 0){
			return findMedian(Arrays.copyOfRange(array, numberOfOverallSimilarities / 2, numberOfOverallSimilarities));
		}
		else{
			return findMedian(Arrays.copyOfRange(array, numberOfOverallSimilarities / 2, numberOfOverallSimilarities));
		}
	}
	
	private double[] sortArray(double[] array){
		//Sort into ascending order (using insertion sort):
		double tempValue;
		int j;
		for(int i = 1; i < array.length; i++){
			j = i;
			while(j > 0 && array[j - 1] > array[j]){
				//Swap arrayOfSums[1][j - 1] and arrayOfSums[1][j].
				tempValue = array[j - 1];
				array[j - 1] = array[j];
				array[j] = tempValue;				
				j--;
			}
		}
		
		return array;
	}
	
	private double[][] sortArray(double[][] arrayOfSums){
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
}
