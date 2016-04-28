package algorithm;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

import static java.lang.Math.toIntExact;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

class IOParser {
	private File employeeFile;
	private File chartFile;
	private File similarityFile;
	private File outputFile;
	private ArrayList<Employee> employees;
	private int[][] chart, chart2;
	private double[][] employeeSimilarities;
	
	IOParser(File employeeFile, boolean differentiator){
		this.employeeFile = employeeFile;
		parseEmployeeJSON();
	}
	
	IOParser(File employeeFile, File chartFile, File similarityFile){
		this.employeeFile = employeeFile;
		this.chartFile = chartFile;
		this.similarityFile = similarityFile;
		
		parseChartJSON();
		parseEmployeeJSON();
		parseSimilarityJSON();
	}
	
	@SuppressWarnings("unchecked")
	void createOutputFile(Chart finalChart, File userOutputFile){
		
		//Put employees in an array based on their desks. 
		Employee arrayOfEmployees[][] = new Employee[chart.length][chart[0].length];
		double currX, currY;
		for(int i = 0; i < finalChart.getNumberOfClusters(); i++){
			for(int j = 0; j < finalChart.getCluster(i).getNumberOfEmployees(); j++){
				currX = finalChart.getCluster(i).getDesk(j).getPoint().getX();
				currY = finalChart.getCluster(i).getDesk(j).getPoint().getY();
				arrayOfEmployees[(int)currX][(int)currY] = finalChart.getCluster(i).getDesk(j).getEmployee(); 
			}
		}
		
		JSONArray outerArray = new JSONArray();
		for(int i = 1; i < (chart.length - 1); i++){ //Change to only include inner area (not border walls)
			JSONArray innerArray = new JSONArray();
			for(int j = 1; j < (chart[0].length - 1); j++){
				JSONObject currentSpot = new JSONObject();
				JSONObject currentID = new JSONObject();
				currentID.put("col", (j - 1));
				currentID.put("row", (i - 1));
				String str = (i - 1) + "-" + (j - 1);
				currentID.put("str", str);
				currentSpot.put("id", currentID);
				if(((i % 2) == 0) && ((j % 2) == 0)){ //Should be "invisible"
					/*
					          "meta": {},
      						  "type": {
        						"id": "INVISIBLE"
      						  },
      						  "userId": null
					 */
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "INVISIBLE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 1){ //AKA desk
					//Get employee at current desk.
					Employee currentEmployee = arrayOfEmployees[i][j];
					
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Desk");
					currentType.put("id", "DESK");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					if(currentEmployee == null){
						currentSpot.put("userId", null);
					}
					else{
						currentSpot.put("userId", currentEmployee.getID());
					}
				}
				else if(chart[i][j] == 2){ //AKA empty wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", false);
					currentSpot.put("type", currentType);	
				}
				else if(chart[i][j] == 3){ //AKA wall
					JSONObject currentType = new JSONObject();
					currentType.put("desc", "Wall");
					currentType.put("id", "WALL");
					
					JSONObject currentOrientation = new JSONObject();
					if((i % 2) == 0){
						currentOrientation.put("desc", "Horizontal");
						currentOrientation.put("id", "HORIZONTAL");
					}
					else{
						currentOrientation.put("desc", "Vertical");
						currentOrientation.put("id", "VERTICAL");
					}
					
					currentType.put("orientation", currentOrientation);
					
					currentSpot.put("isPresent", true);
					currentSpot.put("type", currentType);
					

				}
				else if(chart[i][j] == 4){ //AKA restroom 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "RESTROOM");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 5){ //AKA conference 
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "CONFERENCE");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 6){ //AKA air conditioner
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "AIRCONDITIONER");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else if(chart[i][j] == 7){ //AKA Kitchen
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "KITCHEN");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				else{ //For now let's just put everything else in as empty space.
					JSONObject currentMeta = new JSONObject();
					JSONObject currentType = new JSONObject();
					currentType.put("id", "EMPTY");
					
					currentSpot.put("meta", currentMeta);
					currentSpot.put("type", currentType);
					currentSpot.put("userId", null);
				}
				
				innerArray.add(currentSpot);
			}
			outerArray.add(innerArray);
		}

		if(userOutputFile == null){
			outputFile = new File("Output.json");
		}
		else{
			outputFile = userOutputFile;
		}
		
