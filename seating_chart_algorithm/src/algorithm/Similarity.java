package algorithm;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;

public class Similarity {	
	private double[][] clusterSimilarities, employeeSimilarities, postAssignmentClusterSimilarities; 
	
	public Similarity(){ }
	
	public double[][] getClusterSimilarities(){
		return clusterSimilarities;
	}
	
	public double[][] getEmployeeSimilarities(){
		return employeeSimilarities;
	}
	
	public double[][] getPostAssignmentClusterSimilarities(){
		return postAssignmentClusterSimilarities;
	}
	
	public void computePostAssignmentClusterSimilarities(Chart chart){
		int numberOfClusters = clusterSimilarities.length;
		postAssignmentClusterSimilarities = new double[numberOfClusters][numberOfClusters];
		//Initialize all values in that array to 0.
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				postAssignmentClusterSimilarities[i][j] = 0.0;
			}
		}
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				if(i == j){ //We're comparing a cluster to itself.
					postAssignmentClusterSimilarities[i][j] = -1.0;
				}
				else if(postAssignmentClusterSimilarities[j][i] != 0){ //Check if the similarity for this pair has already been computed. Should save a little time. 
					postAssignmentClusterSimilarities[i][j] = postAssignmentClusterSimilarities[j][i];
				}
				else{
					//Compute the similarity between clusters i & j.
					//How do we do this?
					// - By averaging similarities? 
					// - Like, for each employee in cluster i, we compute their similarity to each person in cluster j, and keep a running average.
					double average = 0;
					for(int k = 0; k < chart.getCluster(i).getNumberOfEmployees(); k++){
						double currentEmployeeAverage = 0;
						Employee currentEmployee = chart.getCluster(i).getEmployeeByIndex(k);
						for(int m = 0; m < chart.getCluster(j).getNumberOfEmployees(); m++){
							//Get similarity of current employee in cluster i to current employee in cluster j
							currentEmployeeAverage += getSpecificEmployeeSimilarity(currentEmployee.getSpotInArray(), chart.getCluster(j).getEmployeeByIndex(m).getSpotInArray());
						}
						currentEmployeeAverage = currentEmployeeAverage / chart.getCluster(j).getNumberOfEmployees();
						average += currentEmployeeAverage;
					}
					postAssignmentClusterSimilarities[i][j] = average;
				}
			}
		}
	}
	
	public void setEmployeeSimilarities(double[][] sims){
		employeeSimilarities = sims;
	}
	
	//A sneaky way to get employees whose similarities to each other behave the same way real life similarities would:
	public void computeEmployeeSimilarities(ArrayList<Employee> employeeList, ArrayList<SpecialLocation> specialLocations){
		int numberOfEmployees = employeeList.size();
		int employeeMockScores[] = new int[numberOfEmployees];
		employeeSimilarities = new double[employeeList.size()][employeeList.size()];
		
		//For generating random mock scores for the employees.
		ArrayList<Integer> toBeShuffled = new ArrayList<Integer>();
		for(int i = 0; i < numberOfEmployees; i++){
			toBeShuffled.add(i);
		}
		
		Random rand = new Random();
		Collections.shuffle(toBeShuffled,rand);
		
		for(int i = 0; i < numberOfEmployees; i++){
			employeeMockScores[i] = toBeShuffled.get(i);
			employeeList.get(i).setSpotInArray(i);
		}
		
		double currentSimilarity;
		for(int i = 0; i < numberOfEmployees; i++){
			//employeeList.get(i).setSpotInArray(i); //This is where I'm choosing to note where each employee is located in the 
													  // similarities array.
			for(int j = 0; j < numberOfEmployees; j++){
				currentSimilarity = computeSimilarity(employeeList.get(i), employeeList.get(j), employeeMockScores);
				//System.out.println("i: " + i + ", j: " + j);
				employeeSimilarities[i][j] = currentSimilarity;
				if(i != j){
					employeeList.get(i).addToTotalSimilarity(currentSimilarity);
				}
			}
		}	
	}
	
	//Part of the sneakiness
	public double computeSimilarity(Employee first, Employee second, int[] mockScores){
		if(first.getID() == second.getID()){
			return -1;
		}
		
		int higher, lower;
		if(mockScores[first.getSpotInArray()] > mockScores[second.getSpotInArray()]){
			higher = mockScores[first.getSpotInArray()];
			lower =  mockScores[second.getSpotInArray()];
		}
		else{
			lower = mockScores[first.getSpotInArray()];
			higher =  mockScores[second.getSpotInArray()];
		}
		
		if((higher - lower) < (mockScores.length / 8)){
			return 10.0;
		}
		if((higher - lower) < (mockScores.length / 4)){
			return 6.66;
		}
		if((higher - lower) < (mockScores.length / 2)){
			return 3.33;
		}
		return 0.0;
	}
	
	/*
	//Old way
	public void computeEmployeeSimilarities(ArrayList<Employee> employeeList){
		int numberOfEmployees = employeeList.size();
		employeeSimilarities = new double[employeeList.size()][employeeList.size()];
		
		double currentSimilarity;
		for(int i = 0; i < numberOfEmployees; i++){
			employeeList.get(i).setSpotInArray(i); //This is where I'm choosing to note where each employee is located in the 
													  // similarities array.
			for(int j = 0; j < numberOfEmployees; j++){
				currentSimilarity = computeSimilarity(employeeList.get(i), employeeList.get(j));
				employeeSimilarities[i][j] = currentSimilarity;
				if(i != j){
					employeeList.get(i).addToTotalSimilarity(currentSimilarity);
				}
			}
		}
	}*/
	
	public void computeClusterSimilarities(ArrayList<Cluster> clusterList, Chart chart){
		int numberOfClusters = clusterList.size();
		clusterSimilarities = new double[numberOfClusters][numberOfClusters];
		
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				if(i == j){
					clusterSimilarities[i][j] = -1.0;
				}
				else{
					clusterSimilarities[i][j] = computeSimilarity(clusterList.get(i), clusterList.get(j), chart);
				}
			}
		}
	}
	
	public double computeSimilarity(Employee first, Employee second){
		if(first.getID() == second.getID()){ //These employees are the same person.
			return -1;
		}
		
		if(first.isOnBlacklist(second) || second.isOnBlacklist(first)){
			return -1;
		}
		
		/*
		double score = 0;
		
		ArrayList<Characteristic> firstCharacteristics = first.getCharacteristicList();
		ArrayList<Characteristic> secondCharacteristics = second.getCharacteristicList();
		
		if(firstCharacteristics.size() != secondCharacteristics.size()){
			return -1; //Sort of a major error.
		}
		
		int numCharacteristics = firstCharacteristics.size();
		
		for(int i = 0; i < numCharacteristics; i++){
			if(compare(firstCharacteristics.get(i), secondCharacteristics.get(i))){
				score += firstCharacteristics.get(i).getWeight();
			}
		}
		
		return score;
		*/
		
		int firstInt = first.getID();
		int secondInt = second.getID();
		
		/*
		if(firstInt > secondInt){
			return (firstInt - secondInt);
		}
		else{
			return (secondInt - firstInt);
		}
		*/
		
		
		int higher, lower;
		
		if(firstInt > secondInt){
			higher = firstInt;
			lower = secondInt;
		}
		else{
			higher = secondInt;
			lower = firstInt;
		}
		
		double similarity;
		
		/*
		if((higher % 2) == 0){ //If higher is even.
			similarity = higher - lower;
			//similarity = similarity / lower;
			//similarity = similarity + higher;
		}
		else{ //Higher is odd.
			similarity = higher - lower;
			
			//similarity = lower + higher;
			//similarity = similarity + 2;
			//similarity = similarity / lower;
			
		}
		*/
		
		//Just trying stuff:
		if((higher % 2) == 0 && (lower % 2) == 0){ //Both are even
			similarity = 100 / (higher - lower);
		}
		else if((higher % 2) != 0 && (lower % 2) != 0){
			similarity = 100 / (higher - lower);
		}
		else{
			similarity = 1.0; //AKA, these people are like aliens to each other.
		}
		
		
		return similarity;
		
	}
	
	public double computeSimilarity(Cluster first, Cluster second, Chart chart){
		//I don't know how I'm going to do this yet. 
		//Temporary version:
		double distance;
		if(first.wallBetween(second, chart.getWallsArrayList())){
			distance = 0;
		}
		else{
			distance = 1 / first.getMiddle().squaredDistanceToPoint(second.getMiddle());
		}
		return distance;
	}
	
	public double getSpecificClusterSimilarity(int i, int j){
		return clusterSimilarities[i][j];
	}
	
	public double getSpecificEmployeeSimilarity(int i, int j){
		return employeeSimilarities[i][j];
	}
	
	public double getSpecifiedPostAssignmentClusterSimilarity(int i, int j){
		return postAssignmentClusterSimilarities[i][j];
	}
	
	private boolean compare(Characteristic a, Characteristic b){
		String name = a.getName();
		if(name.equals("Noise") || name.equals("Privacy")){
			if(a.getValidity() && b.getValidity()){
				return true;
			}
		}
		if(name.equals("Department")){
			if(a.getDescription().equals(b.getDescription())){
				return true;
			}
		}
		return false;
	}
}
