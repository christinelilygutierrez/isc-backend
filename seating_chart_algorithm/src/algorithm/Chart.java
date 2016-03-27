package algorithm;
import java.util.ArrayList;


public class Chart {
	
	private ArrayList<Cluster> clusters;
	private ArrayList<Wall> walls, singlePointWalls;
	private ArrayList<SpecialLocation> specialLocations;
	private int numberOfClusters, numberOfWalls, numberOfEmployees;
	private int xDim, yDim;
	private boolean[][] wallInBetweenClusters;
	private Similarity similarity;
	
	public Chart(){
		numberOfClusters = 0;
		clusters = new ArrayList<Cluster>();
		walls = new ArrayList<Wall>();
		singlePointWalls = new ArrayList<Wall>();
		specialLocations = new ArrayList<SpecialLocation>();
		similarity = new Similarity();
	}
	
	public Chart(IOParser iop){
		numberOfClusters = 0;
		clusters = new ArrayList<Cluster>();
		walls = new ArrayList<Wall>();
		singlePointWalls = new ArrayList<Wall>();
		specialLocations = new ArrayList<SpecialLocation>();
		similarity = new Similarity();
		
		if(iop.jsonSimilaritiesArePresent()){
			similarity.setEmployeeSimilarities(iop.getEmployeeSimilaritiesArray());
		}
		else{
			findEmployeeSimilarities(iop.getEmployeeArrayList());
		}
	}
	
	public void findEmployeeSimilarities(ArrayList<Employee> employees){
		similarity.computeEmployeeSimilarities(employees, specialLocations);
	}
	
	public double[][] getEmployeeSimilaritiesArray(){
		return similarity.getEmployeeSimilarities();
	}
	
	public void setEmployeeSimilaritiesArray(double[][] sims){
		similarity.setEmployeeSimilarities(sims);
	}
	
	public double[][] getClusterSimilaritiesArray(){
		return similarity.getClusterSimilarities();
	}
	
	public double[][] getPostAssignmentClusterSimilarities(){
		return similarity.getPostAssignmentClusterSimilarities();
	}
	
	public void findClusterSimilarities(){
		similarity.computeClusterSimilarities(clusters, this);
	}
	
	public void findPostAssignmentClusterSimilarities(){
		similarity.computePostAssignmentClusterSimilarities(this);
	}
	
	public void setDimensions(int x, int y){
		xDim = x;
		yDim = y;
	}
	
	public int getXDim(){
		return xDim;
	}
	
	public int getYDim(){
		return yDim;
	}
	
	public int getNumberOfEmployees(){
		return numberOfEmployees;
	}
	
	public void setNumberOfEmployees(int num){
		numberOfEmployees = num;
	}
	
	public Cluster getCluster(int i){
		return clusters.get(i);
	}
	
	public SpecialLocation getSpecialLocation(int i){
		return specialLocations.get(i);
	}
	
	public void addSpecialLocation(int type, double x, double y){
		specialLocations.add(new SpecialLocation(type, new Point(x,y)));
	}
	
	public Wall getWall(int i){
		return walls.get(i);
	}
	
	public ArrayList<Wall> getWallsArrayList(){
		return walls;
	}
	
	public int getNumberOfClusters(){
		return numberOfClusters;
	}
	
	public int getNumberOfWalls(){
		return walls.size();
	}
	
	//Find locations in the chart that are not walls, empty walls, desks, or empty space.
	public void findSpecialLocations(int[][] data){
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
		//System.out.println("(" + x1 + "," + y1 + ") is not next to (" + x2 + "," + y2 + ")");
		return false;
	}
	
	public void printWalls(){
		for(int i = 0; i < numberOfWalls; i++){
			System.out.println(" Wall " + i + ": " + walls.get(i).getFirstPoint().toString() + " to " + walls.get(i).getSecondPoint().toString());
		}
	}
	
	public void newFindWalls(int[][] data){
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
		//findWallsInRowOrColumn(data, true, true, 0);
		//findWallsInRowOrColumn(data, false, true, 0);
		
		/*System.out.println("\nNumber of single walls: " + singlePointWalls.size());
		for(int i = 0; i < singlePointWalls.size(); i++){
			System.out.println(singlePointWalls.get(i).getFirstPoint().toString());
		}*/
	}

	private boolean searchSurroundingPointsForAWall(int[][] data, int x, int y){
		//Check 4 non-diagonal surrounding points for a wall.
		//System.out.println("Point: (" + x + "," + y + ")");
		int xMax = data.length;
		int yMax =  data[0].length;
		if(x != 0){
			if(data[x - 1][y] == 3){
				//System.out.println("\t(" + (x-1) + "," + y + ") is a wall.");
				return true;
			}
		}
		if(y != 0){
			if(data[x][y-1] == 3){
				//System.out.println("\t(" + x + "," + (y-1) + ") is a wall.");
				return true;
			}
		}
		if((x + 1) < xMax){
			if(data[x+1][y] == 3){
				//System.out.println("\t(" + (x+1) + "," + y + ") is a wall.");
				return true;
			}
		}
		if((y + 1) < yMax){
			if(data[x][y+1] == 3){
				//System.out.println("\t(" + x + "," + (y+1) + ") is a wall.");
				return true;
			}
		}
		//System.out.println("(" + x + "," + ") is a single point");
		return false;
	}
	