		try {
			//outputFile = new File("Output.json");
			FileWriter fileWriter = new FileWriter(outputFile);
			fileWriter.write(outerArray.toJSONString());
			fileWriter.flush();
			fileWriter.close();

		} catch (IOException e) {
			e.printStackTrace();
		}
	}
		
	private void parseSimilarityJSON(){
		employeeSimilarities = new double[employees.size()][employees.size()];
		
		JSONParser parser = new JSONParser();
		
		Object obj = null;
		try {
			obj = parser.parse(new FileReader(similarityFile));
			//obj = parser.parse(new FileReader("C:\\Users\\Jack Bankston\\Desktop\\spots-data-structure.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		JSONArray jsonArray = (JSONArray) obj;
		
		for(int i = 0; i < jsonArray.size(); i++){
			JSONObject currSim = (JSONObject) jsonArray.get(i);
			
			int spotInArray1 = getSpotInArrayByID(toIntExact((long)currSim.get("employeeId1")));
			int spotInArray2 = getSpotInArrayByID(toIntExact((long)currSim.get("employeeId2")));
			
			Long currentSim = new Long((long)currSim.get("similarity"));
			employeeSimilarities[spotInArray1][spotInArray2] = currentSim.doubleValue();
			employeeSimilarities[spotInArray2][spotInArray1] = currentSim.doubleValue();
		}
		
	}
	
	private int getSpotInArrayByID(int id){
		for(int i = 0; i < employees.size(); i++){
			if(employees.get(i).getID() == id){
				return employees.get(i).getSpotInArray();
			}
		}
		return 0;
	}
	
	private void parseEmployeeJSON(){
		employees = new ArrayList<Employee>();
		
		JSONParser parser = new JSONParser();

		Object obj = null;
		try {
			obj = parser.parse(new FileReader(employeeFile));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		JSONArray jsonArray = (JSONArray) obj;
		
		for(int i = 0; i < jsonArray.size(); i++){
			//Make a new employee out of employee information at current object. 
			JSONObject currentEmployee = (JSONObject) jsonArray.get(i);
			
			employees.add(new Employee(toIntExact((long)currentEmployee.get("employeeID"))));
			
			int currentRestroomUsage = toIntExact((long)currentEmployee.get("restroomUsage"));
			int currentNoisePreference = toIntExact((long)currentEmployee.get("noisePreference"));
			int currentOutOfDesk = toIntExact((long)currentEmployee.get("outOfDesk"));
			
			employees.get(i).setRestroomUsage(currentRestroomUsage);
			employees.get(i).setRestroomUsage(currentNoisePreference);
			employees.get(i).setRestroomUsage(currentOutOfDesk);
		}
		
		for(int i = 0; i < employees.size(); i++){
			employees.get(i).setSpotInArray(i);
		}
		
	}
	
	private void parseChartJSON(){
		JSONParser parser = new JSONParser();
		
		Object obj = null;
		try {
			obj = parser.parse(new FileReader(chartFile));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		
		JSONArray jsonArray = (JSONArray) obj;
		
		for(int h = 0; h < jsonArray.size(); h++){
			JSONArray currentArray = (JSONArray) jsonArray.get(h);
			if(h == 0){
				chart2 = new int[jsonArray.size()][currentArray.size()];
			}
			for(int i = 0; i < currentArray.size(); i++){
				JSONObject currentSpot = (JSONObject) currentArray.get(i);
				JSONObject currentID = (JSONObject) currentSpot.get("id");
				chart2[toIntExact((Long)currentID.get("row"))][toIntExact((Long)currentID.get("col"))] = spotToInt(currentSpot);
			}
		}
		
		dealWithInvisibleSpots();
		
		addWallBorder();
	}
	
	//Add border of 3s (to represent a wall) around the chart. 
	private void addWallBorder(){
		int dim1 = chart2.length;
		int dim2 = chart2[0].length;
				
		//Chart needs to be 2 bigger in each dimension;
		chart = new int[dim1 + 2][dim2 + 2];
		
		for(int i = 0; i < (dim2 + 2); i++){
			chart[0][i] = 3;
		}
		for(int i = 0; i < (dim2 + 2); i++){
			chart[dim1 + 1][i] = 3;
		}
		for(int i = 0; i < (dim1 + 2); i++){
			chart[i][0] = 3;
		}
		for(int i = 0; i < (dim1 + 2); i++){
			chart[i][dim2 + 1] = 3;
		}
		
		for(int i = 0; i < dim1; i++){
			for(int j = 0; j < dim2; j++){
				chart[i + 1][j + 1] = chart2[i][j];
			}
		}
	}
	
	private void dealWithInvisibleSpots(){
		int dim1 = chart2.length;
		int dim2 = chart2[0].length;
		
		for(int i = 0; i < dim1; i++){
			for(int j = 0; j < dim2; j++){
				if(chart2[i][j] == -1){
					if(searchSurroundingPointsForAWall(i,j)){
						chart2[i][j] = 3;
					}
					else{
						chart2[i][j] = 2;
					}
				}
			}
		}
	}
	
	private boolean searchSurroundingPointsForAWall(int x, int y){
		//Check 4 non-diagonal surrounding points for a wall.
		int xMax = chart2.length;
		int yMax =  chart2[0].length;
		if(x != 0){
			if(chart2[x - 1][y] == 3){
				return true;
			}
		}
		if(y != 0){
			if(chart2[x][y-1] == 3){
				return true;
			}
		}
		if((x + 1) < xMax){
			if(chart2[x+1][y] == 3){
				return true;
			}
		}
		if((y + 1) < yMax){
			if(chart2[x][y+1] == 3){
				return true;
			}
		}
		return false;
	}
	
	private int spotToInt(JSONObject spot){
		JSONObject typeObject = (JSONObject) spot.get("type");
		String typeIDString = (String) typeObject.get("id");
		if(typeIDString.equalsIgnoreCase("desk")){
			return 1;
		}
		if(typeIDString.equalsIgnoreCase("restroom")){
			return 4;
		}
		if(typeIDString.equalsIgnoreCase("conference")){
			return 5;
		}
		if(typeIDString.equalsIgnoreCase("airconditioner")){
			return 6;
		}
		if(typeIDString.equalsIgnoreCase("kitchen")){
			return 7;
		}
		if(typeIDString.equalsIgnoreCase("wall")){
			boolean isPresent = (boolean) spot.get("isPresent");
			if(isPresent){
				return 3;
			}
			else{
				return 2;
			}
		}
		if(typeIDString.equalsIgnoreCase("invisible")){
			return -1;
		}
		return 0;
	}

	ArrayList<Employee> getEmployeeArrayList(){
		return employees;
	}

	int[][] getChartIntegerArray(){
		return chart;
	}
	
	double[][] getEmployeeSimilaritiesArray(){
		return employeeSimilarities;
	}
}
