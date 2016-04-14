package algorithm;
import java.util.ArrayList;

class Similarity {	
	private double[][] clusterSimilarities, employeeSimilarities, postAssignmentClusterSimilarities; 
	
	Similarity(){ }
	
	double[][] getClusterSimilarities(){
		return clusterSimilarities;
	}
	
	double[][] getEmployeeSimilarities(){
		return employeeSimilarities;
	}
	
	double[][] getPostAssignmentClusterSimilarities(){
		return postAssignmentClusterSimilarities;
	}
	
	void computePostAssignmentClusterSimilarities(Chart chart){
		int numberOfClusters = chart.getNumberOfClusters();
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
					postAssignmentClusterSimilarities[i][j] = 0.0;
				}
				else if(postAssignmentClusterSimilarities[j][i] != 0.0){ //Check if the similarity for this pair has already been computed. Should save a little time. 
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
					postAssignmentClusterSimilarities[i][j] = average / chart.getCluster(i).getNumberOfEmployees();
				}
			}
		}
	}
	
	void setEmployeeSimilarities(double[][] sims){
		employeeSimilarities = sims;
	}
	
	void computeClusterSimilarities(ArrayList<Cluster> clusterList, Chart chart){
		int numberOfClusters = clusterList.size();
		clusterSimilarities = new double[numberOfClusters][numberOfClusters];
		
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				if(i == j){
					clusterSimilarities[i][j] = 0;
				}
				else{
					clusterSimilarities[i][j] = computeSimilarity(clusterList.get(i), clusterList.get(j), chart);
				}
			}
		}
	}
	
	double computeSimilarity(Cluster first, Cluster second, Chart chart){
		double similarity;
		if(first.wallBetween(second, chart.getWallsArrayList())){
			//There's a wall between these two clusters. 
			similarity = ignoreWallSimilarity(first, second, chart);
			if(similarity == 0){
				similarity = (1 / (first.getMiddle().squaredDistanceToPoint(second.getMiddle()) * 2)) * 100;
			}
			else{
				similarity = (1 / similarity) * 100;
			}
		}
		else{
			similarity = (1 / first.getMiddle().squaredDistanceToPoint(second.getMiddle())) * 100;
		}
		
		return similarity;
	}
	
	double ignoreWallSimilarity(Cluster first, Cluster second, Chart chart){
		double comboDistanceOne = 0;
		double comboDistanceTwo = 0;
		
		Wall wall = null;
		ArrayList<Wall> walls = chart.getWallsArrayList();
		for(int i = 0; i < walls.size(); i++){
			if(walls.get(i).betweenClusters(first, second)){
				wall = walls.get(i);
			}
		}
		
		Point point1, point2;
		point1 = new Point(wall.getFirstPoint().getX(), wall.getFirstPoint().getY());
		point2 = new Point(wall.getSecondPoint().getX(), wall.getSecondPoint().getY());
		if(wall.horizontal()){ //Wall is horizontal
			point1.setX(point1.getX() - 1);
			point2.setX(point2.getX() + 1);
		}
		else{ //Wall is vertical
			point1.setY(point1.getY() - 1);
			point2.setY(point2.getY() + 1);
		}
		if(!first.wallBetween(point1, walls) && !second.wallBetween(point1, walls)){
			comboDistanceOne = first.getMiddle().squaredDistanceToPoint(point1);
			comboDistanceOne += second.getMiddle().squaredDistanceToPoint(point1);
		}
		if(!first.wallBetween(point2, walls) && !second.wallBetween(point2, walls)){
			comboDistanceTwo = first.getMiddle().squaredDistanceToPoint(point2);
			comboDistanceTwo += second.getMiddle().squaredDistanceToPoint(point2);
		}
				
		if(comboDistanceOne < comboDistanceTwo){
			return comboDistanceOne;
		}
		else{
			return comboDistanceTwo;
		}
	}
	
	double getSpecificClusterSimilarity(int i, int j){
		return clusterSimilarities[i][j];
	}
	
	double getSpecificEmployeeSimilarity(int i, int j){
		return employeeSimilarities[i][j];
	}
	
	double getSpecifiedPostAssignmentClusterSimilarity(int i, int j){
		return postAssignmentClusterSimilarities[i][j];
	}
}
