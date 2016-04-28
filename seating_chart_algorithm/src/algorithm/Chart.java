package algorithm;
import java.util.ArrayList;

class Chart {
	
	private ArrayList<Cluster> clusters;
	private ArrayList<Wall> walls, singlePointWalls;
	private ArrayList<SpecialLocation> specialLocations;
	private int numberOfClusters, numberOfEmployees;
	private int xDim, yDim;
	private boolean[][] wallInBetweenClusters;
	private Similarity similarity;
	
	Chart(){
		numberOfClusters = 0;
		clusters = new ArrayList<Cluster>();
		walls = new ArrayList<Wall>();
		singlePointWalls = new ArrayList<Wall>();
		specialLocations = new ArrayList<SpecialLocation>();
		similarity = new Similarity();
	}
	
	Chart(IOParser iop){
		numberOfClusters = 0;
		clusters = new ArrayList<Cluster>();
		walls = new ArrayList<Wall>();
		singlePointWalls = new ArrayList<Wall>();
		specialLocations = new ArrayList<SpecialLocation>();
		similarity = new Similarity();
		similarity.setEmployeeSimilarities(iop.getEmployeeSimilaritiesArray());
	}
	
	double[][] getEmployeeSimilaritiesArray(){
		return similarity.getEmployeeSimilarities();
	}
	