	private void findWallsInRowOrColumn(int[][] data, boolean row, boolean full, int rowOrColNum){
		Wall currWall = null;
		boolean singlePointWall = false;
		boolean foundAWall = false;
		if(full && row){ //Full row
			//System.out.println("data length: " + data[rowOrColNum].length);
			for(int i = 0; i < data[rowOrColNum].length; i++){
				//System.out.print(data[rowOrColNum][i] + " ");
				if(data[rowOrColNum][i] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
							//System.out.print(" - New second point - ");
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							//System.out.print("Point: (" + rowOrColNum + "," + i + ") ");
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
			//System.out.println("data length: " + data.length);
			for(int i = 0; i < data.length; i++){
				//System.out.print(data[i][rowOrColNum] + " ");
				if(data[i][rowOrColNum] == 3){
					if(foundAWall){
						if(row){
							currWall.setSecondPoint(new Point(rowOrColNum, i));
							//System.out.print(" - New second point - ");
						}
						else{
							currWall.setSecondPoint(new Point(i, rowOrColNum));
						}
						singlePointWall = false;
					}
					else{
						if(row){
							//System.out.print("Point: (" + rowOrColNum + "," + i + ") ");
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
			//System.out.println("Col data length: " + data.length);
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
	
	public void findWalls(int[][] data){
		int xDimension = data.length;
		int yDimension = data[0].length;
		
		System.out.println("xdim: " + xDimension);
		System.out.println("ydim: " + yDimension);
		
		boolean lookingForWall;
		int curr = 0;
		//First find horizontal walls:
		for(int i = 0; i < xDimension; i += 2){
			lookingForWall = true;
			for(int j = 0; j < yDimension; j++){
				if(lookingForWall){
					//Check if we've found a wall.
					if(data[i][j] == 3){
						curr = j;
						lookingForWall = false;
					}
				}
				else{ //We need to check whether the current point is also part of the wall.
					//System.out.println("i : " + i + " j : " + j);
					if(data[i][j] != 3){ //We've reached the end of the wall.
						//Time to make a new wall and add it to the walls array list
						//	Unless this wall only has a width of one.
						if(!(curr == (j - 1))){
							Wall newWall = new Wall(i, curr, i, j - 1);
							walls.add(newWall);
							numberOfWalls++;
						}
						lookingForWall = true;
					}
				}
			}
			//We need to check if the last thing on this row was part of a wall.
			if(!lookingForWall && curr != (yDimension - 1)){
				Wall newWall = new Wall(i, curr, i, (yDimension - 1));
				walls.add(newWall);
				numberOfWalls++;
			}
		}
		
		//Next find vertical walls:
		for(int i = 0; i < yDimension; i += 2){
			lookingForWall = true;
			for(int j = 0; j < xDimension; j += 1){
				if(lookingForWall){
					//Check if we've found a wall.
					if(data[j][i] == 3){
						curr = j;
						lookingForWall = false;
					}
				}
				else{ //We need to check whether the current point is also part of the wall.
					if(data[j][i] != 3){ //We've reached the end of the wall.
						//Time to make a new wall and add it to the walls array list
						//	Unless this wall only has a width of one.
						//System.out.println("GAP i : " + i + " j : " + j);
						if(!(curr == (j - 1))){
							Wall newWall = new Wall(curr, i, j - 1, i);
							walls.add(newWall);
							numberOfWalls++;
						}
						else{
							//We've found a single block on it's own. We have to check if the cells around it are walls.
							if(i != 0 && i != yDimension){
								System.out.println("i: " + i);
								System.out.println("j: " + j);
								if(!(data[i - 1][j - 1] == 3 || data[i + 1][j - 1] == 3) ){
									Wall newWall = new Wall(curr, i, j - 1, i);
									walls.add(newWall);
									numberOfWalls++;
								}
							}
							else if(i != 0){
								if(!(data[i - 1][j - 1] == 3)){
									Wall newWall = new Wall(curr, i, j - 1, i);
									walls.add(newWall);
									numberOfWalls++;
								}
							}
							else{
								if(!(data[i + 1][j - 1] == 3)){
									Wall newWall = new Wall(curr, i, j - 1, i);
									walls.add(newWall);
									numberOfWalls++;
								}
							}
						}
						lookingForWall = true;
					}
				}
			}
			//We need to check if the last thing on this row was part of a wall.
			if(!lookingForWall && curr != (xDimension - 1)){
				Wall newWall = new Wall(curr, i, (xDimension - 1), i);
				walls.add(newWall);
				numberOfWalls++;
			}
		}
	}
	
	public void computeClusterWallIntersections(){
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
	
	public void printClusterWallIntersections(){
		System.out.println("CLUSTER INTERSECTIONS:");
		for(int i = 0; i < numberOfClusters; i++){
			System.out.println("Cluster " + i + " (Middle: " + clusters.get(i).getMiddle().toString() + "):");
			for(int j = 0; j < numberOfClusters; j++){
				if(wallInBetweenClusters[i][j]){
					System.out.println("\t" + j + " (Middle: " + clusters.get(j).getMiddle().toString() + "):");
				}
			}
		}
	}
	
	public void findClusters(int[][] data){
		int xDimension = data.length;
		int yDimension = data[0].length;
		
		setDimensions(xDimension,yDimension);
		
		//System.out.println("X DIMENSION: " + xDimension + " Y DIMENSION: " + yDimension);
		
		for(int i = 1; i < xDimension; i += 2){
			for(int j = 1; j < yDimension; j += 2){
				if(data[i][j] == 1){
					if(!checkSurroundingPoints(i, j, data)){ //Meaning none of the surrounding points are desks.
						//Time to make a new cluster.
						//System.out.println("Making a new cluster!");
						Cluster newCluster = new Cluster(i, j);
						numberOfClusters++;
						clusters.add(newCluster);
					}
				}
			}
		}
		
		//printClusters();
		
		//Merge any clusters that share a point:
		mergeClusters();
	}
	
	public void mergeClusters(){
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
	
	public boolean checkIfClustered(int x, int y){
		for(int i = 0; i < numberOfClusters; i++){
			for(int j = 0; j < clusters.get(i).getNumberOfDesks(); j++){
				if(clusters.get(i).getDesk(j).getPoint().equalsPoint(x,y)){
					return true;
				}
			}
		}
		return false;
	}
	
	public void printClusters(){
		System.out.println("Print Clusters:");
		for(int i = 0; i < numberOfClusters; i++){
			System.out.println("Cluster " + (i + 1) + ":");
			for(int j = 0; j < clusters.get(i).getNumberOfDesks(); j++){
				System.out.print(clusters.get(i).getDesk(j).getPoint().toString());
				
				if(!clusters.get(i).getDesk(j).checkIfOpen()){ //If the desk has someone sitting at it.
					System.out.print("(employee: " + clusters.get(i).getDesk(j).getEmployee().getID() + ")");
				}
				
				System.out.print(" ");
			}
			System.out.println("-- Middle:" + clusters.get(i).getMiddle().toString());
		}
	}
	
	//Look at each surround point. If it's a 1 (indicating a desk), check if it has a cluster. If it has a cluster, add the original point
	// to that cluster. 
	public boolean checkSurroundingPoints(int x, int y, int[][] data){
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
					//System.out.println("Found a cluster with a surrounding point!");
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
					//System.out.println("Found a cluster with a surrounding point!");
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
						//System.out.println("Found a cluster with a surrounding point!");
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
					//System.out.println("Found a cluster with a surrounding point!");
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
						//System.out.println("Found a cluster with a surrounding point!");
					}
				}
			}
		}
		//Check right:
		if((x + 2) != data.length){
			if(data[x + 2][y] == 1){
				//System.out.println("X: " + x + " Y: " + y);
				currentCluster = checkForCluster(x + 2, y);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
					//System.out.println("Found a cluster with a surrounding point!");
				}
			}
		}
		if((y + 2) != data[0].length){
			//Check bottom:
			//System.out.println("Length: " + data[0].length);
			//System.out.println("Y: " + (y + 1));
			if(data[x][y + 2] == 1){
				currentCluster = checkForCluster(x, y + 2);
				if(currentCluster != -1){
					if(!clusters.get(currentCluster).checkForDesk(x, y)){ //We want to make sure this point isn't already in this cluster. 
						clusters.get(currentCluster).addDesk(x, y);
					}
					foundACluster = true;
					//System.out.println("Found a cluster with a surrounding point!");
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
						//System.out.println("Found a cluster with a surrounding point!");
					}
				}
			}
		}
		return foundACluster;
	}
		
	public int checkForCluster(int x, int y){
		//System.out.println("Here.");
		for(int i = 0; i < numberOfClusters; i++){
			//System.out.println("here?");
			if(clusters.get(i).checkForDesk(x,y)){
				//System.out.println("We are returning " + i);
				return i;
			}
		}
		//System.out.println("We are returning -1");
		return -1;
	}

	public double getSpecificClusterSimilarity(int i, int j) {
		return similarity.getSpecificClusterSimilarity(i, j);
	}
	
	public double getSpecificEmployeeSimilarity(int i, int j){
		return similarity.getSpecificEmployeeSimilarity(i, j);
	}
	
	public double getSpecifiedPostAssignmentClusterSimilarity(int i, int j){
		return similarity.getSpecifiedPostAssignmentClusterSimilarity(i, j);
	}

	public int getNumberOfSpecialLocations() {
		return specialLocations.size();
	}
}