	void setSpecialLocationScores(){
		int numberOfSpecialLocations = getNumberOfSpecialLocations();
		double currentRestroomScore = 0;
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfSpecialLocations; j++){
				if(specialLocations.get(j).getIntegerType() == 4){ //This special location is a restroom
					currentRestroomScore = clusters.get(i).getRestroomScore();
					clusters.get(i).setRestRoomScore(currentRestroomScore + similarity.getSpecificClusterSimilarity(i, (numberOfClusters + j)));
				}
			}
		}
	}
	
	void setEmployeeSimilaritiesArray(double[][] sims, ArrayList<Employee> employees){
		int numberOfSpecialLocations = getNumberOfSpecialLocations();
		int similaritiesSize = numberOfEmployees + numberOfSpecialLocations;
		double similarities[][] = new double[similaritiesSize][similaritiesSize];
		
		//First add the similarities we've already computed.
		for(int i = 0; i < numberOfEmployees; i++){
			for(int j = 0; j < numberOfEmployees; j++){
				similarities[i][j] = sims[i][j];
			}
		}
		
		//Now add the similarities for the special locations.
		for(int i = 0; i < numberOfSpecialLocations; i++){
			//Compute this special location's similarity to each employee and add it it to the array.
			int spotInSimilarityArray = numberOfEmployees + i;
			specialLocations.get(i).createPseudoEmployee(-1, spotInSimilarityArray);
			String typeOfSpecialLocation = specialLocations.get(i).getType();
			for(int j = 0; j < numberOfEmployees; j++){
				switch(typeOfSpecialLocation){
				case "restroom":
					int restroomFactor = employees.get(j).getRestroomUsage();
					similarities[spotInSimilarityArray][j] = specialLocations.get(i).calculateSimilarity(restroomFactor);
					similarities[j][spotInSimilarityArray] = specialLocations.get(i).calculateSimilarity(restroomFactor);
					break;
				case "conference":
					similarities[spotInSimilarityArray][j] = 0;
					similarities[j][spotInSimilarityArray] = 0;
					break;
				case "airconditioner":
					similarities[spotInSimilarityArray][j] = 0;
					similarities[j][spotInSimilarityArray] = 0;
					break;
				case "kitchen":
					similarities[spotInSimilarityArray][j] = 0;
					similarities[j][spotInSimilarityArray] = 0;
					break;
				}
			}
		}
		//Fill in similarities of all the special locations to each other.
		for(int i = 0; i < numberOfSpecialLocations; i++){
			for(int j = 0; j < numberOfSpecialLocations; j++){
				similarities[i + numberOfEmployees][j + numberOfEmployees] = 0;
			}
		}
		
		similarity.setEmployeeSimilarities(sims);
	}
	
	double[][] getClusterSimilaritiesArray(){
		return similarity.getClusterSimilarities();
	}
	
	double[][] getPostAssignmentClusterSimilarities(){
		return similarity.getPostAssignmentClusterSimilarities();
	}
	
	void findClusterSimilarities(){
		similarity.computeClusterSimilarities(clusters, this);
	}
	
	void findPostAssignmentClusterSimilarities(){
		similarity.computePostAssignmentClusterSimilarities(this);
	}
	
	void setDimensions(int x, int y){
		xDim = x;
		yDim = y;
	}
	
	int getXDim(){
		return xDim;
	}
	
	int getYDim(){
		return yDim;
	}
	
	int getNumberOfEmployees(){
		return numberOfEmployees;
	}
	
	void setNumberOfEmployees(int num){
		numberOfEmployees = num;
	}
	
	Cluster getCluster(int i){
		return clusters.get(i);
	}
	
	SpecialLocation getSpecialLocation(int i){
		return specialLocations.get(i);
	}
	
	void addSpecialLocation(int type, double x, double y){
		specialLocations.add(new SpecialLocation(type, new Point(x,y)));
	}
	
	Wall getWall(int i){
		return walls.get(i);
	}
	
	ArrayList<Wall> getWallsArrayList(){
		return walls;
	}
	
	int getNumberOfClusters(){
		return numberOfClusters;
	}
	
	int getNumberOfWalls(){
		return walls.size();
	}
	
	//Find locations in the chart that are not walls, empty walls, desks, or empty space.
	void findSpecialLocations(int[][] data){
		int xDimension = data.length;
		int yDimension = data[0].length;
		
		// Go through data. At every spot that has a value greater than 3 (meaning that it is a special location),
		// check if any of the surrounding points are already part of the same type of special location. If none are, make a new special
		// location with a new cluster starting with this point. If one or more of the surrounding points are the same type 
		// of special location, add this point to the special location. 
		for(int i = 0; i < xDimension; i++){
			for(int j = 0; j < yDimension; j++){
				if(data[i][j] > 3){ //We have found a point that is part of a special location. 
					if(!searchSurroundingPointsForASpecialLocation(data, data[i][j], i, j)){ //If there is not already a special location of the same type which has a point next to this point
						addSpecialLocation(data[i][j], i, j);
					}
				}
			}
		}
		
		//Merge special locations
		mergeSpecialLocations();
	}
	
	private void mergeSpecialLocations(){
		int numSpecialLocations = specialLocations.size();
		
		for(int i = 0; i < numSpecialLocations; i++){ //For each special location:
			for(int j = i + 1; j < numSpecialLocations; j++){ //For each of the remaining special locations:
				if(specialLocations.get(i).sharesAPointWith(specialLocations.get(j))){ //If the two special locations overlap:
					//Merge the two special locations
					for(int k = 0; k < specialLocations.get(j).getNumberOfPoints(); k++){
						if(!specialLocations.get(i).checkForPoint(specialLocations.get(j).getPoint(k))){ //If this specific point is NOT in both special locations
							//Add it to the first special location
							specialLocations.get(i).addPoint(specialLocations.get(j).getPoint(k));
						}
					}
					//Delete the second cluster.
					specialLocations.remove(j);
					//Reset the loops.
					j = numSpecialLocations;
					i = 0;
					numSpecialLocations--;
				}
			}
		}
		
	}
	
	private boolean searchSurroundingPointsForASpecialLocation(int[][] data, int type, int x, int y){
		int numberOfSpecialLocations = specialLocations.size();
		int numberOfPoints;
		Point currentPoint;
		boolean foundASpecialLocation = false;
		for(int i = 0; i < numberOfSpecialLocations; i++){
			if(specialLocations.get(i).getIntegerType() == type){ //If this is the correct type of special location
				//Go through points and see if any of them are next to (x,y)
				numberOfPoints = specialLocations.get(i).getNumberOfPoints();
				for(int j = 0; j < numberOfPoints; j++){
					currentPoint = specialLocations.get(i).getPoint(j);
					if(nextTo(data, x,y,(int)currentPoint.getX(),(int)currentPoint.getY())){
						specialLocations.get(i).addPoint(new Point(x,y));
						foundASpecialLocation = true;
					}
				}
			}
		}
		return foundASpecialLocation;
	}
	
	private boolean wallInBetween(int[][] data, int x1, int y1, int x2, int y2){
		if(y1 == y2){
			if(x1 > x2){
				if(data[x1 - 1][y1] == 3){
					return true;
				}
			}
			else if(x2 > x1){
				if(data[x2 - 1][y2] == 3){
					return true;
				}
			}
		}
		if(x1 == x2){
			if(y1 > y2){
				if(data[x1][y1 - 1] == 3){
					return true;
				}
			}
			else if(y2 > y1){
				if(data[x2][y2 - 1] == 3){
					return true;
				}
			}
		}
		if((x1 != x2) && (y1 != y2)){
			if(x1 > x2){
				if(y1 > y2){
					if(data[x1 - 1][y1 - 1] == 3){
						return true;
					}
				}
				else{
					if(data[x1 - 1][y2 - 1] == 3){
						return true;
					}
				}
			}
			else{
				if(y2 > y1){
					if(data[x2 - 1][y2 - 1] == 3){
						return true;
					}
				}
				else{
					if(data[x2 - 1][y1 - 1] == 3){
						return true;
					}
				}
			}
		}
		
		return false;
	}
	
	private boolean nextTo(int[][] data, int x1, int y1, int x2, int y2){
		if(wallInBetween(data, x1, y1, x2, y2)){
			return false;
		}
		if(x1 == x2){ 
			if(y1 == (y2 + 2)){
				return true;
			}
			if(y1 == (y2 - 2)){
				return true;
			}
		}
		if(y1 == y2){ 
			if(x1 == (x2 + 2)){
				return true;
			}
			if(x1 == (x2 - 2)){
				return true;
			}
		}
		if(x1 == (x2 - 2)){
			if(y1 == (y2 + 2)){
				return true;
			}
			if(y1 == (y2 - 2)){
				return true;
			}
		}
		if(x1 == (x2 + 2)){
			if(y1 == (y2 + 2)){
				return true;
			}
			if(y1 == (y2 - 2)){
				return true;
			}
		}
		return false;
	}
	
	void findWalls(int[][] data){
		//Rows:
		for(int i = 0; i < data.length; i++){
			if((i % 2) == 0){
				findWallsInRowOrColumn(data, true, true, i);
			}
			else{
				findWallsInRowOrColumn(data, true, false, i);
			}
		}
		
		
		//Columns:
		for(int i = 0; i < data[0].length; i++){
			if((i % 2) == 0){
				findWallsInRowOrColumn(data, false, true, i);
			}
			else{
				findWallsInRowOrColumn(data, false, false, i);
			}
		}
	}

	private boolean searchSurroundingPointsForAWall(int[][] data, int x, int y){
		//Check 4 non-diagonal surrounding points for a wall.
		int xMax = data.length;
		int yMax =  data[0].length;
		if(x != 0){
			if(data[x - 1][y] == 3){
				return true;
			}
		}
		if(y != 0){
			if(data[x][y-1] == 3){
				return true;
			}
		}
		if((x + 1) < xMax){
			if(data[x+1][y] == 3){
				return true;
			}
		}
		if((y + 1) < yMax){
			if(data[x][y+1] == 3){
				return true;
			}
		}
		return false;
	}
	
	private void findWallsInRowOrColumn(int[][] data, boolean row, boolean full, int rowOrColNum){
		Wall currWall = null;
		boolean singlePointWall = false;
		boolean foundAWall = false;
		if(full && row){ //Full row
			for(int i = 0; i < data[rowOrColNum].length; i++){
				if(data[rowOrColNum][i] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							Point p = new Point(rowOrColNum, i);
							currWall = new Wall(p,p);
						}
						else{
							Point p = new Point(i, rowOrColNum);
							currWall = new Wall(p,p);
						}
						singlePointWall = true;
						foundAWall = true;
					}
				}
				else{ //data[i] != 3
					if(foundAWall){
						if(singlePointWall){
							if(!searchSurroundingPointsForAWall(data, (int)currWall.getFirstPoint().getX(), (int)currWall.getFirstPoint().getY())){
								singlePointWalls.add(currWall);
								walls.add(currWall);
							}
						}
						else{
							walls.add(currWall);
						}
					}
					foundAWall = false;
				}
			}
			if(foundAWall = true){
				if(singlePointWall){
					if(!searchSurroundingPointsForAWall(data, (int)currWall.getFirstPoint().getX(), (int)currWall.getFirstPoint().getY())){
						singlePointWalls.add(currWall);
						walls.add(currWall);
					}
				}
				else{
					walls.add(currWall);
				}
			}
		}
		else if(row){ //full == false
			for(int i = 0; i < data[rowOrColNum].length; i += 2){
				if(data[rowOrColNum][i] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							Point p = new Point(rowOrColNum, i);
							currWall = new Wall(p,p);
						}
						else{
							Point p = new Point(i, rowOrColNum);
							currWall = new Wall(p,p);
						}
						singlePointWall = true;
						foundAWall = true;
					}
				}
				else{ //data[i] != 3
					if(foundAWall){
						if(singlePointWall){
							if(!searchSurroundingPointsForAWall(data, (int)currWall.getFirstPoint().getX(), (int)currWall.getFirstPoint().getY())){
								singlePointWalls.add(currWall);
								walls.add(currWall);
							}
						}
						else{
							walls.add(currWall);
						}
					}
					foundAWall = false;
				}
			}		
		}
		else if(full && !row){ //Full column
			for(int i = 0; i < data.length; i++){
				if(data[i][rowOrColNum] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							Point p = new Point(rowOrColNum, i);
							currWall = new Wall(p,p);
						}
						else{
							Point p = new Point(i, rowOrColNum);
							currWall = new Wall(p,p);
						}
						singlePointWall = true;
						foundAWall = true;
					}
				}
				else{ //data[i] != 3
					if(foundAWall){
						if(!singlePointWall){
							walls.add(currWall);
						}
					}
					foundAWall = false;
				}
			}
			if(foundAWall = true){
				if(!singlePointWall){
					walls.add(currWall);
				}
			}
		}
		else{ //Column && full == false
			for(int i = 0; i < data.length; i += 2){
				if(data[i][rowOrColNum] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							Point p = new Point(rowOrColNum, i);
							currWall = new Wall(p,p);
						}
						else{
							Point p = new Point(i, rowOrColNum);
							currWall = new Wall(p,p);
						}
						singlePointWall = true;
						foundAWall = true;
					}
				}
				else{ //data[i] != 3
					if(foundAWall){
						if(!singlePointWall){
							walls.add(currWall);
						}
					}
					foundAWall = false;
				}
			}		
		}
	}
	
	void computeClusterWallIntersections(){
		wallInBetweenClusters = new boolean[numberOfClusters][numberOfClusters];
		//For each pair of clusters, figure out if there's a wall in between them.
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < numberOfClusters; j++){
				if(i == j){
					wallInBetweenClusters[i][j] = false;
				}
				else{
					wallInBetweenClusters[i][j] = clusters.get(i).wallBetween(clusters.get(j), walls);
				}
			}
		}
	}
	
	void findClusters(int[][] data){
		int xDimension = data.length;
		int yDimension = data[0].length;
		
		setDimensions(xDimension,yDimension);
				
		for(int i = 1; i < xDimension; i += 2){
			for(int j = 1; j < yDimension; j += 2){
				if(data[i][j] == 1){
					if(!checkSurroundingPoints(i, j, data)){ //Meaning none of the surrounding points are desks.
						//Time to make a new cluster.
						Cluster newCluster = new Cluster(i, j);
						numberOfClusters++;
						clusters.add(newCluster);
					}
				}
			}
		}
		
		//Merge any clusters that share a point:
		mergeClusters();
		for(int i = 0; i < specialLocations.size(); i++){
			clusters.add(specialLocations.get(i).getPseudoCluster());
		}
	}
	
	void mergeClusters(){
		int numClusters = numberOfClusters;
		
		for(int i = 0; i < numClusters; i++){ //For each cluster:
			for(int j = i + 1; j < numClusters; j++){ //For each of the remaining clusters:
				if(clusters.get(i).sharesADeskWith(clusters.get(j))){ //If the two clusters overlap:
					//Merge the two clusters.
					for(int k = 0; k < clusters.get(j).getNumberOfDesks(); k++){
						if(!clusters.get(i).checkForDesk(clusters.get(j).getDesk(k))){ //If this specific desk is NOT in both clusters
							//Add it to the first cluster
							clusters.get(i).addDesk(clusters.get(j).getDesk(k));
						}
					}
					//Delete the second cluster.
					clusters.remove(j);
					//Reset the loops.
					j = numClusters;
					i = 0;
					numClusters--;
				}
			}
		}
		
		numberOfClusters = numClusters;
		//???????????????????????????????????????
	}
	
	boolean checkIfClustered(int x, int y){
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < clusters.get(i).getNumberOfDesks(); j++){
				if(clusters.get(i).getDesk(j).getPoint().equalsPoint(x,y)){
					return true;
				}
			}
		}
		return false;
	}
	
	//Look at each surround point. If it's a 1 (indicating a desk), check if it has a cluster. If it has a cluster, add the original point
	// to that cluster. 
	boolean checkSurroundingPoints(int x, int y, int[][] data){
		int currentCluster;
		boolean foundACluster = false; //This is what will be returned by this function. If we are unable to find a cluster,
										// we will return false, which will tell the calling function that it needs to make 
										// a new cluster for this point.
		
		if(x != 1 && y != 1){
			//Check above left:
			if(data[x - 2][y - 2] == 1){
				currentCluster = checkForCluster(x - 2, y - 2);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
				}
			}
		}
		
		if(y != 1){
			//Check above:
			if(data[x][y - 2] == 1){
				currentCluster = checkForCluster(x, y - 2);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
				}
			}
			if((x + 2) != data.length){
				//Check above right:
				if(data[x + 2][y - 2] == 1){
					currentCluster = checkForCluster(x + 2, y - 2);
					if(currentCluster != -1){
						if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
							clusters.get(currentCluster).addDesk(x, y);
						}
						foundACluster = true;
					}
				}
			}
		}
		//Check left:
		if(x != 1){
			if(data[x - 2][y] == 1){
				currentCluster = checkForCluster(x - 2, y);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
				}
			}	
			if((y + 2) != data[0].length){
				//Check bottom left:
				if(data[x - 2][y + 2] == 1){
					currentCluster = checkForCluster(x - 2, y + 2);
					if(currentCluster != -1){
						if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
							clusters.get(currentCluster).addDesk(x, y);
						}
						foundACluster = true;
					}
				}
			}
		}
		//Check right:
		if((x + 2) != data.length){
			if(data[x + 2][y] == 1){
				currentCluster = checkForCluster(x + 2, y);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
				}
			}
		}
		if((y + 2) != data[0].length){
			//Check bottom:
			if(data[x][y + 2] == 1){
				currentCluster = checkForCluster(x, y + 2);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
				}
			}
			//Check bottom right:	
			if((x + 2) != data.length){
				if(data[x + 2][y + 2] == 1){
					currentCluster = checkForCluster(x + 2, y + 2);
					if(currentCluster != -1){
						if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
				
							clusters.get(currentCluster).addDesk(x, y);
						}
						foundACluster = true;
					}
				}
			}
		}
		return foundACluster;
	}
		
	int checkForCluster(int x, int y){
		for(int i = 0; i < numberOfClusters; i++){
			if(clusters.get(i).checkForDesk(x,y)){
				return i;
			}
		}
		return -1;
	}

	double getSpecificClusterSimilarity(int i, int j) {
		return similarity.getSpecificClusterSimilarity(i, j);
	}
	
	double getSpecificEmployeeSimilarity(int i, int j){
		return similarity.getSpecificEmployeeSimilarity(i, j);
	}
	
	double getSpecifiedPostAssignmentClusterSimilarity(int i, int j){
		return similarity.getSpecifiedPostAssignmentClusterSimilarity(i, j);
	}

	int getNumberOfSpecialLocations() {
		return specialLocations.size();
	}
}
